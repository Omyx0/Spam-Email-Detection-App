import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Github, Linkedin, Mail, Code, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThreeDCard } from "@/components/landing/ThreeDCard";
import { LandingFooter } from "@/components/landing/LandingFooter";

const DeveloperCard = ({ dev }: { dev: any }) => (
  <ThreeDCard className="h-full">
    <div className="relative group p-1 h-full rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-white/5 backdrop-blur-3xl overflow-hidden">
      <div className="bg-background/80 rounded-[calc(1rem-1px)] p-6 h-full flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center">
            {dev.image ? (
              <img src={dev.image} alt={dev.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-primary">{dev.name.charAt(0)}</span>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center shadow-lg">
            <Code className="h-4 w-4 text-primary" />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-1 tracking-tight">{dev.name}</h3>
        <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-4 inline-block px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
          {dev.designation}
        </p>
        
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-3">
          {dev.about}
        </p>

        <div className="grid grid-cols-2 w-full gap-3 mb-8 text-left">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Branch</div>
            <div className="text-xs font-semibold">{dev.branch}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Batch</div>
            <div className="text-xs font-semibold">{dev.batch}</div>
          </div>
        </div>

        <div className="mt-auto flex gap-4">
          <a href="#" className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 hover:text-primary transition-all">
            <Github className="h-4 w-4" />
          </a>
          <a href="#" className="p-2 rounded-lg bg-muted/50 hover:bg-accent/20 hover:text-accent transition-all">
            <Linkedin className="h-4 w-4" />
          </a>
          <a href="#" className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 hover:text-primary transition-all">
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </ThreeDCard>
);

const Developers = () => {
  const mainDevelopers = [
    {
      name: "Abhinay Bhadoria",
      designation: "Lead Developer",
      about: "Passionate about building scalable AI-driven solutions and enhancing digital security. Expert in Full Stack development and Machine Learning deployments.",
      branch: "Computer Science",
      batch: "2022-26",
      year: "3rd Year",
      image: null
    },
    {
      name: "Saurabh Bhadoria",
      designation: "UI/UX Specialist",
      about: "Focuses on creating immersive, 3D interactive user experiences. Deep experience in Framer Motion, React, and modern CSS architectures.",
      branch: "Computer Science",
      batch: "2022-26",
      year: "3rd Year",
      image: null
    }
  ];

  const mentorshipDevelopers = [
    {
      name: "Dummy Mentee 1",
      designation: "Junior Developer",
      about: "Exploring the intersection of web technology and data science. Currently focusing on Gmail API integrations and frontend efficiency.",
      branch: "IT",
      batch: "2023-27",
      year: "2nd Year",
      image: null
    },
    {
      name: "Dummy Mentee 2",
      designation: "Frontend Intern",
      about: "Dedicated to crafting pixel-perfect interfaces. Learning advanced React patterns and state management strategies.",
      branch: "CSE",
      batch: "2024-28",
      year: "1st Year",
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Simple Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/60">
        <div className="container mx-auto flex items-center justify-between py-6 px-6 md:px-12">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <img src="/favicon.ico" alt="SpamShield Logo" className="h-7 w-7" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Spam<span className="text-primary">Shield</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <a href="/#features" className="hover:text-primary transition-all hover:tracking-wider">Features</a>
            <Link to="/developers" className="text-primary transition-all tracking-wider font-bold">Developers</Link>
            <a href="https://github.com/SSbhadoria21/Spam-Email-Detection-App" target="_blank" className="hover:text-primary transition-all hover:tracking-wider">Github</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 container mx-auto px-6 md:px-12">
        {/* Core Developers Section */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The <span className="text-primary">Architects</span></h1>
              <p className="text-muted-foreground">The core engineering team behind SpamShield AI.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 text-nowrap">
            {mainDevelopers.map((dev, i) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <DeveloperCard dev={dev} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mentorship Section */}
        <div>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <HeartHandshake className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Under <span className="text-accent">Mentorship</span></h2>
              <p className="text-muted-foreground">Aspiring developers growing with the project.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentorshipDevelopers.map((dev, i) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <DeveloperCard dev={dev} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default Developers;
