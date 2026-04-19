import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, Image as ImageIcon, Search, LayoutGrid, Terminal, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ThreeDCard } from "@/components/landing/ThreeDCard";

const METRICS = [
  { id: "ratio", label: "Spam vs Safe Ratio" },
  { id: "categories", label: "Category Distribution" },
  { id: "timeline", label: "Timeline Activity" }
];

const CHART_TYPES = [
  { id: "pie", label: "Pie Chart" },
  { id: "doughnut", label: "Doughnut Chart" },
  { id: "bar", label: "Bar Chart" },
  { id: "line", label: "Line Chart" }
];

const VisualizationsPage = () => {
  const [metric, setMetric] = useState("ratio");
  const [chartType, setChartType] = useState("doughnut");
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChart();
  }, [metric, chartType]);

  const fetchChart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/custom?metric=${metric}&type=${chartType}`);
      const data = await res.json();
      if (data.empty) {
        setIsEmpty(true);
        setChartImage(null);
      } else if (data.chart) {
        setIsEmpty(false);
        setChartImage(data.chart);
      }
    } catch (e) {
      console.error("Failed to fetch chart", e);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!chartImage) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${chartImage}`;
    link.download = `spam_email_detection_visualization_${metric}_${chartType}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-foreground mb-2 tracking-tighter uppercase">
              Neural <span className="text-primary">Analytics</span> Hall
            </h1>
            <p className="text-muted-foreground">High-fidelity data visualization for spam pattern recognition</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
             <Cpu className="h-4 w-4" />
             Matplotlib Compute Engine active
          </div>
        </div>

        {isEmpty ? (
          <ThreeDCard>
            <div className="rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-20 text-center relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
               <Search className="h-20 w-20 text-primary/40 mx-auto mb-8" />
               <h3 className="text-3xl font-black text-foreground mb-4">No Data Points Detected</h3>
               <p className="text-muted-foreground mb-10 max-w-md mx-auto">Your scan history is currently empty. Initialize a scan to populate the neural analytics engine.</p>
               <Link to="/dashboard">
                 <Button className="h-14 px-10 bg-primary text-primary-foreground hover:opacity-90 font-black rounded-2xl shadow-2xl shadow-primary/30">
                   Analyze First Message
                 </Button>
               </Link>
            </div>
          </ThreeDCard>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Controls */}
            <div className="lg:col-span-3 space-y-10">
              <ThreeDCard>
                <div className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-8 shadow-2xl">
                  <div className="mb-8">
                    <Label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 block">Select Dimension</Label>
                    <div className="space-y-3">
                      {METRICS.map(m => (
                        <button
                          key={m.id}
                          onClick={() => setMetric(m.id)}
                          className={`w-full group text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all border ${
                            metric === m.id 
                            ? 'bg-primary/20 border-primary/50 text-foreground shadow-[0_0_20px_rgba(20,255,236,0.1)]' 
                            : 'bg-transparent border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            {m.label}
                            {metric === m.id && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-white/5 w-full mb-8"></div>

                  <div>
                    <Label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 block">Rendering Style</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {CHART_TYPES.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setChartType(c.id)}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                            chartType === c.id 
                            ? 'bg-accent/20 border-accent/50 text-foreground' 
                            : 'bg-transparent border-border/40 text-muted-foreground hover:bg-white/5'
                          }`}
                        >
                          <LayoutGrid className={`h-4 w-4 mb-2 ${chartType === c.id ? 'text-accent' : 'opacity-40'}`} />
                          <span className="text-[10px] uppercase font-black">{c.label.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ThreeDCard>

              <div className="p-6 rounded-2xl border border-border/20 bg-background/40 font-mono text-[10px] text-muted-foreground/60 leading-relaxed">
                 <div className="flex items-center gap-2 mb-2 text-primary/40 font-bold uppercase">
                   <Terminal className="h-3 w-3" />
                   System Log
                 </div>
                 &gt; Fetching shard: {metric}<br/>
                 &gt; Applying style: {chartType}<br/>
                 &gt; Hash: 0xFD...{Math.floor(Math.random() * 999)}
              </div>
            </div>

            {/* Viewer */}
            <div className="lg:col-span-9">
              <ThreeDCard>
                <div className="rounded-[3rem] border border-border/40 bg-card/60 backdrop-blur-3xl p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
                  <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
                  
                  <div className="flex justify-between items-center mb-10 relative z-10">
                    <h3 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-accent/20">
                        <BarChart3 className="h-6 w-6 text-accent" />
                      </div>
                      Neural Projection
                    </h3>
                    {chartImage && (
                      <Button variant="outline" onClick={downloadImage} className="h-12 border-border/40 rounded-xl px-6 gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all font-bold group">
                        <Download className="h-4 w-4 transition-transform group-hover:translate-y-1" />
                        Export .PNG
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 rounded-[2rem] border border-white/5 bg-background/20 p-8 flex items-center justify-center relative group">
                    {loading ? (
                      <div className="text-center">
                        <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Calculating Vectors...</p>
                      </div>
                    ) : chartImage ? (
                      <div className="relative w-full max-w-[700px]">
                        <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
                        <img 
                          src={`data:image/png;base64,${chartImage}`} 
                          alt="Matplotlib Analytics" 
                          className="w-full relative z-10 drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-out hover:scale-[1.03]" 
                        />
                      </div>
                    ) : (
                      <div className="text-center opacity-30">
                        <ImageIcon className="h-20 w-20 mx-auto mb-4" />
                        <p className="font-bold uppercase tracking-widest">Projection Failed</p>
                      </div>
                    )}
                  </div>
                </div>
              </ThreeDCard>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VisualizationsPage;
