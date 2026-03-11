import { motion } from "framer-motion";
import { User, Mail, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          <span className="text-gradient-accent">Profile</span>
        </h1>

        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-foreground">Full Name</Label>
              <Input defaultValue={user?.name || ""} className="mt-1 bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-foreground">Email</Label>
              <Input defaultValue={user?.email || ""} className="mt-1 bg-secondary border-border" />
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
              Save Changes
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Account Stats
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Emails Scanned", value: JSON.parse(localStorage.getItem("spamguard_history") || "[]").length },
              { label: "Spam Found", value: JSON.parse(localStorage.getItem("spamguard_history") || "[]").filter((h: any) => h.result?.isSpam).length },
              { label: "Member Since", value: "Today" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-secondary p-4">
                <div className="text-2xl font-bold text-gradient-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
