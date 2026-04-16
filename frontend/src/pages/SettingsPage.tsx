import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Bell, Eye, User, Shield, BarChart3, Mail, MapPin, Award, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThreeDCard } from "@/components/landing/ThreeDCard";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [detailedReports, setDetailedReports] = useState(true);
  const { user, stats } = useAuth();

  const handleClearAll = async () => {
    localStorage.removeItem("spamguard_history");
    localStorage.removeItem("spamguard_user");
    try {
      await fetch("/api/history/clear", { method: "POST" });
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    window.location.href = "/";
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12">
          <h1 className="text-4xl font-black text-foreground mb-2 tracking-tighter uppercase">
            User <span className="text-primary">Intelligence</span> Profile
          </h1>
          <p className="text-muted-foreground">Comprehensive overview of your security identity and scanning metrics</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Main Profile Info */}
          <div className="md:col-span-2">
            <ThreeDCard>
              <div className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-10 shadow-2xl relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                    <div className="relative w-32 h-32 rounded-full bg-background flex flex-shrink-0 items-center justify-center text-primary text-5xl font-black border-4 border-border/50 shadow-2xl">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-6">
                      <h2 className="text-3xl font-black text-foreground mb-1 tracking-tight">{user?.name || "Neural Agent"}</h2>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-mono text-xs uppercase tracking-widest font-bold">
                         <Shield className="h-3 w-3" />
                         Verified Security Analyst
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Email Secure ID</span>
                        <div className="flex items-center gap-2 text-foreground font-medium">
                           <Mail className="h-4 w-4 text-primary opacity-60" />
                           {user?.email || "anonymous@spamshield.ai"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Operational Access</span>
                        <div className="flex items-center gap-2 text-foreground font-medium uppercase text-xs tracking-wider">
                           <MapPin className="h-4 w-4 text-primary opacity-60" />
                           Global Infrastructure
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ThreeDCard>
          </div>

          {/* Rapid Stats */}
          <div className="md:col-span-1">
            <div className="grid grid-rows-2 gap-8 h-full">
              {[
                { label: "Total Scanned", value: stats?.total || 0, icon: Search, color: "text-primary" },
                { label: "Spam Blocked", value: stats?.spam || 0, icon: Shield, color: "text-destructive" },
              ].map((stat, i) => (
                <ThreeDCard key={i}>
                  <div className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-8 flex items-center gap-6 h-full relative overflow-hidden group">
                     <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                     </div>
                     <div>
                        <div className="text-4xl font-black text-foreground tracking-tighter">{stat.value}</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                     </div>
                  </div>
                </ThreeDCard>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Insights Section */}
        <ThreeDCard>
          <div className="rounded-[3rem] border border-border/40 bg-gradient-to-br from-primary/5 via-card/40 to-accent/5 backdrop-blur-3xl p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-[10px] font-bold text-accent uppercase tracking-widest mb-6">
                <Award className="h-3 w-3" />
                Achievement Unlocked
              </div>
              <h3 className="text-3xl font-black text-foreground mb-4">Advanced Neural Insights</h3>
              <p className="text-muted-foreground max-w-xl leading-relaxed">
                Your scanning data is being processed into advanced statistical visualizations. 
                Explore deep patterns in your inbound communication safety metrics.
              </p>
            </div>

            <Link to="/dashboard/visualizations" className="relative z-10">
              <Button size="lg" className="h-16 px-10 bg-accent text-accent-foreground hover:opacity-90 font-black text-lg rounded-2xl shadow-2xl shadow-accent/30 gap-3 group">
                Open Analytics Hall
                <BarChart3 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>
        </ThreeDCard>

        <div className="mt-12 space-y-4">
          <h3 className="text-xl font-bold text-foreground mb-6">System Preferences</h3>
          {[
            { icon: Bell, label: "Notifications", desc: "Receive spam alerts", checked: notifications, onChange: setNotifications },
            { icon: Eye, label: "Detailed Reports", desc: "Show full analysis breakdown", checked: detailedReports, onChange: setDetailedReports },
          ].map((setting) => (
            <div
              key={setting.label}
              className="rounded-xl border border-border bg-card p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-secondary">
                  <setting.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label className="text-foreground font-medium">{setting.label}</Label>
                  <p className="text-xs text-muted-foreground">{setting.desc}</p>
                </div>
              </div>
              <Switch checked={setting.checked} onCheckedChange={setting.onChange} />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 mt-8">
          <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">Delete all data, scan history, and logout. This action cannot be undone.</p>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 rounded-lg border border-destructive text-destructive text-sm hover:bg-destructive/10 transition-colors"
          >
            Delete All Data & Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
