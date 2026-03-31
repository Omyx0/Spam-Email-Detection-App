import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertTriangle, CheckCircle, BarChart3, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AnalysisResult {
  isSpam: boolean;
  score: number;
  result: string;
  category?: string;
}

const SpamDetector = () => {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!emailText.trim()) return;
    setAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_text: emailText }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();

      // Score is now always spam probability (0-100): high = spam, low = safe
      setResult({
        isSpam: data.isSpam,
        score: data.score,
        result: data.result,
        category: data.category,
      });
    } catch (error) {
      console.error("Error analyzing email:", error);
      setResult({
        isSpam: false,
        score: 0,
        result: "ERROR",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          <span className="text-gradient-primary">Spam</span> Detector
        </h1>
        <p className="text-muted-foreground mb-8">
          Paste your email content below and we'll analyze it for spam indicators.
        </p>

        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <Textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder={"Paste your email content here...\n\nExample: Congratulations! You have won a FREE prize! Click here to claim your $1000 cash reward NOW!"}
            className="min-h-[200px] bg-secondary border-border focus:border-primary resize-none text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground">{emailText.length} characters</span>
            <Button
              onClick={handleAnalyze}
              disabled={!emailText.trim() || analyzing}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Detect Spam
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Scan animation */}
        <AnimatePresence>
          {analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-primary/30 bg-card p-8 mb-6 relative overflow-hidden"
            >
              <div className="absolute inset-0">
                <div className="absolute left-0 right-0 h-0.5 bg-primary/60 animate-scan-line" />
              </div>
              <div className="text-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-3" />
                <p className="text-primary font-medium">Scanning email content...</p>
                <p className="text-xs text-muted-foreground mt-1">Analyzing with ML model (TF-IDF + Naive Bayes)</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && !analyzing && result.result !== "ERROR" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Score card */}
              <div className={`rounded-2xl border p-8 ${
                result.isSpam
                  ? "border-destructive/40 bg-destructive/5"
                  : "border-success/40 bg-success/5"
              }`}>
                <div className="flex items-center gap-4 mb-6">
                  {result.isSpam ? (
                    <div className="p-3 rounded-xl bg-destructive/20">
                      <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-success/20">
                      <CheckCircle className="h-8 w-8 text-success" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      {result.isSpam ? "Spam Detected!" : "Not Spam"}
                      {result.isSpam && result.category && result.category !== "General Spam" && (
                        <span className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive border border-destructive/30 uppercase tracking-wider whitespace-nowrap">
                          {result.category}
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Classification: {result.result}
                    </p>
                  </div>
                </div>

                {/* Score bar — always shows spam probability */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Spam Probability</span>
                    <span className="font-bold text-foreground">{result.score}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        result.score >= 70
                          ? "bg-destructive"
                          : result.score >= 40
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Safe</span>
                    <span>Suspicious</span>
                    <span>Spam</span>
                  </div>
                </div>

                {/* Analysis details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Analysis</span>
                    </div>
                    <ul className="space-y-2">
                      <li className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        ML Model classified this as <strong className="text-foreground">{result.result}</strong>
                      </li>
                      <li className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Spam probability: <strong className="text-foreground">{result.score}%</strong>
                      </li>
                      {result.category && (
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          Category: <strong className="text-foreground">{result.category}</strong>
                        </li>
                      )}
                      <li className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Saved to scan history for your records
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-foreground">Classification</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Powered by TF-IDF vectorization + Multinomial Naive Bayes trained on real email data.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        <AnimatePresence>
          {result && result.result === "ERROR" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center"
            >
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-destructive font-medium">Could not connect to the analysis server.</p>
              <p className="text-xs text-muted-foreground mt-1">Make sure the Flask backend is running on port 5000.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SpamDetector;
