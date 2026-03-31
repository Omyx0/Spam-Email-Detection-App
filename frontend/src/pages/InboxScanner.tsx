import { useState } from "react";
import { motion } from "framer-motion";
import { Inbox as InboxIcon, Search, AlertTriangle, CheckCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Email {
  id: number;
  from: string;
  subject: string;
  preview: string;
  isSpam: boolean;
  score: number;
  category?: string;
}

const InboxScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [emails, setEmails] = useState<Email[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setScanning(true);
    setEmails([]);
    setError(null);

    try {
      const response = await fetch("/api/fetch-gmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setScanning(false);
        return;
      }

      // Map Flask response to Email interface
      const mappedEmails: Email[] = (data.emails || []).map((e: any, index: number) => ({
        id: index + 1,
        from: e.sender || "Unknown",
        subject: e.subject || "(No Subject)",
        preview: e.snippet || "",
        isSpam: e.isSpam,
        score: parseFloat(e.score) || 0,
        category: e.category,
      }));

      setEmails(mappedEmails);
    } catch (err) {
      console.error("Error fetching Gmail:", err);
      setError("Could not connect to the server. Make sure the Flask backend is running.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          <span className="text-gradient-accent">Inbox</span> Scanner
        </h1>
        <p className="text-muted-foreground mb-8">
          Scan your Gmail inbox for spam using our ML-powered detection engine.
        </p>

        <div className="rounded-2xl border border-border bg-card p-6 mb-8">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Click scan to fetch and analyze your latest 20 Gmail emails using the ML model.
              </p>
            </div>
            <Button
              onClick={handleScan}
              disabled={scanning}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary gap-2"
            >
              {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Scan Inbox
            </Button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 mb-6 text-center"
          >
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-medium">{error}</p>
          </motion.div>
        )}

        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-3" />
            <p className="text-primary font-medium">Scanning inbox...</p>
            <p className="text-xs text-muted-foreground mt-1">Fetching emails from Gmail and analyzing with ML model</p>
          </motion.div>
        )}

        {emails.length > 0 && !scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">{emails.length} emails found</span>
              <span className="text-sm text-destructive font-medium">
                {emails.filter((e) => e.isSpam).length} spam detected
              </span>
            </div>

            {emails.map((email, i) => (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border p-4 flex items-start gap-4 transition-all ${
                  email.isSpam
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border bg-card hover:border-border"
                }`}
              >
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  email.isSpam ? "bg-destructive/20" : "bg-success/20"
                }`}>
                  {email.isSpam ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground truncate">{email.from}</span>
                  </div>
                  <p className="text-sm text-foreground font-medium truncate flex items-center gap-2">
                    {email.subject}
                    {email.isSpam && email.category && email.category !== "General Spam" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/20 text-destructive border border-destructive/30 uppercase tracking-widest whitespace-nowrap">
                        {email.category}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={`text-lg font-bold ${
                    email.score >= 70 ? "text-destructive" : email.score >= 40 ? "text-warning" : "text-success"
                  }`}>
                    {email.score}
                  </div>
                  <div className="text-xs text-muted-foreground">score</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default InboxScanner;
