import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Mail, AlertTriangle, CheckCircle, Search, Inbox, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThreeDCard } from "@/components/landing/ThreeDCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Email {
  id: number;
  from: string;
  subject: string;
  preview: string;
  isSpam: boolean;
  score: number;
  category?: string;
  snippet?: string;
}

const InboxScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [emails, setEmails] = useState<Email[]>([]);
  const [error, setError] = useState<string | null>(null);

  const categorizedSpam = useMemo(() => {
    const spams = emails.filter((e) => e.isSpam);
    const grouped: Record<string, Email[]> = {};
    spams.forEach((spam) => {
      const cat = spam.category && spam.category !== "N/A" ? spam.category : "General Spam";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(spam);
    });
    return grouped;
  }, [emails]);

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

      const mappedEmails: Email[] = (data.emails || []).map((e: any, index: number) => ({
        id: index + 1,
        from: e.sender || "Unknown",
        subject: e.subject || "(No Subject)",
        preview: e.snippet || "",
        isSpam: e.isSpam,
        score: parseFloat(e.score) || 0,
        category: e.category,
        snippet: e.snippet
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
    <div className="p-6 md:p-10 max-w-6xl mx-auto pb-32 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-foreground mb-2 tracking-tighter uppercase">
              Inbox <span className="text-primary tracking-tight">Scanner</span>
            </h1>
            <p className="text-muted-foreground font-medium italic">Scan your recent Gmail messages for spam</p>
          </div>
          <Button
            onClick={handleScan}
            disabled={scanning}
            className="h-14 px-10 bg-primary text-primary-foreground hover:opacity-90 font-black rounded-2xl shadow-2xl shadow-primary/30 gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            <RefreshCw className={`h-5 w-5 ${scanning ? "animate-spin" : ""}`} />
            {scanning ? "Scanning..." : "Scan Inbox"}
          </Button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[2rem] border border-destructive/30 bg-destructive/5 p-10 mb-10 text-center relative overflow-hidden"
          >
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-bold text-lg">{error}</p>
            <p className="text-xs text-muted-foreground mt-2 opacity-60">Make sure you are logged in and Gmail access is granted.</p>
          </motion.div>
        )}

        {scanning && emails.length === 0 && (
          <ThreeDCard>
            <div className="rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-32 text-center relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
               <Loader2 className="h-20 w-20 text-primary mx-auto mb-8 animate-spin" />
               <h3 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter">Scanning Your Inbox</h3>
               <p className="text-muted-foreground font-medium animate-pulse">Fetching and analyzing your recent emails for spam...</p>
            </div>
          </ThreeDCard>
        )}

        {!scanning && emails.length === 0 && !error && (
          <ThreeDCard>
             <div className="rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-32 text-center group">
                <div className="p-6 rounded-3xl bg-primary/5 w-fit mx-auto mb-8 border border-white/5 transition-transform group-hover:scale-110">
                  <Inbox className="h-16 w-16 text-primary opacity-30" />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter">No Emails Scanned Yet</h3>
                <p className="text-muted-foreground mb-10 max-w-sm mx-auto">Click "Scan Inbox" above to check your recent Gmail messages for spam.</p>
                <Button variant="outline" onClick={handleScan} className="h-12 border-border/40 rounded-xl px-10 font-bold hover:bg-white/5">Scan Now</Button>
             </div>
          </ThreeDCard>
        )}

        {emails.length > 0 && !scanning && (
          <div className="space-y-12">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <Mail className="h-6 w-6 text-primary" />
                     <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Emails Scanned</span>
                  </div>
                  <span className="text-3xl font-black text-foreground tracking-tighter">{emails.length}</span>
               </div>
               <div className="p-6 rounded-3xl bg-destructive/5 border border-destructive/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <AlertTriangle className="h-6 w-6 text-destructive" />
                     <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Spam Found</span>
                  </div>
                  <span className="text-3xl font-black text-destructive tracking-tighter">{emails.filter(e => e.isSpam).length}</span>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
              <AnimatePresence>
                {emails.map((email, idx) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ThreeDCard>
                      <div className={`h-full rounded-[2rem] border p-8 backdrop-blur-2xl transition-all duration-700 overflow-hidden relative group ${
                        email.isSpam 
                          ? "bg-destructive/5 border-destructive/20 hover:bg-destructive/10" 
                          : "bg-card/40 border-border/40 hover:bg-primary/5 hover:border-primary/20"
                      }`}>
                        <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className={`p-4 rounded-2xl shadow-2xl transition-transform group-hover:scale-110 ${email.isSpam ? "bg-destructive/20" : "bg-primary/20"}`}>
                            <Mail className={`h-8 w-8 ${email.isSpam ? "text-destructive" : "text-primary"}`} />
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-[10px] font-black uppercase tracking-[0.25em] mb-2 ${
                              email.isSpam ? "text-destructive" : "text-primary"
                            }`}>
                              {email.isSpam ? "Spam" : "Safe"}
                            </span>
                            <div className="flex items-center gap-3">
                               <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                 <motion.div 
                                   className={`h-full shadow-lg ${email.isSpam ? "bg-destructive shadow-destructive/50" : "bg-primary shadow-primary/50"}`}
                                   initial={{ width: 0 }}
                                   animate={{ width: `${email.score}%` }}
                                   transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                                 />
                               </div>
                               <span className="text-sm font-black tracking-tighter text-foreground">{email.score}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                          <div>
                            <h3 className="text-xl font-black text-foreground line-clamp-1 group-hover:text-primary transition-colors tracking-tight mb-1">{email.subject}</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">{email.from}</p>
                          </div>
                          <div className="relative">
                            <div className="absolute top-0 left-0 -ml-4 h-full w-0.5 bg-primary/20 group-hover:bg-primary transition-colors" />
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed pl-4 italic font-medium opacity-80">
                              "{email.preview}"
                            </p>
                          </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between relative z-10">
                           {email.isSpam && (
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-[10px] font-black uppercase tracking-widest text-destructive">
                                {email.category || "Spam"}
                             </div>
                           )}
                           <button className="ml-auto p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors opacity-40 hover:opacity-100">
                             <RefreshCw className="h-4 w-4" />
                           </button>
                        </div>
                      </div>
                    </ThreeDCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default InboxScanner;
