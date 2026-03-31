import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingFooter = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">SpamGuard</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered spam detection to keep your inbox safe and clean.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
            <li><a href="#benefits" className="hover:text-primary transition-colors">Benefits</a></li>
            <li><a href="#stats" className="hover:text-primary transition-colors">Statistics</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="hover:text-primary transition-colors cursor-pointer">About</span></li>
            <li><span className="hover:text-primary transition-colors cursor-pointer">Privacy</span></li>
            <li><span className="hover:text-primary transition-colors cursor-pointer">Terms</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Get Started</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
            <li><Link to="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        © 2026 SpamGuard. All rights reserved.
      </div>
    </div>
  </footer>
);
