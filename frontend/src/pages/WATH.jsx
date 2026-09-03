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
  { 
    q: "Who is eligible to appear for the WATH exam?", 
    a: "The Wisdom Aptitude Talent Hunt (WATH) is open to a broad spectrum of ambitious students across the region. This includes any regular student currently studying in Class 7, Class 8, Class 9, Class 10, Class 11, or Class 12 anywhere within Jammu and Kashmir, as well as dedicated students who are currently enrolled as NEET or JEE droppers aiming for top medical and engineering ranks." 
  },
  { 
    q: "Is there any registration fee or hidden charge?", 
    a: "No, WATH is entirely free of cost from start to finish. There are zero registration fees, zero exam fees, and no hidden charges whatsoever. Registering, downloading your admit card, and checking your detailed result card are all 100% free." 
  },
  { 
    q: "What is the exact exam format, duration, and syllabus structure?", 
    a: "The assessment is a comprehensive 2-hour objective-type paper designed to test your core analytical and academic capabilities. It features multiple-choice questions spanning Mental Ability, Core Sciences, Mathematics, and General Aptitude. Crucially, the difficulty level and question sets are customized and calibrated to match your specific grade level or target competitive exam track (Foundation, JEE, or NEET)." 
  },
  { 
    q: "Where will the exam be conducted, and how do I select my venue?", 
    a: "The test is conducted across designated Unacademy Kashmir offline testing centers. During the online registration process, you will be presented with a dropdown list of available testing locations so you can easily choose the closest and most convenient venue for your exam day." 
  },
  { 
    q: "When and how will the exam results be declared?", 
    a: "Results are typically evaluated and declared within 7 days of the exam date. Once published, you will receive an automated SMS notification on your registered phone number. Alternatively, you can instantly look up your performance, marks, and rank right on this webpage by entering your unique application number." 
  },
  { 
    q: "How do I redeem and claim my scholarship or fee waiver?", 
    a: "Your final result card will clearly indicate your earned scholarship percentage based on your performance slabs. To redeem your waiver, simply walk into any Unacademy Kashmir offline center carrying a printed copy of your official result card, and our admissions counselors will apply the discount directly to your tuition for classroom programs." 
  },
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
  const [pageState, setPageState] = useState(null);   // {mode, exam?, carnival?, disabled_message?}
  const [loading, setLoading] = useState(true);

  const load = (silent = false) => {
    if (!silent) setLoading(true);
    api.get("/wath/page")
      .then(r => setPageState(r.data || null))
      .catch(() => { if (!silent) setPageState(null); })
      .finally(() => { if (!silent) setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const mode = pageState?.mode || "exam";
  const campaign = mode === "exam" ? pageState?.exam : null;
  const carnival = mode === "carnival" ? pageState?.carnival : null;

  if (loading || !pageState) {
    return (
      <div className="min-h-screen grid place-items-center bg-background" data-testid="wath-loading">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-accent/20"/>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin"/>
            <div className="absolute inset-3 rounded-full bg-accent/10 blur-md animate-pulse"/>
          </div>
          <div className="mt-6 text-[10px] uppercase tracking-[0.32em] text-accent font-bold">Loading</div>
          <div className="mt-1 text-xs text-muted-foreground">Preparing your WATH experience…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" data-testid="wath-page" data-mode={mode}>
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {mode === "disabled" ? (
        <DisabledMode message={pageState?.disabled_message}/>
      ) : (
        <>
          <HeroSection
            campaign={campaign}
            carnival={carnival}
            mode={mode}
            loading={loading}
            onRegistered={() => load(true)}
          />
          <AboutSection />
          <FormatSection />
          <RewardsSection />
          <SlabsSection />
          <TimelineSection campaign={campaign} carnival={carnival} mode={mode}/>
          <AdmitCardDownloadSection campaign={campaign} carnival={carnival}/>
          <ResultCheckSection />
          <FAQSection />
          <FinalCTA />
        </>
      )}
    </div>
  );
}

function DisabledMode({ message }) {
  return (
    <section className="min-h-[70vh] grid place-items-center px-6 text-center">
      <div className="max-w-lg">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[10px] uppercase tracking-[0.22em] font-bold text-accent mb-6">
          <Clock size={12}/> Registrations paused
        </div>
        <h1 className="font-display text-4xl lg:text-6xl font-light tracking-[-0.02em] leading-[0.95]">
          WATH is <span className="italic text-accent">taking a breath</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {message || "The next scholarship examination window is being scheduled. Follow us on WhatsApp to be the first to know when registrations open."}
        </p>
      </div>
    </section>
  );
}

function CarnivalSlotPicker({ carnival, chosenDate, chosenSlot, onPick }) {
  const dates = carnival?.exam_dates || [];
  const [activeDate, setActiveDate] = useState(chosenDate || dates[0]?.date);
  useEffect(() => {
    if (!chosenDate && dates[0]?.date) setActiveDate(dates[0].date);
  }, [dates, chosenDate]);
  const active = dates.find(d => d.date === activeDate);

  return (
    <div className="p-3 rounded-2xl border border-accent/25 bg-accent/[0.03] space-y-3" data-testid="wath-slot-picker">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-accent font-bold">
        <CalendarBlank size={12}/> Pick your exam slot
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {dates.map(d => {
          const isActive = d.date === activeDate;
          const remaining = (d.slots || []).reduce((sum, s) => sum + (s.remaining || 0), 0);
          const fullyBooked = remaining === 0;
          const fillingFast = !fullyBooked && remaining <= 10;
          return (
            <button
              type="button"
              key={d.date}
              onClick={() => setActiveDate(d.date)}
              disabled={fullyBooked}
              className={`shrink-0 px-3 py-2 rounded-xl text-[11px] font-medium transition ${isActive ? "bg-accent text-accent-foreground" : fullyBooked ? "bg-white/[0.02] text-muted-foreground/40 line-through" : "glass text-foreground/80 hover:text-foreground"}`}
              data-testid={`slot-date-${d.date}`}
            >
              <div>{new Date(d.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}</div>
              <div className={`text-[9px] mt-0.5 flex items-center justify-center gap-1 ${fillingFast && !isActive ? "text-amber-500 font-semibold" : "opacity-70"}`}>
                {fullyBooked ? "Full" : fillingFast ? (<><span className="inline-block w-1 h-1 rounded-full bg-amber-500 animate-pulse"/>{remaining} left</>) : `${remaining} left`}
              </div>
            </button>
          );
        })}
      </div>
      {active && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {(active.slots || []).map(s => {
            const disabled = !s.available;
            const selected = chosenDate === active.date && chosenSlot === s.time;
            const low = !disabled && s.remaining > 0 && s.remaining <= 5;
            return (
              <button
                type="button"
                key={s.time}
                disabled={disabled}
                onClick={() => onPick(active.date, s.time)}
                className={`px-2.5 py-2 rounded-lg text-[11px] font-medium transition text-left ${selected ? "bg-accent text-accent-foreground" : disabled ? "bg-white/[0.02] text-muted-foreground/40 line-through cursor-not-allowed" : low ? "glass border border-amber-500/40 hover:border-amber-500/60" : "glass hover:border-accent/40"}`}
                data-testid={`slot-time-${active.date}-${s.time.replace(/[^0-9A-Za-z]/g,'')}`}
              >
                <div className="flex items-center gap-1"><Clock size={10}/>{s.time}</div>
                <div className={`text-[9px] mt-0.5 flex items-center gap-1 ${low && !selected ? "text-amber-500 font-semibold" : "opacity-70"}`}>
                  {disabled ? "Full" : low ? (<><span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"/>Only {s.remaining} left!</>) : `${s.remaining}/${s.capacity} left`}
                </div>
              </button>
            );
          })}
        </div>
      )}
      {chosenDate && chosenSlot && (
        <div className="text-[10px] text-accent flex items-center gap-1.5 pt-1 border-t border-white/5">
          <Check size={12} weight="bold"/> Selected: {new Date(chosenDate).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })} · {chosenSlot}
        </div>
      )}
    </div>
  );
}

// ---------------- Sections ----------------

function HeroSection({ campaign, carnival, mode, loading, onRegistered }) {
  const isCarnival = mode === "carnival" && !!carnival;
  const examDate = isCarnival
    ? carnival.exam_dates?.[0]?.date
    : campaign?.exam_date;
  const [form, setForm] = useState({
    name: "", email: "", phone: "", class_or_course: "", school_name: "", venue: "",
    chosen_date: "", chosen_slot_time: "",
  });
  const [submitted, setSubmitted] = useState(null);
  const [busy, setBusy] = useState(false);

  const venueOptions = useMemo(() => {
    if (isCarnival) return carnival.available_venues || ["Northend 90 FT", "Northend Anantnag", "Northend Zakura", "Northend Parraypora"];
    return campaign?.available_venues || [];
  }, [campaign, carnival, isCarnival]);

  useEffect(() => {
    if (venueOptions.length && !form.venue) setForm(f => ({ ...f, venue: venueOptions[0] }));
  }, [venueOptions, form.venue]);

  const submit = async (e) => {
    e.preventDefault();
    if (isCarnival) {
      if (!form.chosen_date || !form.chosen_slot_time) {
        toast.error("Please pick your exam date and time slot");
        return;
      }
    } else if (!campaign) {
      toast.error("Registration is not open yet — please check back soon.");
      return;
    }
    setBusy(true);
    try {
      const [, d2] = form.class_or_course.includes("(") ? form.class_or_course.split("(") : [form.class_or_course, ""];
      const targetExam = d2.includes("NEET") ? "NEET" : d2.includes("JEE") ? "JEE" : form.class_or_course.includes("11") || form.class_or_course.includes("12") ? "NEET/JEE" : "Foundation";

      const basePayload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        school: form.school_name,
        standard: form.class_or_course,
        target_exam: targetExam,
        city: (form.venue || "Srinagar").replace(/^Northend\s+/i, "") || "Srinagar",
        venue: form.venue || undefined,
      };
      const payload = isCarnival
        ? { ...basePayload, carnival_id: carnival.id, chosen_date: form.chosen_date, chosen_slot_time: form.chosen_slot_time }
        : { ...basePayload, scholarship_id: campaign.id };

      const { data } = await api.post("/scholarship-applications", payload);
      setSubmitted(data);
      toast.success("Registered — download your admit card below.");
      onRegistered?.();
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
              {isCarnival ? (
                <>
                  <span className="text-accent italic font-medium">{carnival.title}</span>
                  <span className="block text-lg lg:text-2xl text-foreground/70 mt-2 font-light">Pick your date · pick your slot · win a scholarship</span>
                </>
              ) : (
                <><span className="text-accent italic font-medium">Wisdom</span> · <span className="text-accent italic font-medium">Aptitude</span> · <span className="text-accent italic font-medium">Talent</span> · <span className="text-accent italic font-medium">Hunt</span></>
              )}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }} className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed font-light">
              {isCarnival
                ? (carnival.description || `A week-long WATH scholarship examination window. Choose the exam date and time slot that works for you across ${(carnival.exam_dates || []).length} available dates.`)
                : (<>Kashmir's flagship talent search exam. Recognise your potential. Unlock up to <b className="text-accent">100% scholarship</b> and <b className="text-foreground">cash prizes</b> across NEET, JEE, Foundation programmes.</>)}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.5 }} className="mt-10 flex flex-wrap gap-3">
              <a href="#register">
                <CTAPrimary data-testid="hero-register-btn">
                  {isCarnival ? "Register for Carnival — it's free" : "Register — it's free"}
                </CTAPrimary>
              </a>
              <a href="#admit-card"><CTAGhost iconRight data-testid="hero-admit-btn">Get Admit Card</CTAGhost></a>
            </motion.div>
          </div>

          <div className="lg:col-span-5" id="register">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
              <GlassPanel elevated className="p-6 lg:p-7 relative overflow-hidden" data-testid="hero-exam-details">
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/10 blur-3xl" />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-accent font-bold mb-5 flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent pulse-ring"/>{isCarnival ? "Register for Carnival" : "Register for WATH"}</span>
                    <span className="text-muted-foreground font-normal lowercase">free entry</span>
                  </div>

                  {submitted ? (
                    <div id="admit-card-block" className="py-2">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-accent font-bold">
                        <Check weight="bold" size={14}/> Registration successful
                      </div>
                      <h3 className="font-display text-2xl font-light tracking-tight mt-2">
                        Welcome to <span className="font-medium italic text-accent">{isCarnival ? (carnival.title || "WATH Carnival") : "WATH"}.</span>
                      </h3>
                      
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <InfoBlock label="Application no" value={submitted.application_no} testid="app-no" mono/>
                        <InfoBlock label="Venue" value={submitted.venue}/>
                        {(submitted.chosen_date || form.chosen_date) && <InfoBlock label="Exam date" value={submitted.chosen_date || form.chosen_date}/>}
                        {(submitted.chosen_slot_time || form.chosen_slot_time) && <InfoBlock label="Slot" value={submitted.chosen_slot_time || form.chosen_slot_time}/>}
                      </div>

                      <div className="mt-5 p-5 glass rounded-2xl border border-accent/25 space-y-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">Download your admit card and save it to your phone for exam day entry.</p>
                        <div className="flex flex-col gap-3">
                          <a href={`${API_BASE}/scholarship-applications/${submitted.application_no}/admit-card?phone=${encodeURIComponent(submitted.phone || form.phone)}`} target="_blank" rel="noreferrer" data-testid="download-admit-card">
                            <button type="button" className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#1380d0] to-accent text-accent-foreground font-medium text-xs uppercase tracking-[0.15em] shadow-lg shadow-accent/20 hover:opacity-95 transition">
                              <Download weight="bold" size={16}/> Download Admit Card <ArrowRight weight="bold" size={14}/>
                            </button>
                          </a>
                          
                          {(campaign?.whatsapp_community_url || carnival?.whatsapp_community_url) && (
                            <a href={campaign?.whatsapp_community_url || carnival?.whatsapp_community_url} target="_blank" rel="noreferrer" data-testid="join-wa">
                              <button type="button" className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl glass border border-accent/30 text-foreground font-medium text-xs uppercase tracking-[0.15em] hover:bg-accent/10 transition">
                                <WhatsappLogo weight="fill" size={16} className="text-accent"/> Join WhatsApp <ArrowRight weight="bold" size={14}/>
                              </button>
                            </a>
                          )}
                        </div>
                      </div>

                      <button onClick={() => setSubmitted(null)} className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground flex items-center gap-1.5" data-testid="register-another">
                        Register another aspirant <ArrowRight weight="bold" size={12} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={submit} data-testid="wath-register-form" className="space-y-3">
                      {!campaign && !isCarnival && (
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

                      {isCarnival && (
                        <CarnivalSlotPicker
                          carnival={carnival}
                          chosenDate={form.chosen_date}
                          chosenSlot={form.chosen_slot_time}
                          onPick={(date, time) => setForm(f => ({ ...f, chosen_date: date, chosen_slot_time: time }))}
                        />
                      )}

                      {venueOptions.length > 0 ? (
                        <div className="relative">
                          <select className={`${inputCls} appearance-none pr-8`} required value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} data-testid="wath-venue">
                            <option value="" className="bg-background">— Select exam venue —</option>
                            {venueOptions.map(v => <option key={v} value={v} className="bg-background">{v}</option>)}
                          </select>
                          <CaretDown weight="bold" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                      ) : (
                        <input className={inputCls} placeholder="Preferred venue (e.g. Srinagar)" required value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} data-testid="wath-venue-text"/>
                      )}

                      <div className="pt-1">
                        <CTAPrimary type="submit" className="w-full justify-center text-xs py-2.5" data-testid="wath-submit" disabled={busy || (!campaign && !isCarnival)}>
                          {busy ? "Registering…" : (campaign || isCarnival) ? "Register & get admit card" : "Notify me"}
                        </CTAPrimary>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{isCarnival ? `${carnival.exam_dates?.length || 0} exam dates available` : `Exam: ${loading ? "…" : (examDate ? formatDate(examDate) : "TBA")}`}</span>
                        <span>Fee: ₹0 (Free)</span>
                      </div>
                    </form>
                  )}
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
                  {appData.chosen_date && <InfoBlock label="Exam date" value={appData.chosen_date}/>}
                  {appData.chosen_slot_time && <InfoBlock label="Slot" value={appData.chosen_slot_time}/>}
                  {appData.campaign_kind && <InfoBlock label="Programme" value={appData.campaign_kind === "carnival" ? "WATH Carnival" : appData.campaign_kind === "wath" ? "WATH" : "Scholarship"}/>}
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