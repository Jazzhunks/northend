import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import GlassPanel from "@/components/GlassPanel";
import CourseCard3D from "@/components/CourseCard3D";
import { CTAPrimary, CTAGhost, Eyebrow, Reveal } from "@/components/Cinematic";
import { AnimatedCounter } from "@/components/Metrics";
import { api } from "@/lib/api";
import { isReactSnap } from "@/utils/isBot";
import {
  Star, Sparkle, Trophy, GraduationCap, Lightning, Compass,
  ShieldCheck, ChartLineUp, Quotes, MapPin, ArrowUpRight
} from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1];

export default function Home() {
  const isMobile = useIsMobile();
  const isBot = isReactSnap(); 
  
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ students_trained: 1323, selections: 100, educators: 100, centers: 4});
  const [results, setResults] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [centers, setCenters] = useState([]);

 useEffect(() => {
  Promise.all([
    api.get("/courses?featured=true").then(r => setCourses(r.data)).catch(()=>{}),
    // api.get("/stats").then(r => setStats(r.data)).catch(()=>{}), 
    api.get("/results").then(r => setResults(r.data.slice(0, 6))).catch(()=>{}),
    api.get("/testimonials").then(r => setTestimonials(r.data)).catch(()=>{}),
    api.get("/centers").then(r => setCenters(r.data)).catch(()=>{}),
  ]);
}, []);

  return (
    <div data-testid="home-page">
      {/* ============================== CINEMATIC HERO ============================== */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 pointer-events-none"
        >
          <source src="https://quark.uacdn.net/acquisition/AboutUsHeader--compressed.webm" type="video/webm" />
          <source src="https://quark.uacdn.net/acquisition/AboutUsHeader--compressed.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay to blend the video into your dark theme */}
        <div className="absolute inset-0 bg-background/40 bg-gradient-to-t from-background via-background/20 to-transparent z-0 pointer-events-none" />

        {/* Ambient orbs for extra depth */}
        <div className="relative z-10 ambient-orb ambient-orb--primary drift" style={{ width: 500, height: 500, top: "10%", left: "-100px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 w-full grid lg:grid-cols-12 gap-10 items-center py-24">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 glass rounded-full text-[10px] font-bold uppercase tracking-[0.22em] mb-8"
              data-testid="hero-badge"
            >
              <Sparkle weight="fill" size={12} className="text-accent" />
              Authorised Unacademy Franchise · Kashmir
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-[88px] font-light tracking-[-0.04em] leading-[0.95]"
            >
              The future of<br/>
              Kashmir's classrooms,<br/>
              <span className="font-medium italic bg-gradient-to-r from-accent via-amber-300 to-accent bg-clip-text text-transparent text-glow-accent">
                engineered.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="mt-8 text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed font-light"
            >
              A next-generation learning ecosystem for <b className="text-foreground/90">NEET, IIT-JEE, CBSE, JKBOSE, Cambridge</b> and Foundation —
              taught by India's finest educators, anchored across <b className="text-foreground/90">4 centres</b> in the valley.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link to="/enroll"><CTAPrimary data-testid="hero-enroll-btn">Enroll now</CTAPrimary></Link>
              <Link to="/scholarship"><CTAGhost iconRight data-testid="hero-scholarship-btn">Apply for scholarship</CTAGhost></Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-12 flex flex-wrap items-center gap-6 text-xs text-muted-foreground"
            >
              <div className="flex items-center gap-2"><Star weight="fill" size={14} className="text-accent"/> 4.9 · 2,400+ parents</div>
              <div className="hidden sm:flex items-center gap-2"><ShieldCheck weight="duotone" size={14} className="text-primary"/> Trusted since 2023</div>
              <div className="hidden md:flex items-center gap-2"><Trophy weight="duotone" size={14} className="text-accent"/> 100+ NEET/JEE selections</div>
            </motion.div>
          </div>

          {/* Right column — floating glass stats card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            >
              <GlassPanel elevated className="p-7 lg:p-8 relative overflow-hidden" data-testid="hero-stats-panel">
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/10 blur-3xl" />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-accent font-bold mb-6">Live · Impact Snapshot</div>
                  <div className="grid grid-cols-2 gap-6">
                    <Stat value={stats.students_trained} suffix="+" label="Students trained" testid="stat-students"/>
                    <Stat value={stats.selections} suffix="+" label="NEET / JEE selections" testid="stat-selections"/>
                    <Stat value={stats.educators} suffix="+" label="Master educators" testid="stat-educators"/>
                    <Stat value={stats.centers} suffix="" label="Kashmir centres" testid="stat-centers"/>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 1.4 }, y: { repeat: isBot ? 0 : Infinity, duration: 2 } }}
          className="relative z-10 absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          Scroll to explore ↓
        </motion.div>
      </section>

      {/* ============================== MARQUEE — programs ============================== */}
      <section className="relative overflow-hidden border-y border-white/[0.06] bg-white/[0.02] py-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[
              "NEET", "IIT-JEE", "Foundation 8th–10th", "CBSE | JKBOSE 11th 12th", "Daily Doubt Clearing", "AITS Mock Tests",
              "NEET", "IIT-JEE", "Foundation 8th–10th", "CBSE | JKBOSE 11th 12th", "Daily Doubt Clearing", "AITS Mock Tests",
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-5 px-8 shrink-0">
                <span className="font-display text-3xl lg:text-4xl font-light tracking-tight text-white/70">{t}</span>
                <span className="text-accent text-2xl">✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== WATH FEATURED BANNER ============================== */}
      <section className="relative section" data-testid="home-wath-banner">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Reveal>
            <Link to="/wath" className="block group">
              <GlassPanel elevated className="relative overflow-hidden p-8 lg:p-14">
                <div className="ambient-orb ambient-orb--accent" style={{ width: 520, height: 520, top: "-120px", right: "-120px" }} />
                <div className="ambient-orb ambient-orb--primary" style={{ width: 420, height: 420, bottom: "-160px", left: "-80px", opacity: 0.5 }} />
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

                {/* Orbiting trophy */}
                <div className="absolute right-[6%] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none opacity-90">
                  <div className="relative w-[280px] h-[280px]">
                    <div className="absolute inset-0 rounded-full border border-accent/25 animate-[spin_60s_linear_infinite]" />
                    <div className="absolute inset-6 rounded-full border border-primary/30 animate-[spin_45s_linear_infinite_reverse]" />
                    <div className="absolute inset-14 rounded-full border border-accent/15 animate-[spin_30s_linear_infinite]" />
                    <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-accent/20 blur-2xl" />
                    <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-accent glow-accent grid place-items-center">
                      <Trophy weight="fill" size={20} className="text-accent-foreground" />
                    </div>
                  </div>
                </div>

                <div className="relative max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 glass rounded-full text-[10px] font-bold uppercase tracking-[0.22em] mb-6">
                    <Sparkle weight="fill" size={12} className="text-accent" />
                    Kashmir's flagship talent hunt · 2026
                  </div>

                  <h2 className="font-display text-5xl lg:text-7xl font-light tracking-[-0.03em] leading-[0.95]">
                    <span className="bg-gradient-to-br from-accent via-amber-300 to-accent bg-clip-text text-transparent text-glow-accent font-medium">WATH</span>
                    <span className="block text-xl lg:text-2xl text-foreground/70 mt-3 font-light">
                      <span className="text-accent italic font-medium">Wisdom</span> · <span className="text-accent italic font-medium">Aptitude</span> · <span className="text-accent italic font-medium">Talent</span> · <span className="text-accent italic font-medium">Hunt</span>
                    </span>
                  </h2>

                  <p className="mt-6 text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed">
                    A 2-hour valley-wide scholarship exam. Unlock up to <b className="text-accent">100% fee waiver</b> and <b className="text-foreground">cash prizes</b> across NEET, JEE and Foundation programmes. Free to register.
                  </p>

                  <div className="mt-8 flex items-center gap-4 flex-wrap">
                    <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-[0.18em] glow-accent group-hover:translate-y-[-2px] transition-transform">
                      Explore WATH <ArrowUpRight weight="bold" size={14}/>
                    </span>
                    <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-bold">
                      <span>Free entry</span>
                      <span className="hidden sm:inline">·</span>
                      <span className="hidden sm:inline">5 centres</span>
                      <span className="hidden sm:inline">·</span>
                      <span className="hidden sm:inline">Class 7–12 · Droppers</span>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============================== FEATURED COURSES ============================== */}
      <section className="relative section">
        <div className="ambient-orb ambient-orb--primary drift" style={{ width: 600, height: 600, top: "10%", right: "-200px" }} />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-7">
              <Eyebrow>Programmes</Eyebrow>
              <Reveal>
                <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tight leading-[1.02] mt-4">
                  Curriculum built for<br/>
                  <span className="font-medium italic text-accent">India's hardest exams.</span>
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-5 flex lg:items-end lg:justify-end">
              <Reveal>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  Every programme runs on the same playbook used by Unacademy — adapted for J&K students,
                  delivered by AIR rankers and Unacademy mentors.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.slice(0, 6).map(c => (
              <Link to={`/courses/${c.id}`} key={c.id}>
                <CourseCard3D course={c} />
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/courses"><CTAGhost iconRight data-testid="view-all-courses-btn">View all programmes</CTAGhost></Link>
          </div>
        </div>
      </section>

      {/* ============================== HOW IT WORKS — learning path ============================== */}
      <section className="relative section">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
          <div className="text-center mb-16">
            <Eyebrow className="justify-center">The journey</Eyebrow>
            <Reveal>
              <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tight mt-4">
                From <span className="font-medium italic">curious</span> to <span className="text-accent font-medium">conquering AIRs.</span>
              </h2>
            </Reveal>
          </div>
          <div className="relative grid md:grid-cols-4 gap-6">
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent -translate-y-1/2" />
            {[
              { n: "01", icon: Compass, t: "Diagnose", d: "Free scholarship test pinpoints your strengths and gaps." },
              { n: "02", icon: Lightning, t: "Personalise", d: "AI-mapped study plan, mentor pairing, batch slotting." },
              { n: "03", icon: GraduationCap, t: "Train", d: "Daily mentor-led classes + Unacademy national mocks." },
              { n: "04", icon: Trophy, t: "Conquer", d: "Rank-day strategy, exam-week war-room, AIR mastery." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="relative">
                  <GlassPanel className="p-6 h-full" data-testid={`path-step-${i + 1}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-accent">{s.n}</span>
                      <s.icon weight="duotone" size={28} className="text-accent" />
                    </div>
                    <h3 className="font-display text-xl font-medium">{s.t}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.d}</p>
                  </GlassPanel>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== IMPACT — counter band ============================== */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="ambient-orb ambient-orb--accent" style={{ width: 700, height: 700, top: "-200px", right: "-200px", opacity: 0.3 }} />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div>
              <Eyebrow>Impact in numbers</Eyebrow>
              <Reveal>
                <h2 className="font-display text-4xl lg:text-5xl font-light tracking-tight mt-4">
                  Numbers that go <span className="text-accent italic font-medium">beyond</span> a brochure.
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
              {[
                { n: stats.students_trained, s: "+", l: "Aspirants trained" },
                { n: stats.selections, s: "+", l: "NEET / JEE ranks" },
                { n: stats.educators, s: "+", l: "Master educators" },
                { n: stats.centers, s: "", l: "Branches valley-wide" },
              ].map((x, i) => (
                <div key={i} className="bg-background p-6 lg:p-8" data-testid={`impact-${i}`}>
                  <div className="font-display text-4xl lg:text-5xl font-medium tracking-tight">
                    <AnimatedCounter value={x.n} suffix={x.s} />
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-2">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================== STUDENT WALL OF FAME ============================== */}
      {results.length > 0 && (
        <section className="relative section">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div>
                <Eyebrow>Wall of fame</Eyebrow>
                <Reveal>
                  <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tight mt-4">
                    Recent <span className="font-medium italic text-accent">conquerors.</span>
                  </h2>
                </Reveal>
              </div>
              <Link to="/results"><CTAGhost iconRight data-testid="all-results-btn">All results</CTAGhost></Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.slice(0, 6).map((r, i) => (
                <Reveal key={r.id} delay={i * 0.05}>
                  <GlassPanel className="p-6 h-full group transition-all hover:-translate-y-1" data-testid={`result-${r.id}`}>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">{r.exam}</span>
                      <span className="font-mono text-xs text-muted-foreground">{r.year}</span>
                    </div>
                    <div className="font-display text-3xl font-medium tracking-tight">{r.rank}</div>
                    <div className="text-sm text-muted-foreground mt-1">{r.student_name}</div>
                    {r.quote && <p className="mt-5 text-sm leading-relaxed border-l-2 border-accent pl-3 italic text-muted-foreground">"{r.quote}"</p>}
                  </GlassPanel>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================== TESTIMONIALS ============================== */}
      {testimonials.length > 0 && (
        <section className="relative section">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <Eyebrow className="justify-center">Voices</Eyebrow>
              <Reveal>
                <h2 className="font-display text-4xl lg:text-5xl font-light tracking-tight mt-4">
                  Trusted by <span className="font-medium italic">families</span> across Kashmir.
                </h2>
              </Reveal>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.slice(0, 3).map((t, i) => (
                <Reveal key={t.id} delay={i * 0.08}>
                  <GlassPanel elevated className="p-7 h-full" data-testid={`testimonial-${t.id}`}>
                    <Quotes weight="fill" size={28} className="text-accent mb-4 opacity-60" />
                    <p className="text-base leading-relaxed">"{t.quote}"</p>
                    <div className="mt-5 pt-5 border-t border-white/[0.08]">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </GlassPanel>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================== SCHOLARSHIP CTA ============================== */}
      <section className="relative section">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <Reveal>
            <GlassPanel elevated className="relative overflow-hidden p-10 lg:p-16">
              <div className="ambient-orb ambient-orb--accent" style={{ width: 500, height: 500, top: "-100px", right: "-100px" }} />
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <Eyebrow>Scholarship · NST 2026</Eyebrow>
                  <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tight mt-4 leading-[1.05]">
                    Up to <span className="font-medium italic text-accent">100% off</span><br/>on tuition fees.
                  </h2>
                  <p className="mt-5 text-muted-foreground max-w-md leading-relaxed">
                    Sit the Northend Scholarship Test 2026 and unlock partial to full waivers across all programmes.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/scholarship"><CTAPrimary data-testid="scholarship-cta-btn">Apply now</CTAPrimary></Link>
                    <Link to="/scholarship"><CTAGhost iconRight>Calculate eligibility</CTAGhost></Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { pct: "100%", marks: "≥ 90%" },
                    { pct: "75%", marks: "≥ 80%" },
                    { pct: "50%", marks: "≥ 70%" },
                    { pct: "25%", marks: "≥ 60%" },
                  ].map((s, i) => (
                    <Reveal key={s.pct} delay={i * 0.05}>
                      <div className="glass rounded-xl p-5 text-center">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Marks {s.marks}</div>
                        <div className="font-display text-4xl font-medium text-accent mt-2 text-glow-accent">{s.pct}</div>
                        <div className="text-xs text-muted-foreground mt-1">off tuition</div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </Reveal>
        </div>
      </section>

      {/* ============================== CENTERS QUICK MAP ============================== */}
      {centers.length > 0 && (
        <section className="relative section">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-8 mb-12">
              <div className="lg:col-span-7">
                <Eyebrow>Network</Eyebrow>
                <Reveal>
                  <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tight mt-4">
                    Five centres.<br/>
                    <span className="font-medium italic text-accent">One valley.</span>
                  </h2>
                </Reveal>
              </div>
              <div className="lg:col-span-5 flex lg:items-end">
                <Link to="/centers"><CTAGhost iconRight data-testid="all-centers-btn">Visit any centre</CTAGhost></Link>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {centers.slice(0, 6).map((c, i) => (
                <Reveal key={c.id} delay={i * 0.05}>
                  <GlassPanel className="p-6 h-full group transition-all hover:-translate-y-1 hover:border-accent/30" data-testid={`center-${c.id}`}>
                    <div className="flex items-start justify-between mb-3">
                      <MapPin weight="duotone" size={22} className="text-accent" />
                      <ArrowUpRight weight="bold" size={16} className="text-muted-foreground group-hover:text-accent group-hover:rotate-45 transition-all" />
                    </div>
                    <h3 className="font-display text-xl font-medium">{c.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{c.address}</p>
                    <p className="text-xs text-muted-foreground/80 mt-3 font-mono">{c.phone}</p>
                  </GlassPanel>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================== FINAL CTA ============================== */}
      <section className="relative section text-center">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <Reveal>
            <h2 className="font-display text-5xl lg:text-7xl font-light tracking-tight leading-[0.95]">
              Your AIR is <span className="font-medium italic text-accent">closer</span> than you think.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Walk into your nearest Northend centre, or enrol online in 90 seconds.
            </p>
            <div className="mt-10 flex justify-center gap-3 flex-wrap">
              <Link to="/enroll"><CTAPrimary data-testid="final-enroll-btn">Start my journey</CTAPrimary></Link>
              <Link to="/contact"><CTAGhost iconRight data-testid="final-contact-btn">Talk to a counsellor</CTAGhost></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, suffix, label, testid }) {
  return (
    <div data-testid={testid}>
      <div className="font-display text-4xl lg:text-5xl font-medium tracking-tight text-accent">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-2">{label}</div>
    </div>
  );
}