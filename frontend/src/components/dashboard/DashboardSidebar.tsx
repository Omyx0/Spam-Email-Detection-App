import { NavLink, useNavigate } from "react-router-dom";
import { Shield, Search, History, Settings, User, LogOut, Inbox, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { to: "/dashboard", icon: Search, label: "Detect Spam", end: true },
  { to: "/dashboard/inbox", icon: Inbox, label: "Inbox Scanner" },
  { to: "/dashboard/history", icon: History, label: "History" },
  { to: "/dashboard/visualizations", icon: BarChart3, label: "Visualizations" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export const DashboardSidebar = ({ onClose }: { onClose: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="h-full flex flex-col bg-background/40 backdrop-blur-xl border-r border-border/40">
      <div className="p-6 flex items-center gap-2">
        <img src="/favicon.ico" alt="Logo" className="h-6 w-6" />
        <span className="font-bold text-lg text-foreground tracking-tight">
          Spam<span className="text-primary italic">Shield</span>
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                isActive
                  ? "bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(20,255,236,0.1)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-1"
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 mb-3">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{user?.name || "User"}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email || ""}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-destructive hover:bg-destructive/10 w-full transition-all"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};
