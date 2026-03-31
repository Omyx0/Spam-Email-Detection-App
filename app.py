from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import pandas as pd
import os
import json
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow, Flow
from googleapiclient.discovery import build

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Allow HTTP for local dev
os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'  # Prevent crash if Google returns scopes in different order

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app, supports_credentials=True)

# --- ML Model Training ---
print("Training ML Model on mail_data.csv...")
data = pd.read_csv("mail_data.csv")
data = data.dropna(subset=['Message', 'Category'])
X = data["Message"]
y = data["Category"].str.upper()

vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
X_vec = vectorizer.fit_transform(X)

model = MultinomialNB()
model.fit(X_vec, y)
print("ML Model training complete.")

HISTORY_CSV = 'scan_history.csv'

import re

def categorize_spam(message):
    """Categorize spam based on keyword heuristics."""
    message_lower = message.lower()
    
    scam_patterns = {
        "Delivery Scam": [r"package", r"delivery", r"courier", r"dhl", r"fedex", r"usps", r"address.*incomplete", r"redelivery", r"parcel"],
        "Investment/Crypto Scam": [r"investment", r"crypto", r"bitcoin", r"double your money", r"guaranteed profit", r"wallet", r"earnings"],
        "Phishing/Account Verification": [r"verify your account", r"account suspended", r"password reset", r"unauthorized access", r"login attempt", r"action required", r"bank"],
        "Lottery/Prize Scam": [r"lottery", r"prize", r"winner", r"congratulations", r"won", r"claim your", r"jackpot", r"reward"],
        "Invoice/Billing Scam": [r"invoice", r"billing", r"subscription", r"auto-renew", r"payment received", r"receipt", r"norton", r"mcafee"]
    }
    
    for category, patterns in scam_patterns.items():
        for pattern in patterns:
            if re.search(pattern, message_lower):
                return category
    
    return "General Spam"

def predict_spam(message):
    if not message or not isinstance(message, str):
        message = ""
    msg_vec = vectorizer.transform([message])
    prediction = model.predict(msg_vec)[0]
    probs = model.predict_proba(msg_vec)[0]
    spam_index = list(model.classes_).index("SPAM")
    
    # Always return spam probability as score (high = spam, low = safe)
    spam_score = round(probs[spam_index] * 100, 1)
    
    category = None
    if prediction == "SPAM":
        category = categorize_spam(message)
        
    return prediction, spam_score, category


def save_to_history(sender, message, result, score, category=None, source="manual"):
    """Save scan result to CSV history."""
    new_row = pd.DataFrame([{
        'Date': datetime.now().isoformat(),
        'Sender': sender,
        'Message': message[:200],
        'Result': result,
        'Score': score,
        'Category': category if category else "N/A",
        'Source': source
    }])
    if os.path.exists(HISTORY_CSV):
        existing = pd.read_csv(HISTORY_CSV)
        combined = pd.concat([new_row, existing], ignore_index=True)
        # Keep only last 200 records
        combined = combined.head(200)
    else:
        combined = new_row
    combined.to_csv(HISTORY_CSV, index=False)


# --- Gmail API Setup ---
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
]

def get_gmail_service():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return build('gmail', 'v1', credentials=creds)


@app.route("/", methods=["GET", "POST"])
def home():
    result = None
    score = None
    email_text = ""
    error = None

    if request.method == "POST":
        email_text = request.form.get("email_text", "")
        if email_text.strip():
            result, raw_score, category = predict_spam(email_text)
            score = f"{raw_score}%"
        else:
            error = "Please enter some text."

    return render_template("index.html", result=result, score=score, email_text=email_text, error=error)


@app.route("/fetch_gmail", methods=["POST"])
def fetch_gmail():
    error = None
    emails_data = []
    
    try:
        service = get_gmail_service()
        # 1. Fetch the last 20 messages
        results = service.users().messages().list(userId='me', maxResults=20).execute()
        messages = results.get('messages', [])
        
        if not messages:
            error = "No recent messages found in your Gmail inbox."
        else:
            new_emails = []
            # Fetch details for each message
            for m in messages:
                msg_id = m['id']
                try:
                    msg = service.users().messages().get(userId='me', id=msg_id, format='full').execute()
                    snippet = msg.get('snippet', '')
                    
                    # Extract Sender Name from headers
                    headers = msg.get('payload', {}).get('headers', [])
                    sender = "Unknown Sender"
                    for h in headers:
                        if h.get('name', '').lower() == 'from':
                            sender = h.get('value')
                            break
                            
                    new_emails.append({'Sender': sender, 'Message': snippet})
                    
                except Exception as inner_e:
                    print(f"Error fetching message {msg_id}: {inner_e}")
                    continue
                    
            # Handle CSV append logic
            csv_path = 'fetched_emails.csv'
            new_df = pd.DataFrame(new_emails)
            
            if os.path.exists(csv_path):
                existing_df = pd.read_csv(csv_path)
                combined_df = pd.concat([new_df, existing_df], ignore_index=True)
                # Drop duplicates to prevent redundant logging
                combined_df = combined_df.drop_duplicates(subset=['Message'], keep='first')
            else:
                combined_df = new_df
                
            combined_df.to_csv(csv_path, index=False)
            
            # Read from the combined dataframe and predict
            for index, row in combined_df.iterrows():
                sender = row['Sender']
                snippet = str(row['Message']) if pd.notna(row['Message']) else ""
                
                prediction, raw_score, category = predict_spam(snippet)
                
                emails_data.append({
                    'sender': sender,
                    'snippet': snippet,
                    'result': prediction,
                    'score': f"{raw_score}%",
                    'category': category
                })
            
    except Exception as e:
        error = f"Gmail Fetch Error: {str(e)}"
        
    return render_template("index.html", emails=emails_data, error=error)


# --- Google OAuth Authentication Routes ---

def get_google_flow():
    """Create a Google OAuth2 flow for web login."""
    if not os.path.exists('credentials.json'):
        raise FileNotFoundError(
            "Google OAuth credentials file 'credentials.json' not found. "
            "Please download it from the Google Cloud Console (APIs & Services > Credentials) "
            "and place it in the project root directory."
        )

    # Read credentials.json and adapt for web flow
    with open('credentials.json', 'r') as f:
        cred_data = json.load(f)

    # Support both 'installed' and 'web' credential types
    cred_section = cred_data.get('installed') or cred_data.get('web')
    if not cred_section:
        raise ValueError(
            "Invalid credentials.json format. Expected 'installed' or 'web' key."
        )

    # Convert credentials to web flow format
    client_config = {
        'web': {
            'client_id': cred_section['client_id'],
            'client_secret': cred_section['client_secret'],
            'auth_uri': cred_section['auth_uri'],
            'token_uri': cred_section['token_uri'],
            'redirect_uris': ['http://localhost:5000/api/auth/google/callback']
        }
    }

    flow = Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri='http://localhost:5000/api/auth/google/callback'
    )
    return flow


@app.route("/api/auth/google/login", methods=["GET"])
def google_login():
    """Redirect user to Google OAuth consent screen."""
    try:
        flow = get_google_flow()
    except FileNotFoundError as e:
        return jsonify({
            "error": "credentials_missing",
            "message": str(e)
        }), 503
    except (ValueError, KeyError) as e:
        return jsonify({
            "error": "credentials_invalid",
            "message": f"Invalid credentials.json: {str(e)}"
        }), 503
    except Exception as e:
        return jsonify({
            "error": "oauth_setup_failed",
            "message": f"OAuth setup error: {str(e)}"
        }), 500

    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    # Store state and PKCE code_verifier in session for callback
    session['oauth_state'] = state
    session['code_verifier'] = flow.code_verifier
    return redirect(authorization_url)


@app.route("/api/auth/google/callback", methods=["GET"])
def google_callback():
    """Handle Google OAuth callback, fetch user info, save token."""
    flow = get_google_flow()
    # Restore PKCE code_verifier from session
    flow.code_verifier = session.pop('code_verifier', None)
    flow.fetch_token(authorization_response=request.url)
    
    credentials = flow.credentials
    
    # Save token for Gmail API access
    with open('token.json', 'w') as token_file:
        token_file.write(credentials.to_json())
    
    # Get user info from Google
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    
    try:
        user_info_service = build('oauth2', 'v2', credentials=credentials)
        user_info = user_info_service.userinfo().get().execute()
        
        session['user'] = {
            'email': user_info.get('email', ''),
            'name': user_info.get('name', user_info.get('email', '').split('@')[0]),
            'picture': user_info.get('picture', '')
        }
    except Exception as e:
        print(f"Error fetching user info: {e}")
        session['user'] = {
            'email': 'user@gmail.com',
            'name': 'User',
            'picture': ''
        }
    
    # Redirect to frontend dashboard
    return redirect('http://localhost:8080/dashboard')


@app.route("/api/auth/user", methods=["GET"])
def get_user():
    """Return current authenticated user info."""
    user = session.get('user')
    if user:
        return jsonify({"authenticated": True, "user": user})
    return jsonify({"authenticated": False, "user": None})


@app.route("/api/auth/logout", methods=["POST"])
def auth_logout():
    """Clear user session."""
    session.pop('user', None)
    return jsonify({"status": "logged_out"})


# --- JSON API Routes for React Frontend ---

@app.route("/api/health", methods=["GET"])
def api_health():
    return jsonify({"status": "ok"})


@app.route("/api/analyze", methods=["POST"])
def api_analyze():
    data = request.get_json()
    email_text = data.get("email_text", "") if data else ""

    if not email_text.strip():
        return jsonify({"error": "Please enter some text."}), 400

    result, score, category = predict_spam(email_text)
    
    # Save to CSV history
    save_to_history("Manual Input", email_text, result, score, category=category, source="manual")
    
    return jsonify({
        "result": result,
        "score": score,
        "category": category,
        "isSpam": result == "SPAM"
    })


@app.route("/api/fetch-gmail", methods=["POST"])
def api_fetch_gmail():
    try:
        service = get_gmail_service()
        results = service.users().messages().list(userId='me', maxResults=20).execute()
        messages = results.get('messages', [])

        if not messages:
            return jsonify({"emails": [], "message": "No recent messages found."})

        emails_data = []
        for m in messages:
            msg_id = m['id']
            try:
                msg = service.users().messages().get(userId='me', id=msg_id, format='full').execute()
                snippet = msg.get('snippet', '')

                headers = msg.get('payload', {}).get('headers', [])
                sender = "Unknown Sender"
                subject = "(No Subject)"
                for h in headers:
                    if h.get('name', '').lower() == 'from':
                        sender = h.get('value')
                    if h.get('name', '').lower() == 'subject':
                        subject = h.get('value')

                prediction, score, category = predict_spam(snippet)
                
                # Save each scanned email to CSV history
                save_to_history(sender, snippet, prediction, score, category=category, source="gmail")
                
                emails_data.append({
                    'sender': sender,
                    'subject': subject,
                    'snippet': snippet,
                    'result': prediction,
                    'score': score,
                    'category': category,
                    'isSpam': prediction == "SPAM"
                })
            except Exception as inner_e:
                print(f"Error fetching message {msg_id}: {inner_e}")
                continue

        return jsonify({"emails": emails_data})

    except Exception as e:
        return jsonify({"error": f"Gmail Fetch Error: {str(e)}"}), 500


@app.route("/api/history", methods=["GET"])
def api_history():
    """Return scan history from CSV."""
    if not os.path.exists(HISTORY_CSV):
        return jsonify({"history": []})
    
    try:
        df = pd.read_csv(HISTORY_CSV)
        history = []
        for _, row in df.iterrows():
            history.append({
                'date': str(row.get('Date', '')),
                'sender': str(row.get('Sender', 'Unknown')),
                'message': str(row.get('Message', '')),
                'result': str(row.get('Result', '')),
                'score': float(row.get('Score', 0)),
                'category': str(row.get('Category', 'N/A')),
                'source': str(row.get('Source', 'manual')),
                'isSpam': str(row.get('Result', '')).upper() == 'SPAM'
            })
        return jsonify({"history": history})
    except Exception as e:
        return jsonify({"error": str(e), "history": []})


@app.route("/api/history/clear", methods=["POST"])
def api_clear_history():
    """Clear scan history CSV."""
    if os.path.exists(HISTORY_CSV):
        os.remove(HISTORY_CSV)
    return jsonify({"status": "cleared"})


if __name__ == "__main__":
   app.run(debug=True, host="0.0.0.0", port=5000)