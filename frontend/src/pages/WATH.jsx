import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api, API_BASE, formatError } from "@/lib/api";
import GlassPanel from "@/components/GlassPanel";
import { CTAPrimary, CTAGhost, Eyebrow, Reveal } from "@/components/Cinematic";
import { AnimatedCounter } from "@/components/Metrics";
import {
  Trophy, Sparkle, GraduationCap, MedalMilitary, Clock, MapPin,
  CalendarBlank, Coins, ChartLineUp, ArrowRight, ArrowDown, FileText,
  Download, Check, WhatsappLogo, Question, Certificate
} from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1];

const CLASSES = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Dropper (JEE)", "Dropper (NEET)"];

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
  { q: "Where will the exam be held?", a: "Across 4 Northend centres in Kashmir — you choose the closest venue during registration." },
  { q: "When is the result declared?", a: "Result is declared within 7 days of the exam. You'll receive an SMS + can also check on this page using your application number." },
  { q: "How do I claim my scholarship?", a: "Result card carries your scholarship percentage. Walk into any Northend centre with the printed result card — admissions team will apply the waiver on your fee." },
];

export default function WATH() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/scholarships")
      .then(r => {
        const list = r.data || [];
        // Prefer campaign with "WATH" in title, else first active
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
      {/* Ambient depth */}
      <div className="ambient-orb ambient-orb--primary drift" style={{ width: 600, height: 600, top: "-100px", left: "-150px" }} />
      <div className="ambient-orb ambient-orb--accent drift" style={{ width: 460, height: 460, top: "20%", right: "-100px", animationDelay: "-6s" }} />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <HeroSection campaign={campaign} loading={loading} />
      <AboutSection />
      <FormatSection />
      <RewardsSection />
      <SlabsSection />
      <TimelineSection campaign={campaign} />
      <RegisterSection campaign={campaign} />
      <ResultCheckSection />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}

// ---------------- Sections ----------------

function HeroSection({ campaign, loading }) {
  const examDate = campaign?.exam_date;
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Concentric orbiting rings */}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="mb-4"
          >
            <div className="font-display text-[110px] lg:text-[180px] font-medium tracking-[-0.08em] leading-[0.85] bg-gradient-to-br from-accent via-amber-300 to-accent bg-clip-text text-transparent text-glow-accent">
              WATH
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="font-display text-2xl lg:text-4xl font-light tracking-[-0.02em] leading-tight"
          >
            <span className="text-accent italic font-medium">Wisdom</span> · <span className="text-accent italic font-medium">Aptitude</span> · <span className="text-accent italic font-medium">Talent</span> · <span className="text-accent italic font-medium">Hunt</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed font-light"
          >
            Kashmir's flagship talent search exam. Recognise your potential.
            Unlock up to <b className="text-accent">100% scholarship</b> and <b className="text-foreground">cash prizes</b> across NEET, JEE, Foundation and Boards programmes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a href="#register"><CTAPrimary data-testid="hero-register-btn">Register — it's free</CTAPrimary></a>
            <a href="#about"><CTAGhost iconRight data-testid="hero-learn-more-btn">Learn more</CTAGhost></a>
          </motion.div>
        </div>

        <div className="lg:col-span-5">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
            <GlassPanel elevated className="p-7 lg:p-8 relative overflow-hidden" data-testid="hero-exam-details">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.28em] text-accent font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent pulse-ring"/>Exam schedule
                </div>
                <div className="space-y-5">
                  <DetailRow Icon={CalendarBlank} label="Exam date" value={loading ? "…" : (examDate ? formatDate(examDate) : "TBA")} testid="detail-exam-date"/>
                  <DetailRow Icon={Clock} label="Duration" value="2 hours"/>
                  <DetailRow Icon={GraduationCap} label="Eligibility" value="Class 7–12 · NEET/JEE Droppers"/>
                  <DetailRow Icon={MapPin} label="Venues" value={`${campaign?.available_venues?.length || 4} centres · Kashmir`} testid="detail-venues"/>
                  <DetailRow Icon={Coins} label="Registration" value="₹0 — completely free"/>
                </div>
                <div className="mt-6 pt-6 border-t border-white/[0.08]">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold">Registration closes</div>
                  <div className="font-display text-lg font-medium text-accent mt-1" data-testid="detail-deadline">
                    {loading ? "…" : (campaign?.deadline ? formatDate(campaign.deadline) : "Check with your centre")}
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.4 }, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        Scroll to explore ↓
      </motion.div>
    </section>
  );
}

function DetailRow({ Icon, label, value, testid }) {
  return (
    <div className="flex items-center gap-4" data-testid={testid}>
      <div className="h-10 w-10 rounded-xl glass grid place-items-center flex-shrink-0">
        <Icon weight="duotone" size={18} className="text-accent"/>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold">{label}</div>
        <div className="text-sm font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section id="about" className="relative section">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
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
    <section className="relative section">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
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
    <section className="relative section">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
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
    <section className="relative section">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <Reveal>
          <GlassPanel elevated className="relative overflow-hidden p-8 lg:p-14">
            <div className="ambient-orb ambient-orb--accent" style={{ width: 500, height: 500, top: "-100px", right: "-100px" }} />
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
                      <div className="mt-3 pt-3 border-t border-white/[0.08] text-[10px] uppercase tracking-[0.18em] font-bold text-foreground/70">{s.tag}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground mt-8 max-w-2xl mx-auto">*Applicable on tuition component of NEET, JEE and Foundation classroom programmes. Board-only programmes have a separate slab. Final award subject to admissions verification.</p>
            </div>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}

function TimelineSection({ campaign }) {
  const steps = [
    { n: "01", t: "Register online", d: "Fill the form below · takes 90 seconds · no fee." },
    { n: "02", t: "Download admit card", d: "Instant PDF with your seat + QR — save it to your phone." },
    { n: "03", t: "Appear on exam day", d: campaign?.exam_date ? `Report to venue by 9:30 AM on ${formatDate(campaign.exam_date)}.` : "Report to venue 30 minutes before start." },
    { n: "04", t: "Result within 7 days", d: "SMS + result card PDF · shows your scholarship slab & rank." },
    { n: "05", t: "Claim &amp; enrol", d: "Walk into any Northend centre with the result card — waiver applied instantly." },
  ];
  return (
    <section className="relative section">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
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
                <h3 className="font-display text-2xl font-medium">{s.t.replace("&amp;", "&")}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-md" dangerouslySetInnerHTML={{__html: s.d}}/>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegisterSection({ campaign }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", class_or_course: "Class 10", school_name: "", venue: "",
  });
  const [submitted, setSubmitted] = useState(null);
  const [busy, setBusy] = useState(false);

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
      // Scroll to admit card
      setTimeout(() => document.getElementById("admit-card-block")?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Registration failed. Please try again.");
    } finally { setBusy(false); }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition";

  return (
    <section id="register" className="relative section scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <Eyebrow className="justify-center">Register</Eyebrow>
          <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tight mt-4">
            Your seat is <span className="font-medium italic text-accent">one form away.</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Free · 90 seconds · admit card PDF downloadable immediately after submission.</p>
        </div>

        {submitted ? (
          <div id="admit-card-block">
            <GlassPanel elevated className="p-8 lg:p-10 relative overflow-hidden" data-testid="wath-success">
              <div className="ambient-orb ambient-orb--accent" style={{ width: 420, height: 420, top: "-100px", right: "-100px", opacity: 0.5 }} />
              <div className="relative">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-accent font-bold">
                  <Check weight="bold" size={14}/> Registration successful
                </div>
                <h3 className="font-display text-4xl lg:text-5xl font-light tracking-tight mt-3">
                  Welcome to <span className="font-medium italic text-accent">WATH.</span>
                </h3>
                <div className="mt-6 grid sm:grid-cols-3 gap-3">
                  <InfoBlock label="Application no" value={submitted.application_no} testid="app-no" mono/>
                  <InfoBlock label="Venue" value={submitted.venue}/>
                  <InfoBlock label="Exam date" value={campaign?.exam_date ? formatDate(campaign.exam_date) : "TBA"}/>
                </div>
                <div className="mt-8 p-5 glass rounded-2xl border border-accent/25">
                  <div className="font-medium text-sm mb-3">Your next step</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Download your admit card and save it to your phone. Show it (printed or digital) with a valid photo ID at the venue on exam day.</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href={`${API_BASE}/scholarship-applications/${submitted.application_no}/admit-card`} target="_blank" rel="noreferrer" data-testid="download-admit-card">
                      <CTAPrimary><Download weight="bold" size={14}/> Download admit card</CTAPrimary>
                    </a>
                    {campaign?.whatsapp_community_url && (
                      <a href={campaign.whatsapp_community_url} target="_blank" rel="noreferrer" data-testid="join-wa">
                        <CTAGhost iconRight><WhatsappLogo weight="fill" size={16}/> Join WhatsApp community</CTAGhost>
                      </a>
                    )}
                  </div>
                </div>
                <button onClick={() => setSubmitted(null)} className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground" data-testid="register-another">Register another aspirant →</button>
              </div>
            </GlassPanel>
          </div>
        ) : (
          <GlassPanel elevated className="p-7 lg:p-8" as="form" onSubmit={submit} data-testid="wath-register-form">
            {!campaign && (
              <div className="mb-5 p-4 rounded-xl glass border border-amber-500/30">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">Registrations opening soon</div>
                <p className="text-sm text-muted-foreground mt-1">The next WATH sitting hasn't been announced yet. Drop your details and we'll notify you — or contact your nearest Northend centre.</p>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              <input className={inputCls} placeholder="Full name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} data-testid="wath-name"/>
              <input className={inputCls} type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} data-testid="wath-email"/>
              <input className={inputCls} placeholder="Phone" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} data-testid="wath-phone"/>
              <select className={inputCls} value={form.class_or_course} onChange={e => setForm({...form, class_or_course: e.target.value})} data-testid="wath-class">
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className={`${inputCls} sm:col-span-2`} placeholder="School / current institute" required value={form.school_name} onChange={e => setForm({...form, school_name: e.target.value})} data-testid="wath-school"/>
              {campaign?.available_venues?.length > 0 ? (
                <select className={`${inputCls} sm:col-span-2`} required value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} data-testid="wath-venue">
                  <option value="">— Preferred exam venue —</option>
                  {campaign.available_venues.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              ) : (
                <input className={`${inputCls} sm:col-span-2`} placeholder="Preferred centre (Srinagar / Anantnag / Sopore / Soura / Zakura / Parraypora)" required value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} data-testid="wath-venue-text"/>
              )}
            </div>
            <div className="mt-6">
              <CTAPrimary type="submit" className="w-full justify-center" data-testid="wath-submit" disabled={busy || !campaign}>
                {busy ? "Registering…" : campaign ? "Register & get admit card" : "Notify me when registrations open"}
              </CTAPrimary>
            </div>
            <p className="text-[11px] text-muted-foreground mt-4 text-center">
              By registering you agree to be contacted by Northend regarding WATH schedule &amp; results.
            </p>
          </GlassPanel>
        )}
      </div>
    </section>
  );
}

function InfoBlock({ label, value, testid, mono }) {
  return (
    <div className="glass rounded-xl p-4" data-testid={testid}>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold">{label}</div>
      <div className={`text-base font-medium mt-1 ${mono ? "font-mono text-accent" : ""}`}>{value}</div>
    </div>
  );
}

function ResultCheckSection() {
  const [applicationNo, setApplicationNo] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const check = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.get(`/scholarship-applications/${applicationNo}`, { params: { phone } });
      setResult(data);
      if (!data.result_published) toast.info("Result not yet declared — please check back after 7 days from exam.");
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Could not find your application. Double-check the application number and phone.");
    } finally { setBusy(false); }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition";

  return (
    <section id="result" className="relative section">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <Eyebrow className="justify-center">Result check</Eyebrow>
          <h2 className="font-display text-4xl lg:text-5xl font-light tracking-tight mt-4">
            Already appeared? <span className="font-medium italic text-accent">Check your rank.</span>
          </h2>
        </div>
        <GlassPanel elevated className="p-7" as="form" onSubmit={check}>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className={inputCls} placeholder="Application number" required value={applicationNo} onChange={e => setApplicationNo(e.target.value)} data-testid="res-appno"/>
            <input className={inputCls} placeholder="Registered phone" required value={phone} onChange={e => setPhone(e.target.value)} data-testid="res-phone"/>
          </div>
          <div className="mt-5">
            <CTAPrimary type="submit" className="w-full justify-center" data-testid="res-submit" disabled={busy}>{busy ? "Checking…" : "Check my result"}</CTAPrimary>
          </div>
        </GlassPanel>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-6">
            <GlassPanel elevated className="p-7 relative overflow-hidden" data-testid="res-block">
              <div className="ambient-orb ambient-orb--accent" style={{ width: 300, height: 300, top: "-60px", right: "-60px", opacity: 0.5 }} />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold flex items-center gap-2">
                  <Certificate weight="duotone" size={14}/> {result.result_published ? "Result declared" : "Application on file"}
                </div>
                <h3 className="font-display text-3xl font-medium mt-3">{result.name}</h3>
                <div className="text-sm text-muted-foreground font-mono">{result.application_no}</div>
                {result.result_published ? (
                  <div className="mt-6 grid sm:grid-cols-3 gap-3">
                    <InfoBlock label="Marks" value={result.marks ?? "—"}/>
                    <InfoBlock label="Scholarship" value={`${result.result_scholarship_percentage}%`}/>
                    <InfoBlock label="Rank / band" value={result.rank_band ?? "See result card"}/>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-4">Your result is being processed — you'll receive an SMS as soon as it's declared. Check back after 7 days from your exam date.</p>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  {result.result_published && (
                    <a href={`${API_BASE}/scholarship-applications/${result.application_no}/result-card?phone=${encodeURIComponent(phone)}`} target="_blank" rel="noreferrer" data-testid="dl-result-card">
                      <CTAPrimary><FileText weight="bold" size={14}/> Download result card</CTAPrimary>
                    </a>
                  )}
                  <a href={`${API_BASE}/scholarship-applications/${result.application_no}/admit-card`} target="_blank" rel="noreferrer" data-testid="dl-admit">
                    <CTAGhost><Download weight="bold" size={14}/> Admit card</CTAGhost>
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

function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="relative section">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <Eyebrow className="justify-center">Questions</Eyebrow>
          <h2 className="font-display text-4xl lg:text-5xl font-light tracking-tight mt-4">
            Every doubt, <span className="font-medium italic text-accent">answered.</span>
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <GlassPanel key={i} className={`p-5 lg:p-6 cursor-pointer transition-all ${open === i ? "border-accent/30" : ""}`}
              onClick={() => setOpen(open === i ? -1 : i)} data-testid={`faq-${i}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Question weight="duotone" size={16} className="text-accent"/>
                    <div className="font-display font-medium text-lg">{f.q}</div>
                  </div>
                  <AnimatePresence>
                    {open === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-muted-foreground mt-3 leading-relaxed"
                      >{f.a}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <ArrowDown weight="bold" size={18} className={`transition-transform flex-shrink-0 text-accent ${open === i ? "rotate-180" : ""}`}/>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative section text-center">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <Reveal>
          <h2 className="font-display text-5xl lg:text-7xl font-light tracking-tight leading-[0.95]">
            Your AIR begins with <span className="font-medium italic text-accent">WATH.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">Kashmir's most ambitious minds sit here. This year, be one of them.</p>
          <div className="mt-10 flex justify-center gap-3 flex-wrap">
            <a href="#register"><CTAPrimary data-testid="final-register-btn">Register for WATH</CTAPrimary></a>
            <Link to="/contact"><CTAGhost iconRight>Talk to a counsellor</CTAGhost></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function formatDate(iso) {
  if (!iso) return "TBA";
  const d = parseFlexibleDate(iso);
  if (!d || isNaN(d.getTime())) return String(iso);
  try {
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  } catch { return String(iso); }
}

function parseFlexibleDate(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  const s = String(v).trim();
  // ISO / YYYY-MM-DD -> native parse works
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return new Date(s);
  // DD-MM-YYYY or DD/MM/YYYY
  const m = s.match(/^(\d{1,2})[\-\/](\d{1,2})[\-\/](\d{4})$/);
  if (m) {
    const [, dd, mm, yyyy] = m;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  }
  // Fallback
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
