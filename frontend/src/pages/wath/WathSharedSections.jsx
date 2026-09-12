import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
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
  CalendarBlank, Coins, ChartLineUp, ArrowRight, ArrowDown, ArrowUp, FileText,
  Download, Check, WhatsappLogo, Question, Certificate, IdentificationCard, X, CaretDown
} from "@phosphor-icons/react";


const EASE = [0.16, 1, 0.3, 1];
const SLABS = [
  { pct: "90%", marks: "≥ 90%", tag: "Star Scholar" },
  { pct: "80%",  marks: "≥ 80%", tag: "Merit Scholar" },
  { pct: "70%",  marks: "≥ 70%", tag: "Excellence" },
  { pct: "60%",  marks: "≥ 60%", tag: "Encouragement" },
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

export { AboutSection }
export { FormatSection }
export { ItemCheck }
export { RewardsSection }
export { SlabsSection }
export { TimelineSection }
export { AdmitCardDownloadSection }
export { ResultCheckSection }
export { FAQSection }
export { FinalCTA }

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
              <p className="text-center text-xs text-muted-foreground mt-8 max-w-2xl mx-auto">*Your scholarship percentage directly matches your exam score percentage. Applicable on tuition component of NEET, JEE and Foundation classroom programmes. Final award subject to admissions verification.</p>
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

  const inputCls = "w-full min-w-0 px-5 py-3.5 rounded-full bg-white border border-gray-200 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#08BD80] focus:ring-1 focus:ring-[#08BD80] transition shadow-sm";

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
            <CTAPrimary type="submit" className="w-full justify-center rounded-full py-3.5 text-xs" data-testid="admit-submit" disabled={busy}>
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
                    <CTAPrimary className="rounded-full py-3 px-6"><Download weight="bold" size={14}/> Download Admit Card PDF</CTAPrimary>
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

  const inputCls = "w-full min-w-0 px-5 py-3.5 rounded-full bg-white border border-gray-200 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#08BD80] focus:ring-1 focus:ring-[#08BD80] transition shadow-sm";

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
            <CTAPrimary type="submit" className="w-full justify-center rounded-full py-3.5 text-xs" data-testid="lookup-submit" disabled={busy}>
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
                      <CTAPrimary className="rounded-full py-3 px-6"><FileText weight="bold" size={14}/> Download Result Card PDF</CTAPrimary>
                    </a>
                    <a href={`${API_BASE}/scholarship-applications/${result.application_no}/admit-card?phone=${encodeURIComponent(result.phone)}`} target="_blank" rel="noreferrer" data-testid="download-admit-from-result">
                      <CTAGhost className="rounded-full py-3 px-6"><Download weight="bold" size={14}/> Download Admit Card</CTAGhost>
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
