import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Bell, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [detailedReports, setDetailedReports] = useState(true);

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
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          <span className="text-gradient-primary">Settings</span>
        </h1>

        <div className="space-y-4">
          {[
            { icon: darkMode ? Moon : Sun, label: "Dark Mode", desc: "Toggle dark/light appearance", checked: darkMode, onChange: setDarkMode },
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
