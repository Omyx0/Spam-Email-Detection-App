import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Github, Linkedin, Mail, Code, HeartHandshake, Shield, User, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThreeDCard } from "@/components/landing/ThreeDCard";
import { Footer } from "@/components/layout/Footer";

const DeveloperCard = ({ dev, delay }: { dev: any, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="h-full"
  >
    <ThreeDCard className="h-full">
      <div className="relative group p-1.5 h-full rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-border/10 to-accent/20 border border-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="bg-background/80 rounded-[calc(2.5rem-2px)] p-8 h-full flex flex-col xl:flex-row items-center xl:items-start gap-8">
          {/* Left Column: Image and Socials */}
          <div className="flex flex-col items-center gap-5 shrink-0">
            <div className="relative group/img">
              <div className="absolute inset-0 bg-primary/20 rounded-[1.5rem] blur-xl group-hover/img:blur-2xl transition-all animate-pulse" />
              <div className="relative h-40 w-40 rounded-[1.5rem] overflow-hidden border-4 border-primary/20 bg-muted shadow-2xl transition-transform duration-500 group-hover/img:scale-[1.02]">
                {dev.image ? (
                  <img src={dev.image} alt={dev.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-5xl font-black text-primary">{dev.name.charAt(0)}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center shadow-2xl z-10 text-primary group-hover/img:rotate-12 transition-transform">
                <Code className="h-5 w-5" />
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2.5">
              <a href={`mailto:${dev.social.email}`} className="p-2.5 rounded-xl bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-all group/icon border border-border/50" target="_blank" rel="noopener noreferrer">
                <Mail className="h-4 w-4 group-hover/icon:scale-110 transition-transform" />
              </a>
              <a href={dev.social.github} className="p-2.5 rounded-xl bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-all group/icon border border-border/50" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 group-hover/icon:scale-110 transition-transform" />
              </a>
              <a href={dev.social.linkedin} className="p-2.5 rounded-xl bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-all group/icon border border-border/50" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4 group-hover/icon:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex-1 flex flex-col items-center xl:items-start text-center xl:text-left h-full py-1">
            <div className="space-y-1.5 mb-6">
              <h3 className="text-3xl font-black tracking-tighter text-foreground leading-tight">{dev.name}</h3>
              <p className="text-primary font-bold text-xs uppercase tracking-[0.2em]">{dev.role}</p>
            </div>

            <div className="space-y-5 mb-8 w-full">
              <p className="text-muted-foreground/80 text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-primary/5 rounded-lg border border-primary/10 w-fit">
                {dev.department}
              </p>
              
              <div className="space-y-2 border-l-2 border-primary/20 pl-4 py-0.5">
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-none">
                  Enroll: <span className="text-foreground">{dev.enrollment}</span>
                </p>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-none">
                  Session: <span className="text-foreground">{dev.session}</span>
                </p>
              </div>
            </div>

            <div className="mt-auto hidden xl:block">
              <div className="px-3.5 py-1.5 rounded-md bg-secondary/30 border border-border/30 w-fit">
                <p className="text-muted-foreground/50 text-[9px] font-bold uppercase tracking-[0.25em]">
                  Student Dev Verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThreeDCard>
  </motion.div>
);

const MentorCard = ({ mentor }: { mentor: any }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="max-w-2xl mx-auto w-full"
  >
    <ThreeDCard>
      <div className="relative group p-1 rounded-[2.5rem] bg-gradient-to-r from-accent/30 via-primary/20 to-accent/30 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-[0_0_50px_rgba(20,255,236,0.1)]">
        <div className="bg-background/90 rounded-[calc(2.5rem-2px)] p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-2xl animate-pulse" />
            <div className="relative h-48 w-48 rounded-3xl overflow-hidden border-4 border-accent/20 bg-muted flex items-center justify-center shadow-2xl">
              {mentor.image ? (
                <img src={mentor.image} alt={mentor.name} className="h-full w-full object-cover scale-110 hover:scale-100 transition-transform duration-500" />
              ) : (
                <span className="text-6xl font-black text-accent">{mentor.name.charAt(0)}</span>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 h-14 w-14 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shadow-2xl z-10 border-4 border-background">
              <GraduationCap className="h-7 w-7" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-4 flex-1">
            <div className="inline-block px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2">
              Faculty Mentor
            </div>
            <h3 className="text-3xl font-black tracking-tight text-foreground">{mentor.name}</h3>
            <div className="space-y-1">
              <p className="text-lg font-bold text-muted-foreground">{mentor.designation}</p>
              <p className="text-sm font-medium text-muted-foreground/80 uppercase tracking-widest">{mentor.department}</p>
            </div>
            
            <div className="pt-6 flex gap-4 justify-center md:justify-start">
              <a href={`mailto:${mentor.social.email}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent transition-all text-sm font-bold border border-accent/20" target="_blank" rel="noopener noreferrer">
                <Mail className="h-4 w-4" />
                Email
              </a>
              <a href={mentor.social.linkedin} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-accent/10 hover:text-accent transition-all text-sm font-bold border border-border" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </ThreeDCard>
  </motion.div>
);

const Developers = () => {
  const developers = [
    {
      name: "Prateek Amar Batham",
      role: "Cloud Integration & Full Stack Developer",
      department: "Computer Science and Design",
      enrollment: "BTCD24O1048",
      session: "2024 - 2028",
      image: "/images/team/prateek.png",
      social: {
        email: "om31batham10@gmail.com",
        github: "https://github.com/Omyx0",
        linkedin: "https://www.linkedin.com/in/prateek-amar-batham-827734329"
      }
    },
    {
      name: "Sumit Singh Bhadoria",
      role: "ML Logic & UI/UX Designer",
      department: "Computer Science and Design",
      enrollment: "BTCD24O1067",
      session: "2024 - 2028",
      image: "/images/team/sumit.jpeg",
      social: {
        email: "sumitsbhadoria21@gmail.com",
        github: "https://github.com/SSbhadoria21",
        linkedin: "https://www.linkedin.com/in/ss-bhadoria-rs2101"
      }
    }
  ];

  const mentor = {
    name: "Dr. Manojeet Roy",
    designation: "Assistant Professor",
    department: "Computer Science and Engineering",
    image: "/images/team/manojeet.webp",
    social: {
      email: "manojeetroy@mitsgwalior.in",
      linkedin: "https://www.linkedin.com/in/dr-manojeet-roy-5350824b"
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/60 h-20 flex items-center">
        <div className="container mx-auto flex items-center justify-between px-6 md:px-12">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all">
              <img src="/favicon.ico" alt="Logo" className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              Spam Email <span className="text-primary italic">Detection</span>
            </span>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px]">
              <ArrowLeft className="h-4 w-4" />
              Back Home
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-28 pb-20 container mx-auto px-6 md:px-12">
        <header className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6"
          >
            <Shield className="h-3.5 w-3.5" />
            The Intelligence Team
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase"
          >
            Meet the <span className="text-primary">Team</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed"
          >
            The students and innovators crafting intelligent 
            solutions to shield your communication from modern threats.
          </motion.p>
        </header>

        {/* Developers Section */}
        <section className="mb-40">
          <div className="grid lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
            {developers.map((dev, i) => (
              <DeveloperCard key={dev.name} dev={dev} delay={0.3 + i * 0.1} />
            ))}
          </div>
        </section>

        {/* Mentorship Section */}
        <section className="relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10 bg-[radial-gradient(circle_at_center,rgba(20,255,236,0.05)_0%,transparent_70%)]" />
          <div className="text-center mb-16 px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2"
            >
              Under the <span className="text-accent">Guidance</span> Of
            </motion.h2>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Academic Excellence & Strategic Mentorship</p>
          </div>
          <MentorCard mentor={mentor} />
        </section>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 text-center"
        >
          <Link to="/dashboard">
            <Button size="lg" className="h-16 px-12 bg-primary text-primary-foreground text-lg font-black rounded-2xl shadow-[0_0_30px_rgba(20,255,236,0.2)] hover:scale-105 transition-transform group">
              Back to Analysis Hub
              <Shield className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Developers;
