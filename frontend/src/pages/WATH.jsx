import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api, API_BASE, formatError } from "@/lib/api";
import GlassPanel from "@/components/GlassPanel";
import { CTAPrimary, CTAGhost, Eyebrow, Reveal } from "@/components/Cinematic";
import { AnimatedCounter } from "@/components/Metrics";
import {
  Trophy, Sparkle, GraduationCap, MedalMilitary, Clock, MapPin,
  CalendarBlank, Coins, ChartLineUp, ArrowRight, ArrowDown, FileText,
  Download, Check, WhatsappLogo, Question, Certificate, IdentificationCard, X, CaretDown
} from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1];

const CLASSES = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11 (NEET)", "Class 11 (IIT-JEE)", "Class 12 (NEET)", "Class 12 (IIT-JEE)", "Dropper (NEET)", "Dropper (IIT-JEE)"];

const SLABS = [
  { pct: "100%", marks: "≥ 90%", tag: "Star Scholar" },
  { pct: "75%",  marks: "≥ 80%", tag: "Merit Scholar" },
  { pct: "50%",  marks: "≥ 70%", tag: "Excellence" },
  { pct: "25%",  marks: "≥ 60%", tag: "Encouragement" },
];

const REWARDS = [
  { title: "Cash prize", detail: "State toppers · zonal toppers · category-wise recognition." },
  { title: "Scholarship", detail: "Up to 100% on NEET, JEE and Foundation classroom courses." },
  { title: "Certificate", detail: "Merit certificates for every qualifier + trophies for top 10." },
  { title: "Mentorship", detail: "1-on-1 mentor pairing with AIR-ranker educators." },
];

const FAQS = [
  { q: "Who can appear for WATH?", a: "Any student from Class 7 to Class 12 studying in J&K, plus current NEET/JEE droppers." },
  { q: "Is there a registration fee?", a: "No — WATH is completely free to register and appear." },
  { q: "What's the exam format?", a: "A 2-hour objective-type paper covering Mental Ability, Science, Mathematics and Aptitude. Difficulty is calibrated to your class/target exam." },
  { q: "Where will the exam be held?", a: "Across Unacademy Kashmir Offline centre — you choose the closest venue during registration." },
  { q: "When is the result declared?", a: "Result is declared within 7 days of the exam. You'll receive an SMS + can also check on this page using your application number." },
  { q: "How do I claim my scholarship?", a: "Result card carries your scholarship percentage. Walk into any Unacademy Kashmir Offline centre with the printed result card — admissions team will apply the waiver on your fee." },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function InfoBlock({ label, value, testid, mono }) {
  return (
    <div className="glass rounded-2xl p-4" data-testid={testid}>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold">{label}</div>
      <div className={`text-sm font-medium mt-1 ${mono ? "font-mono" : ""}`}>{value || "—"}</div>
    </div>
  );
}

export default function WATH() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/scholarships")
      .then(r => {
        const list = r.data || [];
        const found = list.find(c => c.title?.toUpperCase().includes("WATH"))
          || list.find(c => c.active !== false)
          || list[0];
        setCampaign(found || null);
      })
      .catch(() => setCampaign(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative" data-testid="wath-page">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <HeroSection campaign={campaign} loading={loading} />
      <AboutSection />
      <FormatSection />
      <RewardsSection />
      <SlabsSection />
      <TimelineSection campaign={campaign} />
      <AdmitCardDownloadSection campaign={campaign} />
      <ResultCheckSection />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}

// ---------------- Sections ----------------

function HeroSection({ campaign, loading }) {
  const examDate = campaign?.exam_date;
  const [form, setForm] = useState({
    name: "", email: "", phone: "", class_or_course: "", school_name: "", venue: "",
  });
  const [submitted, setSubmitted] = useState(null);
  const [busy, setBusy] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (campaign?.available_venues?.length && !form.venue) {
      setForm(f => ({ ...f, venue: campaign.available_venues[0] }));
    }
  }, [campaign, form.venue]);

  const submit = async (e) => {
    e.preventDefault();
    if (!campaign) { toast.error("Registration is not open yet — please check back soon."); return; }
    setBusy(true);
    try {
      const [d1, d2] = form.class_or_course.includes("(") ? form.class_or_course.split("(") : [form.class_or_course, ""];
      const targetExam = d2.includes("NEET") ? "NEET" : d2.includes("JEE") ? "JEE" : form.class_or_course.includes("11") || form.class_or_course.includes("12") ? "NEET/JEE" : "Foundation";
      
      const { data } = await api.post("/scholarship-applications", {
        scholarship_id: campaign.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        school: form.school_name,
        standard: form.class_or_course,
        target_exam: targetExam,
        city: (form.venue || "Srinagar").replace(/^Northend\s+/i, "") || "Srinagar",
        venue: form.venue || undefined,
      });
      setSubmitted(data);
      toast.success("Registered — download your admit card below.");
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Registration failed. Please try again.");
    } finally { setBusy(false); }
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl glass text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition";

  return (
    <>
      <Helmet>
        <title>WATH | Wisdom Aptitude Talent Hunt</title>
        <link rel="canonical" href="https://northendedu.com/wath" />
      </Helmet>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute right-[6%] top-[15%] hidden lg:block pointer-events-none opacity-70">
          <div className="relative w-[420px] h-[420px]">
            <div className="absolute inset-0 rounded-full border border-accent/25 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-8 rounded-full border border-primary/30 animate-[spin_45s_linear_infinite_reverse]" />
            <div className="absolute inset-16 rounded-full border border-accent/15 animate-[spin_30s_linear_infinite]" />
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-accent/20 blur-2xl" />
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-accent glow-accent grid place-items-center">
              <Trophy weight="fill" size={24} className="text-accent-foreground" />
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 w-full grid lg:grid-cols-12 gap-10 items-center py-24">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 glass rounded-full text-[10px] font-bold uppercase tracking-[0.22em] mb-8"
            >
              <Sparkle weight="fill" size={12} className="text-accent" />
              Unacademy Kashmir
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }} className="mb-4">
              <div className="font-display text-[110px] lg:text-[180px] font-medium tracking-[-0.08em] leading-[0.85] bg-gradient-to-br from-[#1380d0] via-accent to-[#1380d0] bg-clip-text text-transparent text-glow-accent">
                WATH
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }} className="font-display text-2xl lg:text-4xl font-light tracking-[-0.02em] leading-tight">
              <span className="text-accent italic font-medium">Wisdom</span> · <span className="text-accent italic font-medium">Aptitude</span> · <span className="text-accent italic font-medium">Talent</span> · <span className="text-accent italic font-medium">Hunt</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }} className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed font-light">
              Kashmir's flagship talent search exam. Recognise your potential. Unlock up to <b className="text-accent">100% scholarship</b> and <b className="text-foreground">cash prizes</b> across NEET, JEE, Foundation programmes.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.5 }} className="mt-10 flex flex-wrap gap-3">
              <div onClick={() => setIsModalOpen(true)}>
                <CTAPrimary data-testid="hero-register-btn">Register — it's free</CTAPrimary>
              </div>
              <a href="#admit-card"><CTAGhost iconRight data-testid="hero-admit-btn">Get Admit Card</CTAGhost></a>
            </motion.div>
          </div>

          <div className="lg:col-span-5" id="register">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
              <GlassPanel elevated className="p-6 lg:p-7 relative overflow-hidden" data-testid="hero-exam-details">
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/10 blur-3xl" />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-accent font-bold mb-5 flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent pulse-ring"/>Register for WATH</span>
                    <span className="text-muted-foreground font-normal lowercase">free entry</span>
                  </div>

                  {submitted ? (
                    <div id="admit-card-block" className="py-2">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-accent font-bold">
                        <Check weight="bold" size={14}/> Registration successful
                      </div>
                      <h3 className="font-display text-2xl font-light tracking-tight mt-2">
                        Welcome to <span className="font-medium italic text-accent">WATH.</span>
                      </h3>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <InfoBlock label="Application no" value={submitted.application_no} testid="app-no" mono/>
                        <InfoBlock label="Venue" value={submitted.venue}/>
                      </div>
                      <div className="mt-4 p-4 glass rounded-xl border border-accent/25">
                        <p className="text-xs text-muted-foreground leading-relaxed">Download your admit card and save it to your phone for exam day entry.</p>
                        <div className="mt-4 flex flex-col gap-2">
                          <a href={`${API_BASE}/scholarship-applications/${submitted.application_no}/admit-card?phone=${encodeURIComponent(submitted.phone || form.phone)}`} target="_blank" rel="noreferrer" data-testid="download-admit-card">
                            <CTAPrimary className="w-full justify-center text-xs py-2"><Download weight="bold" size={14}/> Download admit card</CTAPrimary>
                          </a>
                          {campaign?.whatsapp_community_url && (
                            <a href={campaign.whatsapp_community_url} target="_blank" rel="noreferrer" data-testid="join-wa">
                              <CTAGhost className="w-full justify-center text-xs py-2" iconRight><WhatsappLogo weight="fill" size={14}/> Join WhatsApp</CTAGhost>
                            </a>
                          )}
                        </div>
                      </div>
                      <button onClick={() => setSubmitted(null)} className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground flex items-center gap-1.5" data-testid="register-another">
                        Register another aspirant <ArrowRight weight="bold" size={12} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={submit} data-testid="wath-register-form" className="space-y-3">
                      {!campaign && (
                        <div className="p-3 rounded-xl glass border border-amber-500/30 text-xs">
                          <span className="font-bold uppercase text-amber-400">Opening soon</span> — drop details to get notified.
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2.5">
                        <input className={inputCls} placeholder="Full name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} data-testid="wath-name"/>
                        <input className={inputCls} type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} data-testid="wath-email"/>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <input className={inputCls} placeholder="Phone number" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} data-testid="wath-phone"/>
                        <div className="relative">
                          <select className={`${inputCls} appearance-none pr-8`} required value={form.class_or_course} onChange={e => setForm({...form, class_or_course: e.target.value})} data-testid="wath-class">
                            <option value="" disabled className="bg-background text-muted-foreground">Current class</option>
                            {CLASSES.map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
                          </select>
                          <CaretDown weight="bold" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                      <input className={inputCls} placeholder="School / current institute" required value={form.school_name} onChange={e => setForm({...form, school_name: e.target.value})} data-testid="wath-school"/>
                      {campaign?.available_venues?.length > 0 ? (
                        <div className="relative">
                          <select className={`${inputCls} appearance-none pr-8`} required value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} data-testid="wath-venue">
                            <option value="" className="bg-background">— Select exam venue —</option>
                            {campaign.available_venues.map(v => <option key={v} value={v} className="bg-background">{v}</option>)}
                          </select>
                          <CaretDown weight="bold" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                      ) : (
                        <input className={inputCls} placeholder="Preferred venue (e.g. Srinagar)" required value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} data-testid="wath-venue-text"/>
                      )}

                      <div className="pt-1">
                        <CTAPrimary type="submit" className="w-full justify-center text-xs py-2.5" data-testid="wath-submit" disabled={busy || !campaign}>
                          {busy ? "Registering…" : campaign ? "Register & get admit card" : "Notify me"}
                        </CTAPrimary>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Exam: {loading ? "…" : (examDate ? formatDate(examDate) : "TBA")}</span>
                        <span>Fee: ₹0 (Free)</span>
                      </div>
                    </form>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </div>

        {/* Modal Popup Form for Hero Section Button */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="w-full max-w-lg relative"
              >
                <GlassPanel elevated className="p-6 lg:p-7 relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/10 blur-3xl" />
                  
                  {/* Fixed X button positioning with proper flex header alignment */}
                  <div className="relative mb-5 flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-accent font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent pulse-ring"/>Register for WATH
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground lowercase">free entry</span>
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="p-1.5 rounded-full glass hover:bg-muted text-muted-foreground hover:text-foreground transition flex items-center justify-center"
                      >
                        <X weight="bold" size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    {submitted ? (
                      <div className="py-2">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-accent font-bold">
                          <Check weight="bold" size={14}/> Registration successful
                        </div>
                        <h3 className="font-display text-2xl font-light tracking-tight mt-2">
                          Welcome to <span className="font-medium italic text-accent">WATH.</span>
                        </h3>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <InfoBlock label="Application no" value={submitted.application_no} mono/>
                          <InfoBlock label="Venue" value={submitted.venue}/>
                        </div>
                        <div className="mt-4 p-4 glass rounded-xl border border-accent/25">
                          <p className="text-xs text-muted-foreground leading-relaxed">Download your admit card and save it to your phone for exam day entry.</p>
                          <div className="mt-4 flex flex-col gap-2">
                            <a href={`${API_BASE}/scholarship-applications/${submitted.application_no}/admit-card?phone=${encodeURIComponent(submitted.phone || form.phone)}`} target="_blank" rel="noreferrer">
                              <CTAPrimary className="w-full justify-center text-xs py-2"><Download weight="bold" size={14}/> Download admit card</CTAPrimary>
                            </a>
                          </div>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                          Close modal <ArrowRight weight="bold" size={12} />
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={submit} className="space-y-3">
                        {!campaign && (
                          <div className="p-3 rounded-xl glass border border-amber-500/30 text-xs">
                            <span className="font-bold uppercase text-amber-400">Opening soon</span> — drop details to get notified.
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2.5">
                          <input className={inputCls} placeholder="Full name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
                          <input className={inputCls} type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <input className={inputCls} placeholder="Phone number" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
                          <div className="relative">
                            <select className={`${inputCls} appearance-none pr-8`} required value={form.class_or_course} onChange={e => setForm({...form, class_or_course: e.target.value})}>
                              <option value="" disabled className="bg-background text-muted-foreground">Current class</option>
                              {CLASSES.map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
                            </select>
                            <CaretDown weight="bold" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          </div>
                        </div>
                        <input className={inputCls} placeholder="School / current institute" required value={form.school_name} onChange={e => setForm({...form, school_name: e.target.value})}/>
                        {campaign?.available_venues?.length > 0 ? (
                          <div className="relative">
                            <select className={`${inputCls} appearance-none pr-8`} required value={form.venue} onChange={e => setForm({...form, venue: e.target.value})}>
                              <option value="" className="bg-background">— Select exam venue —</option>
                              {campaign.available_venues.map(v => <option key={v} value={v} className="bg-background">{v}</option>)}
                            </select>
                            <CaretDown weight="bold" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          </div>
                        ) : (
                          <input className={inputCls} placeholder="Preferred venue (e.g. Srinagar)" required value={form.venue} onChange={e => setForm({...form, venue: e.target.value})}/>
                        )}

                        <div className="pt-1">
                          <CTAPrimary type="submit" className="w-full justify-center text-xs py-2.5" disabled={busy || !campaign}>
                            {busy ? "Registering…" : campaign ? "Register & get admit card" : "Notify me"}
                          </CTAPrimary>
                        </div>
                      </form>
                    )}
                  </div>
                </GlassPanel>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 1.4 }, y: { repeat: Infinity, duration: 2 } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          Scroll to explore ↓
        </motion.div>
      </section>
    </>
  );
}

function AboutSection() {
  return (
    <section id="about" className="relative section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-12 gap-8 mb-14">
          <div className="lg:col-span-7">
            <Eyebrow>What is WATH</Eyebrow>
            <Reveal>
              <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tight leading-[1.02] mt-4">
                A state talent search built<br/>to <span className="font-medium italic text-accent">recognise, encourage &amp; reward.</span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5 flex lg:items-end">
            <Reveal>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                WATH is a 2-hour, breakthrough aptitude &amp; talent assessment that gauges your potential across JEE, NEET, Olympiads and other national competitive exams — created for ambitious minds across Kashmir.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { Icon: Sparkle, t: "Recognise talent", d: "A rigorous diagnostic that surfaces your true intellectual band across science, math and aptitude." },
            { Icon: ChartLineUp, t: "Encourage ambition", d: "Detailed section-wise analysis maps your strengths and blind-spots — a roadmap to your target exam." },
            { Icon: MedalMilitary, t: "Reward excellence", d: "Scholarships up to 100% + cash prizes for state and zonal toppers, celebrated at a valley-wide felicitation." },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 0.08}>
              <GlassPanel elevated className="p-8 h-full">
                <x.Icon weight="duotone" size={30} className="text-accent mb-5" />
                <h3 className="font-display text-2xl font-medium">{x.t}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed text-sm">{x.d}</p>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FormatSection() {
  return (
    <section className="relative section-padding">
      <div className="container-custom">
        <div className="text-center mb-14">
          <Eyebrow className="justify-center">Exam format</Eyebrow>
          <Reveal>
            <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tight mt-4">
              Two hours. <span className="font-medium italic text-accent">Zero shortcuts.</span>
            </h2>
          </Reveal>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { n: "120", s: "min", l: "Duration" },
            { n: "80", s: "Qs", l: "Total questions" },
            { n: "4", s: "", l: "Sections" },
            { n: "0", s: "%", l: "Negative marking" },
          ].map((x, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <GlassPanel className="p-6 text-center">
                <div className="font-display text-5xl font-medium text-accent">
                  <AnimatedCounter value={parseInt(x.n)}/><span className="text-xl">{x.s}</span>
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-3">{x.l}</div>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-5">
          <Reveal>
            <GlassPanel className="p-6">
              <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent mb-3">Junior track (Class 7–10)</div>
              <ul className="space-y-2 text-sm">
                <ItemCheck>Mental Ability &amp; Reasoning</ItemCheck>
                <ItemCheck>Science (Physics · Chemistry · Biology)</ItemCheck>
                <ItemCheck>Mathematics</ItemCheck>
                <ItemCheck>English &amp; Verbal Aptitude</ItemCheck>
              </ul>
            </GlassPanel>
          </Reveal>
          <Reveal delay={0.08}>
            <GlassPanel className="p-6">
              <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent mb-3">Senior &amp; Dropper track (Class 11–12, JEE/NEET Dropper)</div>
              <ul className="space-y-2 text-sm">
                <ItemCheck>Physics — advanced problem solving</ItemCheck>
                <ItemCheck>Chemistry — organic &amp; physical</ItemCheck>
                <ItemCheck>Biology (NEET) OR Mathematics (JEE)</ItemCheck>
                <ItemCheck>Logical &amp; Analytical Reasoning</ItemCheck>
              </ul>
            </GlassPanel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ItemCheck({ children }) {
  return <li className="flex items-center gap-2 text-muted-foreground"><Check weight="bold" size={14} className="text-accent flex-shrink-0"/>{children}</li>;
}

function RewardsSection() {
  return (
    <section className="relative section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-12 gap-8 mb-14">
          <div className="lg:col-span-7">
            <Eyebrow>Rewards</Eyebrow>
            <Reveal>
              <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tight leading-[1.02] mt-4">
                Every rank is <br/><span className="font-medium italic text-accent">a real cheque.</span>
              </h2>
            </Reveal>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REWARDS.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <GlassPanel elevated className="p-6 h-full">
                <div className="font-display text-3xl font-medium text-accent">{r.title}</div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{r.detail}</p>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SlabsSection() {
  return (
    <section className="relative section-padding">
      <div className="container-custom max-w-6xl">
        <Reveal>
          <GlassPanel elevated className="relative overflow-hidden p-8 lg:p-14">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative">
              <div className="text-center mb-10">
                <Eyebrow className="justify-center">Scholarship slabs</Eyebrow>
                <h2 className="font-display text-4xl lg:text-5xl font-light tracking-tight mt-4">
                  Score more, <span className="font-medium italic text-accent">pay less.</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {SLABS.map((s, i) => (
                  <Reveal key={s.pct} delay={i * 0.05}>
                    <div className="glass rounded-2xl p-6 text-center">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Score {s.marks}</div>
                      <div className="font-display text-5xl font-medium text-accent mt-3 text-glow-accent">{s.pct}</div>
                      <div className="text-xs text-muted-foreground mt-1">off tuition</div>
                       <div className="mt-3 pt-3 border-t border-border text-[10px] uppercase tracking-[0.18em] font-bold text-foreground/70">{s.tag}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground mt-8 max-w-2xl mx-auto">*Applicable on tuition component of NEET, JEE and Foundation classroom programmes. Final award subject to admissions verification.</p>
            </div>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}

function TimelineSection({ campaign }) {
  const steps = useMemo(() => [
    { n: "01", t: "Register online", d: "Fill the form above · takes 90 seconds · no fee." },
    { n: "02", t: "Download admit card", d: "Instant PDF with your seat + QR — save it to your phone." },
    { n: "03", t: "Appear on exam day", d: campaign?.exam_date ? `Report to venue by 9:30 AM on ${formatDate(campaign.exam_date)}.` : "Report to venue 30 minutes before start." },
    { n: "04", t: "Result within 7 days", d: "Result card PDF · shows your scholarship slab & rank." },
    { n: "05", t: "Claim & enrol", d: "Walk into any Unacademy Kashmir centre with the result card — waiver applied instantly." },
  ], [campaign?.exam_date]);

  return (
    <section className="relative section-padding">
      <div className="container-custom max-w-5xl">
        <div className="text-center mb-14">
          <Eyebrow className="justify-center">How it works</Eyebrow>
          <Reveal>
            <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tight mt-4">
              From registration to <span className="font-medium italic text-accent">reward.</span>
            </h2>
          </Reveal>
        </div>
        <div className="relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="relative pl-16 md:pl-20 pb-10">
                <div className="absolute left-4 md:left-6 top-1 w-5 h-5 rounded-full bg-accent glow-accent grid place-items-center">
                  <span className="text-[9px] font-bold text-accent-foreground">{s.n}</span>
                </div>
                <h3 className="font-display text-2xl font-medium">{s.t}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-md">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdmitCardDownloadSection({ campaign }) {
  const [applicationNo, setApplicationNo] = useState("");
  const [phone, setPhone] = useState("");
  const [appData, setAppData] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleFetchAdmitCard = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.get(`/scholarship-applications/${applicationNo.trim()}`, { params: { phone: phone.trim() } });
      setAppData(data);
      toast.success("Application details retrieved.");
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Could not retrieve application. Check application number and phone.");
      setAppData(null);
    } finally {
      setBusy(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition";

  return (
    <section id="admit-card" className="relative section-padding scroll-mt-20">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-8">
          <Eyebrow className="justify-center">Admit Card</Eyebrow>
          <h2 className="font-display text-4xl lg:text-5xl font-light tracking-tight mt-4">
            Download your <span className="font-medium italic text-accent">Hall Ticket.</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Lost your admit card? Enter your details below to download it again anytime.
          </p>
        </div>

        <GlassPanel elevated className="p-7" as="form" onSubmit={handleFetchAdmitCard}>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className={inputCls} placeholder="Application number" required value={applicationNo} onChange={e => setApplicationNo(e.target.value)} data-testid="admit-appno"/>
            <input className={inputCls} placeholder="Registered phone" required value={phone} onChange={e => setPhone(e.target.value)} data-testid="admit-phone"/>
          </div>
          <div className="mt-5">
            <CTAPrimary type="submit" className="w-full justify-center" data-testid="admit-submit" disabled={busy}>
              {busy ? "Retrieving…" : "Find Admit Card"}
            </CTAPrimary>
          </div>
        </GlassPanel>

        {appData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-6">
            <GlassPanel elevated className="p-7 relative overflow-hidden" data-testid="admit-card-result">
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold flex items-center gap-2">
                  <IdentificationCard weight="duotone" size={16}/> Admit Card Ready
                </div>
                <h3 className="font-display text-2xl font-medium mt-2">{appData.name}</h3>
                <div className="mt-4 grid sm:grid-cols-3 gap-3">
                  <InfoBlock label="Application no" value={appData.application_no} mono/>
                  <InfoBlock label="Venue" value={appData.venue || "Unacademy Centre"}/>
                  <InfoBlock label="Class" value={appData.standard}/>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={`${API_BASE}/scholarship-applications/${appData.application_no}/admit-card?phone=${encodeURIComponent(appData.phone || phone)}`} target="_blank" rel="noreferrer" data-testid="download-fetched-admit">
                    <CTAPrimary><Download weight="bold" size={14}/> Download Admit Card PDF</CTAPrimary>
                  </a>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ResultCheckSection() {
  const [lookup, setLookup] = useState({ application_no: "", phone: "" });
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const { data } = await api.post("/scholarship-applications/lookup", lookup);
      setResult(data);
      if (data.result_published) {
        toast.success("Result loaded successfully.");
      } else {
        toast.info("Application found. Result has not been published yet.");
      }
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Could not find result. Check your credentials.");
    } finally {
      setBusy(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition";

  return (
    <section id="result" className="relative section-padding scroll-mt-20">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-8">
          <Eyebrow className="justify-center">Results</Eyebrow>
          <h2 className="font-display text-4xl lg:text-5xl font-light tracking-tight mt-4">
            Check your <span className="font-medium italic text-accent">WATH Score.</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your application number and phone number to view your scholarship percentage and rank.
          </p>
        </div>

        <GlassPanel elevated className="p-7" as="form" onSubmit={handleLookup} data-testid="result-lookup-form">
          <div className="grid sm:grid-cols-2 gap-3">
            <input className={inputCls} placeholder="Application number" required value={lookup.application_no} onChange={e => setLookup({...lookup, application_no: e.target.value})} data-testid="lookup-appno"/>
            <input className={inputCls} placeholder="Registered phone" required value={lookup.phone} onChange={e => setLookup({...lookup, phone: e.target.value})} data-testid="lookup-phone"/>
          </div>
          <div className="mt-5">
            <CTAPrimary type="submit" className="w-full justify-center" data-testid="lookup-submit" disabled={busy}>
              {busy ? "Searching…" : "View Result"}
            </CTAPrimary>
          </div>
        </GlassPanel>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-6">
            <GlassPanel elevated className="p-7 relative overflow-hidden" data-testid="result-card-container">
              {!result.result_published ? (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold">Result pending</div>
                  <h3 className="font-display text-2xl font-medium mt-2">{result.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">Your application is confirmed, but results have not been published yet. We will notify you via SMS/Email when results go live.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold">Result Published</div>
                      <h3 className="font-display text-3xl font-medium mt-1">{result.name}</h3>
                      <div className="text-xs font-mono text-muted-foreground mt-0.5">{result.application_no} · {result.standard}</div>
                    </div>
                    <div className="glass px-5 py-3 rounded-2xl text-center">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Scholarship Award</div>
                      <div className="font-display text-4xl font-medium text-accent mt-0.5">{result.result_scholarship_percentage}%</div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <InfoBlock label="Marks obtained" value={`${result.result_marks_obtained} / ${result.result_total_marks}`} mono/>
                    <InfoBlock label="Rank" value={result.result_rank || "Qualifying"} mono/>
                    <InfoBlock label="Percentile" value={result.result_percentile ? `${result.result_percentile}%` : "—"} mono/>
                  </div>

                  {result.result_remarks && (
                    <div className="p-4 rounded-xl glass border-l-2 border-accent text-sm text-muted-foreground italic">
                      "{result.result_remarks}"
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <a href={`${API_BASE}/scholarship-applications/${result.application_no}/result-card?phone=${encodeURIComponent(result.phone)}`} target="_blank" rel="noreferrer" data-testid="download-result-pdf">
                      <CTAPrimary><FileText weight="bold" size={14}/> Download Result Card PDF</CTAPrimary>
                    </a>
                    <a href={`${API_BASE}/scholarship-applications/${result.application_no}/admit-card?phone=${encodeURIComponent(result.phone)}`} target="_blank" rel="noreferrer" data-testid="download-admit-from-result">
                      <CTAGhost><Download weight="bold" size={14}/> Download Admit Card</CTAGhost>
                    </a>
                  </div>
                </div>
              )}
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="relative section-padding">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-14">
          <Eyebrow className="justify-center">FAQ</Eyebrow>
          <Reveal>
            <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tight mt-4">
              Everything you need to <span className="font-medium italic text-accent">know.</span>
            </h2>
          </Reveal>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 0.04}>
              <GlassPanel className="overflow-hidden transition">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-display text-lg font-medium"
                  data-testid={`faq-q-${i}`}
                >
                  <span>{faq.q}</span>
                  <span className={`text-accent transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden border-t border-border">
      <div className="absolute inset-0 bg-dot opacity-30 pointer-events-none" />
      <div className="container-custom max-w-4xl text-center relative">
        <Reveal>
          <Eyebrow className="justify-center">Take the leap</Eyebrow>
          <h2 className="font-display text-4xl lg:text-7xl font-light tracking-tight mt-4 leading-[1.05]">
            Your national rank starts <br/><span className="font-medium italic text-accent">right here in Kashmir.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto font-light">
            Register for WATH today. No registration fee, zero commitment — just pure evaluation and scholarships up to 100%.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#register"><CTAPrimary data-testid="final-cta-btn">Register for WATH Now</CTAPrimary></a>
            <Link to="/contact"><CTAGhost data-testid="final-contact-btn">Contact Centre</CTAGhost></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}