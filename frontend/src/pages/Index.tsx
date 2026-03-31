import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Zap, BarChart3, Lock, Mail, ArrowRight, ChevronDown, User, LogOut, Settings, Inbox, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { BenefitsCarousel } from "@/components/landing/BenefitsCarousel";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { StatsSection } from "@/components/landing/StatsSection";

const Index = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70"
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Spam<span className="text-gradient-primary">Guard</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#benefits" className="hover:text-primary transition-colors">Benefits</a>
            <a href="#stats" className="hover:text-primary transition-colors">Stats</a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="hidden sm:block">
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-border">
                      <Avatar className="h-8 w-8">
                        {user.picture ? (
                          <AvatarImage src={user.picture} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary uppercase text-xs">
                            {user.name ? user.name.charAt(0) : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal border-b pb-2 mb-2 border-border/50">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <Link to="/dashboard/profile">
                      <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-primary/10">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/dashboard/settings">
                      <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-primary/10">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive gap-2"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-grid pt-20">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">AI-Powered Email Security</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          >
            Detect <span className="text-gradient-primary">Spam</span>
            <br />
            Before It <span className="text-gradient-accent">Strikes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Advanced AI analyzes your emails in real-time, providing spam scores,
            threat analysis, and protecting your inbox from phishing and malicious content.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary px-8 py-6 text-lg gap-2 group border-0">
                    <LayoutDashboard className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    Open Dashboard
                  </Button>
                </Link>
                <Link to="/dashboard/inbox">
                  <Button size="lg" variant="outline" className="border-border hover:border-primary hover:text-primary px-8 py-6 text-lg">
                    <Inbox className="h-5 w-5 mr-2" />
                    Scan Inbox
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary px-8 py-6 text-lg gap-2 group">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-border hover:border-primary hover:text-primary px-8 py-6 text-lg">
                    <Mail className="h-5 w-5 mr-2" />
                    Login
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Floating icons */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-10 hidden lg:block"
          >
            <div className="p-3 rounded-xl bg-card border border-border">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-40 left-10 hidden lg:block"
          >
            <div className="p-3 rounded-xl bg-card border border-border">
              <Lock className="h-6 w-6 text-accent" />
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Powerful <span className="text-gradient-primary">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to keep your inbox safe and clean.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Spam Detection", desc: "AI-powered analysis detects spam with 99.7% accuracy", color: "primary" },
              { icon: BarChart3, title: "Detailed Analytics", desc: "Get spam scores, threat levels, and full email breakdown", color: "accent" },
              { icon: Zap, title: "Real-time Scanning", desc: "Instant results with our lightning-fast detection engine", color: "primary" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all group"
              >
                <div className={`inline-flex p-3 rounded-xl mb-5 ${feature.color === "primary" ? "bg-primary/10" : "bg-accent/10"}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color === "primary" ? "text-primary" : "text-accent"}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Carousel */}
      <section id="benefits">
        <BenefitsCarousel />
      </section>

      {/* Stats */}
      <section id="stats">
        <StatsSection />
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-primary/30 bg-card p-12 md:p-20 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
                Ready to Secure Your <span className="text-gradient-primary">Inbox</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join thousands of users who trust SpamGuard to protect their email.
              </p>
              {user ? (
                <Link to="/dashboard/inbox">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary px-10 py-6 text-lg">
                    Scan Inbox Now
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary px-10 py-6 text-lg">
                    Start Free Now
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Index;
