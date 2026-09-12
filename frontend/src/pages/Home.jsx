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
import { Helmet } from "react-helmet-async";
import {
  Star, Sparkle, Trophy, GraduationCap, Lightning, Compass,
  ShieldCheck, ChartLineUp, Quotes, MapPin, ArrowUpRight, Clock
} from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1];

export default function Home() {
  const isMobile = useIsMobile();
  const isBot = isReactSnap(); 
  
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ students_trained: 1323, selections: 100, educators: 100, centers: 5 });
  const [results, setResults] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [centers, setCenters] = useState([]);
  
  // WATH State
  const [wathPage, setWathPage] = useState(null);
  const [wathLoading, setWathLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/courses?featured=true").then(r => setCourses(r.data)).catch(()=>{}),
      api.get("/stats").then(r => {
        // Destructure 'centers' out so the backend stats can NEVER overwrite it
        const { centers: _, ...statsWithoutCenters } = r.data;
        setStats(prev => ({ ...prev, ...statsWithoutCenters }));
      }).catch(()=>{}),
      api.get("/results").then(r => setResults(r.data.slice(0, 6))).catch(()=>{}),
      api.get("/testimonials").then(r => setTestimonials(r.data)).catch(()=>{}),
      api.get("/centers").then(r => {
        setCenters(r.data);
        // Explicitly set the accurate count from the array length
        setStats(prev => ({ ...prev, centers: r.data.length }));
      }).catch(()=>{}),
      api.get("/wath/page")
         .then(r => setWathPage(r.data))
         .catch(()=>{})
         .finally(() => setWathLoading(false)),
    ]);
  }, []);

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://northendedu.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Northend Educational World",
            "url": "https://northendedu.com",
            "logo": "https://northendedu.com/logo192.png",
            "description": "Premium academic coaching and competitive exam preparation platform for students across Kashmir.",
            "sameAs": [
              "https://www.facebook.com/unacademykashmiroffline",
              "https://www.instagram.com/unacademykashmir"
            ]
          })}
        </script>
      </Helmet>
      
      <div data-testid="home-page" className="overflow-x-hidden w-full">
        {/* ============================== CINEMATIC HERO ============================== */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden pb-12">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 pointer-events-none"
          >
            <source src="https://quark.uacdn.net/acquisition/AboutUsHeader--compressed.webm" type="video/webm" />
            <source src="https://quark.uacdn.net/acquisition/AboutUsHeader--compressed.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-background/60 bg-gradient-to-t from-background via-background/40 to-transparent z-0 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-12 gap-8 items-center py-12 lg:py-20">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 glass rounded-full text-[10px] font-bold uppercase tracking-[0.22em] mb-6"
                data-testid="hero-badge"
              >
                <Sparkle weight="fill" size={12} className="text-accent shrink-0" />
                <span className="truncate">Authorised Unacademy Franchise · Kashmir</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[-0.04em] leading-[1.05] sm:leading-[0.95] text-foreground"
              >
                The future of<br/>
                Kashmir's classrooms,<br/>
                <span className="font-medium italic bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  engineered.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
                className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed font-light"
              >
                A next-generation learning ecosystem for <b className="text-foreground/90">NEET, IIT-JEE, CBSE, JKBOSE, Cambridge</b> and Foundation —
                taught by India's finest educators, anchored across <b className="text-foreground/90">4 centres</b> in the valley.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
              >
                <Link to="/enroll" className="w-full sm:w-auto"><CTAPrimary data-testid="hero-enroll-btn" className="w-full sm:w-auto justify-center">Enroll now</CTAPrimary></Link>
                <Link to="/scholarship" className="w-full sm:w-auto"><CTAGhost iconRight data-testid="hero-scholarship-btn" className="w-full sm:w-auto justify-center">Apply for scholarship</CTAGhost></Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted-foreground"
              >
                <div className="flex items-center gap-2"><Star weight="fill" size={14} className="text-accent shrink-0"/> 4.9 · 2,400+ parents</div>
                <div className="flex items-center gap-2"><ShieldCheck weight="duotone" size={14} className="text-primary shrink-0"/> Trusted since 2023</div>
                <div className="flex items-center gap-2"><Trophy weight="duotone" size={14} className="text-accent shrink-0"/> 100+ NEET/JEE selections</div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 w-full">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
              >
                <GlassPanel elevated className="p-6 sm:p-7 lg:p-8 relative overflow-hidden w-full" data-testid="hero-stats-panel">
                  <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
                  <div className="relative">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-accent font-bold mb-6">Live · Impact Snapshot</div>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
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
        </section>

        {/* ============================== MARQUEE — programs ============================== */}
        <section className="relative overflow-hidden border-y border-border bg-muted py-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent" />

          <div className="marquee-wrapper overflow-hidden flex w-full">
            <div className="animate-marquee flex items-center shrink-0">
              {[
                "NEET", "IIT-JEE", "Foundation 8th–10th", "CBSE | JKBOSE 11th 12th", "Daily Doubt Clearing", "AITS Mock Tests",
                "NEET", "IIT-JEE", "Foundation 8th–10th", "CBSE | JKBOSE 11th 12th", "Daily Doubt Clearing", "AITS Mock Tests",
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-5 px-6 sm:px-8 shrink-0">
                  <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-foreground/80">{t}</span>
                  <span className="text-accent text-xl sm:text-2xl">✦</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== WATH FEATURED BANNER ============================== */}
        {!wathLoading && (
          <section className="relative py-12 lg:py-16" data-testid="home-wath-banner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal>
                {wathPage?.mode === "disabled" ? (
                  <GlassPanel elevated className="relative overflow-hidden p-6 sm:p-8 lg:p-14 text-center grid place-items-center">
                    <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                    <div className="relative max-w-xl mx-auto py-8">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[10px] uppercase tracking-[0.22em] font-bold text-accent mb-6">
                        <Clock size={12} weight="bold"/> Registrations paused
                      </div>
                      <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.03em] leading-[1.05]">
                        WATH is <span className="italic text-accent font-medium">taking a breath</span>
                      </h2>
                      <p className="mt-4 text-sm sm:text-base text-muted-foreground">
                        {wathPage?.disabled_message || "The next scholarship examination window is being scheduled. Follow us on WhatsApp to be the first to know when registrations open."}
                      </p>
                    </div>
                  </GlassPanel>
                ) : (
                  <Link to="/wath" className="block group">
                    <GlassPanel elevated className="relative overflow-hidden p-6 sm:p-8 lg:p-14">
                      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

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
                          <Sparkle weight="fill" size={12} className="text-accent shrink-0" />
                          <span className="truncate">
                            {wathPage?.mode === "carnival" 
                              ? "WATH Carnival · Kashmir's flagship talent weekend" 
                              : "WATH · Kashmir's flagship talent search exam"}
                          </span>
                        </div>

                        <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl font-light tracking-[-0.03em] leading-[1.05] sm:leading-[0.95]">
                          <span className="bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent font-medium">
                            {wathPage?.mode === "carnival" ? (wathPage?.carnival?.title || "WATH Carnival") : "WATH"}
                          </span>
                          <span className="block text-lg sm:text-xl lg:text-2xl text-foreground/85 mt-3 font-light">
                            {wathPage?.mode === "carnival" ? (
                              "Choose your Date  →  Book your Slot  →  Earn your Scholarship"
                            ) : (
                              <><span className="text-accent italic font-medium">Wisdom</span> · <span className="text-accent italic font-medium">Aptitude</span> · <span className="text-accent italic font-medium">Talent</span> · <span className="text-accent italic font-medium">Hunt</span></>
                            )}
                          </span>
                        </h2>

                        <p className="mt-6 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed">
                          {wathPage?.mode === "carnival" 
                            ? (wathPage?.carnival?.description || "A week-long WATH scholarship examination window. Choose the exam date and time slot that works for you. Unlock up to 100% fee waiver.") 
                            : "Kashmir's flagship talent search exam. Recognise your potential. Unlock up to 100% scholarship and cash prizes across NEET, JEE, Foundation programmes."
                          }
                        </p>

                        <div className="mt-8 flex items-center gap-4 flex-wrap">
                          <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-[0.18em] glow-accent group-hover:translate-y-[-2px] transition-transform">
                            Explore {wathPage?.mode === "carnival" ? "Carnival" : "WATH"} <ArrowUpRight weight="bold" size={14} />
                          </span>
                          <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-bold flex-wrap">
                            <span>Free entry</span>
                            <span>·</span>
                            <span>
                              {wathPage?.mode === "carnival" 
                                ? (wathPage?.carnival?.available_venues?.length || 5) 
                                : (wathPage?.exam?.available_venues?.length || 5)} centres
                            </span>
                            <span>·</span>
                            <span>Class 7–12 · Droppers</span>
                          </div>
                        </div>
                      </div>
                    </GlassPanel>
                  </Link>
                )}
              </Reveal>
            </div>
          </section>
        )}

        {/* ============================== FEATURED COURSES ============================== */}
        <section className="relative py-12 lg:py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 mb-10 items-end">
              <div className="lg:col-span-7">
                <Eyebrow>Programmes</Eyebrow>
                <Reveal>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] sm:leading-[1.02] mt-4">
                    Curriculum built for<br/>
                    <span className="font-medium italic text-accent">India's hardest exams.</span>
                  </h2>
                </Reveal>
              </div>
              <div className="lg:col-span-5 flex lg:justify-end">
                <Reveal>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                    Every programme runs on the same playbook used by Unacademy — adapted for J&K students,
                    delivered by AIR rankers and Unacademy mentors.
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.slice(0, 6).map(c => (
                <Link to={`/courses/${c.id}`} key={c.id} className="h-full">
                  <CourseCard3D course={c} />
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/courses" className="inline-block w-full sm:w-auto"><CTAGhost iconRight data-testid="view-all-courses-btn" className="w-full sm:w-auto justify-center">View all programmes</CTAGhost></Link>
            </div>
          </div>
        </section>

        {/* ============================== HOW IT WORKS — learning path ============================== */}
        <section className="relative py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <Eyebrow className="justify-center">The journey</Eyebrow>
              <Reveal>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mt-4">
                  From <span className="font-medium italic">curious</span> to <span className="text-accent font-medium">conquering AIRs.</span>
                </h2>
              </Reveal>
            </div>
            <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent -translate-y-1/2" />
              {[
                { n: "01", icon: Compass, t: "Diagnose", d: "Free scholarship test pinpoints your strengths and gaps." },
                { n: "02", icon: Lightning, t: "Personalise", d: "AI-mapped study plan, mentor pairing, batch slotting." },
                { n: "03", icon: GraduationCap, t: "Train", d: "Daily mentor-led classes + Unacademy national mocks." },
                { n: "04", icon: Trophy, t: "Conquer", d: "Rank-day strategy, exam-week war-room, AIR mastery." },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <div className="relative h-full">
                    <GlassPanel className="p-6 h-full flex flex-col justify-between" data-testid={`path-step-${i + 1}`}>
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-xs text-accent">{s.n}</span>
                          <s.icon weight="duotone" size={28} className="text-accent shrink-0" />
                        </div>
                        <h3 className="font-display text-xl font-medium">{s.t}</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.d}</p>
                      </div>
                    </GlassPanel>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== IMPACT — counter band ============================== */}
        <section className="relative py-16 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div>
                <Eyebrow>Impact in numbers</Eyebrow>
                <Reveal>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mt-4">
                    Numbers that go <span className="text-accent italic font-medium">beyond</span> a brochure.
                  </h2>
                </Reveal>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {[
                  { n: stats.students_trained, s: "+", l: "Aspirants trained" },
                  { n: stats.selections, s: "+", l: "NEET / JEE ranks" },
                  { n: stats.educators, s: "+", l: "Master educators" },
                  { n: stats.centers, s: "", l: "Branches valley-wide" },
                ].map((x, i) => (
                  <div key={i} className="bg-background p-6 lg:p-8 rounded-2xl border border-border/60" data-testid={`impact-${i}`}>
                    <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
                      <AnimatedCounter value={x.n} suffix={x.s} />
                    </div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground mt-2">{x.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================== STUDENT WALL OF FAME ============================== */}
        {results.length > 0 && (
          <section className="relative py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
                <div>
                  <Eyebrow>Wall of fame</Eyebrow>
                  <Reveal>
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mt-4">
                      Recent <span className="font-medium italic text-accent">conquerors.</span>
                    </h2>
                  </Reveal>
                </div>
                <Link to="/results"><CTAGhost iconRight data-testid="all-results-btn">All results</CTAGhost></Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.slice(0, 6).map((r, i) => (
                  <Reveal key={r.id} delay={i * 0.05}>
                    <GlassPanel className="p-6 h-full group transition-all hover:-translate-y-1 flex flex-col justify-between" data-testid={`result-${r.id}`}>
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">{r.exam}</span>
                          <span className="font-mono text-xs text-muted-foreground">{r.year}</span>
                        </div>
                        <div className="font-display text-3xl font-medium tracking-tight">{r.rank}</div>
                        <div className="text-sm text-muted-foreground mt-1">{r.student_name}</div>
                      </div>
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
          <section className="relative py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <Eyebrow className="justify-center">Voices</Eyebrow>
                <Reveal>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mt-4">
                    Trusted by <span className="font-medium italic">families</span> across Kashmir.
                  </h2>
                </Reveal>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {testimonials.slice(0, 3).map((t, i) => (
                  <Reveal key={t.id} delay={i * 0.08}>
                    <GlassPanel elevated className="p-6 sm:p-7 h-full flex flex-col justify-between" data-testid={`testimonial-${t.id}`}>
                      <div>
                        <Quotes weight="fill" size={28} className="text-accent mb-4 opacity-60" />
                        <p className="text-sm sm:text-base leading-relaxed">"{t.quote}"</p>
                      </div>
                      <div className="mt-5 pt-5 border-t border-border">
                        <div className="font-medium text-sm sm:text-base">{t.name}</div>
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
        <section className="relative py-12 lg:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <GlassPanel elevated className="relative overflow-hidden p-6 sm:p-10 lg:p-16">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
                  <div>
                    <Eyebrow>Scholarship · NST 2026</Eyebrow>
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mt-4 leading-[1.05]">
                      Up to <span className="font-medium italic text-accent">100% off</span><br/>on tuition fees.
                    </h2>
                    <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                      Sit the Northend Scholarship Test 2026 and unlock partial to full waivers across all programmes.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                      <Link to="/scholarship" className="w-full sm:w-auto"><CTAPrimary data-testid="scholarship-cta-btn" className="w-full sm:w-auto justify-center">Apply now</CTAPrimary></Link>
                      <Link to="/scholarship" className="w-full sm:w-auto"><CTAGhost iconRight className="w-full sm:w-auto justify-center">Calculate eligibility</CTAGhost></Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { marks: "≥ 90%", pct: "100%" },
                      { marks: "≥ 80%", pct: "75%" },
                      { marks: "≥ 70%", pct: "50%" },
                      { marks: "≥ 60%", pct: "25%" },
                    ].map((tier, index) => (
                      <Reveal key={index} delay={index * 0.05}>
                        <div className="glass rounded-xl p-4 sm:p-5 text-center">
                          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            Marks <span style={{ display: "contents" }}>{tier.marks}</span>
                          </div>
                          <div className="font-display text-3xl sm:text-4xl font-medium text-accent mt-2 text-glow-accent">
                            {tier.pct}
                          </div>
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
        {centers.length > 0 && (() => {
          const countWords = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
          const centreWord = countWords[centers.length] || centers.length;

          return (
            <section className="relative py-12 lg:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 mb-10 items-end">
                  <div className="lg:col-span-7">
                    <Eyebrow>Network</Eyebrow>
                    <Reveal>
                      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mt-4">
                        {centreWord} centres.<br/>
                        <span className="font-medium italic text-accent">One valley.</span>
                      </h2>
                    </Reveal>
                  </div>
                  <div className="lg:col-span-5 flex lg:justify-end">
                    <Link to="/centers"><CTAGhost iconRight data-testid="all-centers-btn">Visit any centre</CTAGhost></Link>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {centers.slice(0, 6).map((c, i) => (
                    <Reveal key={c.id} delay={i * 0.05}>
                      <GlassPanel className="p-6 h-full group transition-all hover:-translate-y-1 hover:border-accent/30 flex flex-col justify-between" data-testid={`center-${c.id}`}>
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <MapPin weight="duotone" size={22} className="text-accent" />
                            <ArrowUpRight weight="bold" size={16} className="text-muted-foreground group-hover:text-accent group-hover:rotate-45 transition-all" />
                          </div>
                          <h3 className="font-display text-xl font-medium">{c.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{c.address}</p>
                        </div>
                        <p className="text-xs text-muted-foreground/80 mt-4 font-mono">{c.phone}</p>
                      </GlassPanel>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        {/* ============================== FINAL CTA ============================== */}
        <section className="relative py-16 lg:py-24 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] sm:leading-[0.95]">
                Your AIR is <span className="font-medium italic text-accent">closer</span> than you think.
              </h2>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                Walk into your nearest Northend centre, or enrol online in 90 seconds.
              </p>
              <div className="mt-10 flex justify-center gap-3 flex-wrap">
                <Link to="/enroll" className="w-full sm:w-auto"><CTAPrimary data-testid="final-enroll-btn" className="w-full sm:w-auto justify-center">Start my journey</CTAPrimary></Link>
                <Link to="/contact" className="w-full sm:w-auto"><CTAGhost iconRight data-testid="final-contact-btn" className="w-full sm:w-auto justify-center">Talk to a counsellor</CTAGhost></Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}

function Stat({ value, suffix, label, testid }) {
  return (
    <div data-testid={testid}>
      <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-accent">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-2">{label}</div>
    </div>
  );
}