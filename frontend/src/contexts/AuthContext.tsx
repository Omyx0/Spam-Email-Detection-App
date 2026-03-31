import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, logout: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated via Flask session
    fetch("/api/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          // Also sync to localStorage for sidebar/profile display
          localStorage.setItem("spamguard_user", JSON.stringify(data.user));
        } else {
          // Check localStorage as fallback (e.g. after page refresh before session loads)
          const stored = localStorage.getItem("spamguard_user");
          if (stored) setUser(JSON.parse(stored));
        }
      })
      .catch(() => {
        // If API fails, fall back to localStorage
        const stored = localStorage.getItem("spamguard_user");
        if (stored) setUser(JSON.parse(stored));
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .catch(() => {});
    localStorage.removeItem("spamguard_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
