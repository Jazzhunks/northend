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

import WathSlotPicker from "./WathSlotPicker";

const EASE = [0.16, 1, 0.3, 1];
const DISTRICTS = [
  "Anantnag", "Bandipora", "Baramulla", "Budgam", "Ganderbal", "Kulgam", "Kupwara", "Pulwama", "Shopian", "Srinagar",
  "Doda", "Jammu", "Kathua", "Kishtwar", "Poonch", "Rajouri", "Ramban", "Reasi", "Samba", "Udhampur",
  "Kargil", "Leh", "Other"
];
const CLASSES = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11 (NEET)", "Class 11 (IIT-JEE)", "Class 12 (NEET)", "Class 12 (IIT-JEE)", "Dropper (NEET)", "Dropper (IIT-JEE)"];

const SLABS = [
  { pct: "90%", marks: "≥ 90%", tag: "Star Scholar" },
  { pct: "80%",  marks: "≥ 80%", tag: "Merit Scholar" },
  { pct: "70%",  marks: "≥ 70%", tag: "Excellence" },
  { pct: "60%",  marks: "≥ 60%", tag: "Encouragement" },
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
function CustomSelect({ value, onChange, options, placeholder, testid }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ left: 0, width: 0, top: 0, bottom: 0, placement: "bottom" });
  
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }
    
    document.body.style.overflow = "hidden";
    
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 240; 
        
        const placement = (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) ? "top" : "bottom";
        
        setCoords({
          left: rect.left,
          width: rect.width,
          top: placement === "bottom" ? rect.bottom + 8 : undefined,
          bottom: placement === "top" ? window.innerHeight - rect.top + 8 : undefined,
          placement,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative min-w-0" data-testid={testid}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-w-0 px-5 py-3.5 rounded-full bg-white border text-[13px] text-left transition flex items-center justify-between shadow-sm focus:outline-none ${
          isOpen ? 'border-[#08BD80] ring-1 ring-[#08BD80]' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <CaretDown weight="bold" size={14} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: coords.placement === "top" ? 10 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: coords.placement === "top" ? 10 : -10 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "fixed",
                left: `${coords.left}px`,
                width: `${coords.width}px`,
                ...(coords.placement === "bottom" ? { top: `${coords.top}px` } : { bottom: `${coords.bottom}px` })
              }}
              onWheel={(e) => {
                e.stopPropagation();
                if (dropdownRef.current) {
                  dropdownRef.current.scrollTop += e.deltaY;
                }
              }}
              className="z-[9999] bg-white border border-gray-200 shadow-xl rounded-[20px] py-2 max-h-[220px] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-[13px] transition ${
                    value === opt ? 'bg-[#08BD80]/10 text-[#08BD80] font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
function CustomDatePicker({ value, onChange, placeholder, testid }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ left: 0, width: 0, top: 0, bottom: 0, placement: "bottom" });
  const [viewMode, setViewMode] = useState("days");
  
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const initialDate = value ? new Date(value) : new Date(2010, 0, 1);
  const [viewDate, setViewDate] = useState(initialDate);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }

    document.body.style.overflow = "hidden";
    setViewDate(value ? new Date(value) : new Date(2010, 0, 1));
    setViewMode("days");

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 380;
        
        const placement = (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) ? "top" : "bottom";
        
        const isMobile = window.innerWidth < 400;
        
        setCoords({
          left: isMobile ? (window.innerWidth - 300) / 2 : rect.left,
          width: 300, 
          top: placement === "bottom" ? rect.bottom + 8 : undefined,
          bottom: placement === "top" ? window.innerHeight - rect.top + 8 : undefined,
          placement,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, value]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectDay = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  const handleSelectMonth = (monthIndex) => {
    setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1));
    setViewMode("days");
  };

  const handleSelectYear = (year) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setViewMode("months");
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const handleToday = () => {
    handleSelectDay(new Date());
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, current: false, date: new Date(year, month - 1, daysInPrevMonth - i) });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true, date: new Date(year, month, i) });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false, date: new Date(year, month + 1, i) });
  }

  // FIXED: Calculate startYear and generate the years array
  const startYear = Math.floor(year / 20) * 20;
  const years = [];
  for (let i = 0; i < 20; i++) {
    years.push(startYear + i);
  }

  const displayValue = value ? value.split("-").reverse().join("/") : "";

  return (
    <div className="relative min-w-0 w-full" data-testid={testid}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-w-0 px-5 py-3.5 rounded-full bg-white border text-[13px] text-left transition flex items-center justify-between shadow-sm focus:outline-none ${
          isOpen ? 'border-[#08BD80] ring-1 ring-[#08BD80]' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={displayValue ? "text-gray-800" : "text-gray-400"}>
          {displayValue || placeholder}
        </span>
        <CalendarBlank size={16} className="text-gray-500" />
      </button>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: coords.placement === "top" ? 10 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: coords.placement === "top" ? 10 : -10 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "fixed",
                left: `${coords.left}px`,
                width: `${coords.width}px`,
                ...(coords.placement === "bottom" ? { top: `${coords.top}px` } : { bottom: `${coords.bottom}px` })
              }}
              onWheel={(e) => {
                e.stopPropagation();
                if (dropdownRef.current) {
                  dropdownRef.current.scrollTop += e.deltaY;
                }
              }}
              className="z-[9999] bg-white border border-gray-200 shadow-2xl rounded-[20px] p-5 overscroll-contain touch-pan-y [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              
              {/* DAYS VIEW */}
              {viewMode === "days" && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={() => setViewMode("years")} className="font-bold text-gray-900 text-[15px] hover:bg-gray-100 px-2.5 py-1 rounded-lg transition flex items-center gap-1">
                      {monthNames[month]} {year} <CaretDown size={14}/>
                    </button>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-700">
                        <ArrowUp size={16} />
                      </button>
                      <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-700">
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <div key={i} className="text-center text-xs font-medium text-gray-900">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1">
                    {days.map((d, i) => {
                      const isSelected = value && new Date(value).getTime() === d.date.getTime();
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectDay(d.date)}
                          className={`h-9 w-full flex items-center justify-center text-[13px] rounded-lg transition ${
                            isSelected 
                              ? 'bg-[#1a73e8] text-white font-medium shadow-sm' 
                              : d.current 
                                ? 'text-gray-900 hover:bg-gray-100' 
                                : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {d.day}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* MONTHS VIEW */}
              {viewMode === "months" && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={() => setViewMode("years")} className="font-bold text-gray-900 text-[15px] hover:bg-gray-100 px-2.5 py-1 rounded-lg transition flex items-center gap-1">
                      {year} <CaretDown size={14}/>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {monthNamesShort.map((m, i) => (
                      <button key={m} type="button" onClick={() => handleSelectMonth(i)} className="py-3 rounded-lg text-[13px] font-medium text-gray-900 hover:bg-gray-100 transition">
                        {m}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* YEARS VIEW */}
              {viewMode === "years" && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-gray-900 text-[15px] px-2.5 py-1">
                      {startYear} - {startYear + 19}
                    </div>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => setViewDate(new Date(year - 20, month, 1))} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-700">
                        <ArrowUp size={16} />
                      </button>
                      <button type="button" onClick={() => setViewDate(new Date(year + 20, month, 1))} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-700">
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {years.map(y => (
                      <button key={y} type="button" onClick={() => handleSelectYear(y)} className={`py-3 rounded-lg text-[13px] font-medium transition ${year === y ? 'bg-[#1a73e8]/10 text-[#1a73e8]' : 'text-gray-900 hover:bg-gray-100'}`}>
                        {y}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={handleClear} className="text-[#1a73e8] text-[13px] font-medium hover:underline px-2">Clear</button>
                <button type="button" onClick={handleToday} className="text-[#1a73e8] text-[13px] font-medium hover:underline px-2">Today</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

export default function WathRegistrationForm({ campaign, carnival, mode, loading, onRegistered }) {
  const isCarnival = mode === "carnival" && !!carnival;
  const examDate = isCarnival
    ? carnival.exam_dates?.[0]?.date
    : campaign?.exam_date;
  const [form, setForm] = useState({
    name: "", email: "", phone: "", class_or_course: "", school_name: "", venue: "",
    father_name: "", gender: "", dob: "", address: "", district: "",
    chosen_date: "", chosen_slot_time: "",
  });
  const [submitted, setSubmitted] = useState(null);
  const [busy, setBusy] = useState(false);

  const venueOptions = useMemo(() => {
    if (isCarnival) return carnival.available_venues || ["90 FT", "Anantnag", "Zakura", "Parraypora", "Sopore"];
    return campaign?.available_venues || [];
  }, [campaign, carnival, isCarnival]);

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
        father_name: form.father_name || undefined,
        gender: form.gender || undefined,
        dob: form.dob || undefined,
        city: form.venue || undefined,
        venue: form.venue || undefined,
        address: form.address || undefined,
        district: form.district || undefined,
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

  const inputCls = "w-full min-w-0 px-5 py-3.5 rounded-full bg-white border border-gray-200 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#08BD80] focus:ring-1 focus:ring-[#08BD80] transition shadow-sm";

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

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 w-full grid lg:grid-cols-12 gap-10 items-center pt-28 pb-16 md:pt-32 md:pb-24">
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
              <GlassPanel elevated className="p-5 sm:p-6 lg:p-7 relative z-10" data-testid="hero-exam-details">
                <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/10 blur-3xl" />
                </div>
                
                <div className="relative z-20">
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
                    <form onSubmit={submit} data-testid="wath-register-form" className="space-y-4">
                      {!campaign && !isCarnival && (
                        <div className="p-3 rounded-xl glass border border-amber-500/30 text-xs">
                          <span className="font-bold uppercase text-amber-400">Opening soon</span> — drop details to get notified.
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input className={inputCls} placeholder="Full name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} data-testid="wath-name"/>
                        <input className={inputCls} type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} data-testid="wath-email"/>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input className={inputCls} placeholder="Phone number" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} data-testid="wath-phone"/>
                        <CustomSelect 
                          value={form.class_or_course} 
                          onChange={val => setForm({...form, class_or_course: val})} 
                          options={CLASSES} 
                          placeholder="Current class" 
                          testid="wath-class" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input className={inputCls} placeholder="Father's / Guardian's name" required value={form.father_name} onChange={e => setForm({...form, father_name: e.target.value})} data-testid="wath-father"/>
                        <CustomSelect 
                          value={form.gender} 
                          onChange={val => setForm({...form, gender: val})} 
                          options={["Male", "Female", "Other"]} 
                          placeholder="Gender" 
                          testid="wath-gender" 
                        />
                      </div>
                      
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <CustomDatePicker 
                          value={form.dob} 
                          onChange={val => setForm({...form, dob: val})} 
                          placeholder="dd / mm / yyyy" 
                          testid="wath-dob" 
                        />
                        <input className={inputCls} placeholder="School / current institute" required value={form.school_name} onChange={e => setForm({...form, school_name: e.target.value})} data-testid="wath-school"/>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <CustomSelect
                        value={form.district}
                        onChange={val => setForm({...form, district: val})}
                        options={DISTRICTS}
                        placeholder="Select district"
                        testid="wath-district"
                                  />
                      <input className={inputCls} placeholder="Full address" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} data-testid="wath-address"/>
                    </div>

                      {isCarnival && (
                        <WathSlotPicker
                          carnival={carnival}
                          chosenDate={form.chosen_date}
                          chosenSlot={form.chosen_slot_time}
                          onPick={(date, time) => setForm(f => ({ ...f, chosen_date: date, chosen_slot_time: time }))}
                        />
                      )}

                      {venueOptions.length > 0 ? (
                        <CustomSelect 
                          value={form.venue} 
                          onChange={val => setForm({...form, venue: val})} 
                          options={venueOptions} 
                          placeholder="Select exam venue" 
                          testid="wath-venue" 
                        />
                      ) : (
                        <input className={inputCls} placeholder="Preferred venue" required value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} data-testid="wath-venue-text"/>
                      )}

                      <div className="pt-2">
                        <CTAPrimary type="submit" className="w-full justify-center text-xs py-3.5 rounded-full shadow-lg" data-testid="wath-submit" disabled={busy || (!campaign && !isCarnival)}>
                          {busy ? "Registering…" : (campaign || isCarnival) ? "Register & get admit card" : "Notify me"}
                        </CTAPrimary>
                      </div>

                      <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
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
