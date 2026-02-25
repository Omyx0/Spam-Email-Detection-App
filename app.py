from flask import Flask, render_template, request
import pandas as pd
import re

app = Flask(__name__)

data = pd.read_csv("mail_data.csv")

def rule_based_spam_detector(message):
    spam_score = 0
    message_lower = message.lower()

    spam_keywords = [
        "free", "win", "winner", "cash", "offer",
        "urgent", "claim", "prize", "congratulations",
        "lottery", "limited", "click", "buy now","missed", "important", "exclusive", "deal"
    ]

    
    for word in spam_keywords:
        if word in message_lower:
            spam_score += 2

    if message.count("!") > 2:
        spam_score += 1

    if re.search(r'http[s]?://', message):
        spam_score += 2

    if spam_score >= 3:
        return "SPAM", spam_score
    else:
        return "HAM", spam_score



def evaluate_model():
    correct = 0

    for index, row in data.iterrows():
        prediction, _ = rule_based_spam_detector(row["Message"])
        actual = row["Category"].upper()

        if prediction == actual:
            correct += 1

    accuracy = correct / len(data) * 100
    print("Model Accuracy:", accuracy)

evaluate_model()


@app.route("/", methods=["GET", "POST"])
def home():
    result = None
    score = None

    if request.method == "POST":
        email_text = request.form["email_text"]
        result, score = rule_based_spam_detector(email_text)

    return render_template("index.html", result=result, score=score)


if __name__ == "__main__":
   app.run(debug=True, host="0.0.0.0", port=5000)