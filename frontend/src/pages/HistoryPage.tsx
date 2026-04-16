import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, Search, Filter, Trash2, Shield, Calendar, AlertTriangle, 
  CheckCircle, Mail, MoreVertical, RefreshCw, Inbox, Download, ExternalLink, Trash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThreeDCard } from "@/components/landing/ThreeDCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HistoryItem {
  id: string;
  date: string;
  sender: string;
  message: string;
  result: string;
  score: number;
  source: string;
  isSpam: boolean;
  category?: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "spam" | "safe">("all");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data.history || []);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    if (!confirm("Confirm data wipe? This action cannot be undone.")) return;
    try {
      await fetch("/api/history/clear", { method: "POST" });
      setHistory([]);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Remove this audit shard permanently?")) return;
    try {
      const res = await fetch(`/api/history/delete/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
      }
    } catch (e) {
      console.error("Deletion failed:", e);
    }
  };

  const downloadCSV = () => {
    if (history.length === 0) return;
    
    const headers = ["Date", "Sender", "Message", "Result", "Score", "Category", "Source"];
    const rows = history.map(item => [
      new Date(item.date).toLocaleString(),
      `"${item.sender.replace(/"/g, '""')}"`,
      `"${item.message.replace(/"/g, '""')}"`,
      item.result,
      `${item.score}%`,
      item.category || "N/A",
      item.source
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `spam_audit_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = 
        item.sender.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filter === "all" || (filter === "spam" ? item.isSpam : !item.isSpam);
      return matchesSearch && matchesFilter;
    });
  }, [history, searchTerm, filter]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-foreground mb-2 tracking-tighter uppercase">
              Scan <span className="text-primary">Audit</span> Vault
            </h1>
            <p className="text-muted-foreground font-medium">Historical forensic analysis of all neural processing activity</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={downloadCSV}
              className="h-12 border-primary/20 text-primary hover:bg-primary/10 rounded-xl px-6 font-bold gap-2"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
            <Button
              variant="outline"
              onClick={clearHistory}
              className="h-12 border-destructive/20 text-destructive hover:bg-destructive/10 rounded-xl px-6 font-bold gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Data Vault
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by sender, result, or shard ID..."
              className="pl-12 bg-card/40 border-border/40 h-14 rounded-2xl focus:border-primary/50 transition-all backdrop-blur-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 p-1.5 bg-background/40 backdrop-blur-xl border border-border/40 rounded-2xl">
             {["all", "spam", "safe"].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f as any)}
                 className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                   filter === f 
                    ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                 }`}
               >
                 {f}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading && history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Accessing Vault Shards...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <ThreeDCard>
              <div className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur-3xl p-20 text-center relative overflow-hidden group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <History className="h-16 w-16 text-primary/30 mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500" />
                <h3 className="text-2xl font-black text-foreground mb-2 uppercase tracking-tighter">No Audit Records</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">No neural analysis data matches your current filtering parameters.</p>
              </div>
            </ThreeDCard>
          ) : (
            <AnimatePresence>
              {filteredHistory.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  <div className={`p-6 rounded-[1.5rem] border backdrop-blur-xl transition-all group relative overflow-hidden flex flex-col md:flex-row items-center gap-8 ${
                    item.isSpam ? "bg-destructive/5 border-destructive/20 hover:bg-destructive/10" : "bg-card/40 border-border/40 hover:bg-primary/5 hover:border-primary/20 shadow-xl shadow-black/20"
                  }`}>
                    <div className={`p-5 rounded-2xl ${item.isSpam ? "bg-destructive/20 shadow-lg shadow-destructive/10" : "bg-primary/20 shadow-lg shadow-primary/10"}`}>
                      <Mail className={`h-6 w-6 ${item.isSpam ? "text-destructive" : "text-primary"}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-black text-foreground truncate tracking-tight">{item.sender}</span>
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold uppercase tracking-wider">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate italic opacity-60 leading-relaxed font-serif">"{item.message}"</p>
                    </div>

                    <div className="flex items-center gap-10 min-w-fit w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                      <div className="text-right">
                        <div className={`text-3xl font-black tracking-tighter ${item.isSpam ? "text-destructive" : "text-primary"}`}>
                          {item.score}%
                        </div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Neural Risk</div>
                      </div>

                      <div className={`px-5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.25em] shadow-inner ${
                        item.isSpam ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-primary/10 border-primary/30 text-primary"
                      }`}>
                        {item.isSpam ? "Spam" : "Safe"}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group-hover:opacity-100 opacity-50">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background/90 backdrop-blur-2xl border-border/40 p-2 rounded-2xl min-w-[160px] shadow-2xl">
                           <DropdownMenuItem 
                             onClick={() => setSelectedItem(item)}
                             className="p-3 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-primary/10 hover:text-primary rounded-xl gap-2 transition-all"
                           >
                             <RefreshCw className="h-3.5 w-3.5" />
                             Details
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                             onClick={() => deleteItem(item.id)}
                             className="p-3 text-xs font-bold uppercase tracking-widest cursor-pointer text-destructive hover:bg-destructive/10 rounded-xl gap-2 transition-all"
                           >
                             <Trash className="h-3.5 w-3.5" />
                             Delete Shard
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Forensic Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border/40 rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className={`h-2 w-full ${selectedItem.isSpam ? "bg-destructive" : "bg-primary"}`} />
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">
                      Neural <span className="text-primary">Snapshot</span>
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-[.2em]">Audit ID: {selectedItem.id}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSelectedItem(null)}
                    className="rounded-full hover:bg-white/5"
                  >
                    <RefreshCw className="h-4 w-4 rotate-45" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Origin Sender</p>
                    <p className="text-sm font-bold truncate">{selectedItem.sender}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Audit Date</p>
                    <p className="text-sm font-bold">{new Date(selectedItem.date).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Payload Fragment</p>
                  <div className="p-6 rounded-2xl bg-black/20 border border-white/5 font-mono text-sm leading-relaxed text-foreground/80">
                    "{selectedItem.message}"
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedItem.isSpam ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"}`}>
                      {selectedItem.isSpam ? <AlertTriangle className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">Classification</p>
                      <p className={`font-bold ${selectedItem.isSpam ? "text-destructive" : "text-primary"}`}>
                        {selectedItem.isSpam ? "High Risk Spam" : "Verified Safe"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-widest">Neural Confidence</p>
                    <p className="text-2xl font-black tracking-tighter text-foreground">{selectedItem.score}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryPage;
