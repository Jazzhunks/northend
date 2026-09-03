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

const CLASSES = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11 (NEET)", "Class 11 (IIT-JEE)", "Class 12 (NEET)", "Class 12 (IIT-JEE)", "Dropper (NEET)", "Dropper (IIT-JEE)"];

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

// Helper to determine if a date/time combination has already passed
function isSlotInPast(dateStr, timeStr) {
  if (!dateStr || !timeStr) return false;
  const dateObj = new Date(dateStr);
  dateObj.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj.getTime() < today.getTime()) return true; // Past date
  if (dateObj.getTime() > today.getTime()) return false; // Future date
  
  // If it's today, we need to check the actual time
  const match = timeStr.match(/(\d+):(\d+)\s+(AM|PM)/i);
  if (!match) return false;
  
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (match[3].toUpperCase() === 'PM' && h < 12) h += 12;
  if (match[3].toUpperCase() === 'AM' && h === 12) h = 0;
  
  const slotTime = new Date();
  slotTime.setHours(h, m, 0, 0);
  
  return slotTime.getTime() <= new Date().getTime();
}


// ---------------- UI Components ----------------

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

function CarnivalSlotPicker({ carnival, chosenDate, chosenSlot, onPick }) {
  const dates = carnival?.exam_dates || [];
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ left: 0, width: 0, top: 0, bottom: 0, placement: "bottom" });
  
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Automatically select the first date that actually has future slots available
  const initialAvailableDate = useMemo(() => {
    if (chosenDate) return chosenDate;
    const firstValid = dates.find(d => {
      const validSlots = (d.slots || []).filter(s => s.available && !isSlotInPast(d.date, s.time));
      return validSlots.length > 0;
    });
    return firstValid ? firstValid.date : (dates[0]?.date || null);
  }, [dates, chosenDate]);

  const [activeDate, setActiveDate] = useState(initialAvailableDate);
  const initialView = initialAvailableDate ? new Date(initialAvailableDate) : new Date();
  const [viewDate, setViewDate] = useState(initialView);

  useEffect(() => {
    if (!chosenDate && initialAvailableDate) {
      setActiveDate(initialAvailableDate);
    }
  }, [dates, chosenDate, initialAvailableDate]);

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
        const dropdownHeight = 420; 
        
        const placement = (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) ? "top" : "bottom";
        
        const isMobile = window.innerWidth < 480;
        const desiredWidth = 360; 
        const actualWidth = isMobile ? window.innerWidth - 32 : desiredWidth;
        let leftPos = isMobile ? 16 : rect.left;

        if (!isMobile && leftPos + actualWidth > window.innerWidth - 16) {
            leftPos = window.innerWidth - actualWidth - 16;
        }

        setCoords({
          left: leftPos,
          width: actualWidth,
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

  const handlePick = (date, time) => {
    onPick(date, time);
    setIsOpen(false); 
  };

  const formatYMD = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
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
  const remainingSlots = 42 - days.length;
  for (let i = 1; i <= remainingSlots; i++) {
    days.push({ day: i, current: false, date: new Date(year, month + 1, i) });
  }

  const active = dates.find(d => d.date === activeDate);

  return (
    <div className="relative min-w-0" data-testid="carnival-slot-picker">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-w-0 px-5 py-3.5 rounded-full bg-white border text-[13px] text-left transition flex items-center justify-between shadow-sm focus:outline-none ${
          isOpen || (chosenDate && chosenSlot) 
            ? 'border-[#08BD80] ring-1 ring-[#08BD80]' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <CalendarBlank size={16} className={chosenDate ? "text-[#08BD80]" : "text-gray-400"}/>
          <span className={chosenDate ? "text-gray-800" : "text-gray-400"}>
            {chosenDate && chosenSlot
              ? `${new Date(chosenDate).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })} · ${chosenSlot}`
              : "Pick your exam date & slot"}
          </span>
        </div>
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
              className="z-[9999] bg-white border border-gray-200 shadow-2xl rounded-[20px] p-5 overscroll-contain overflow-y-auto max-h-[460px] touch-pan-y [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[#08BD80] font-bold">
                  <CalendarBlank size={16}/> Exam Schedule
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700 transition">
                  <X size={16} weight="bold" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-bold text-gray-900 text-[15px] px-2.5 py-1">
                    {monthNames[month]} {year}
                  </div>
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
                    const ymd = formatYMD(d.date);
                    const carnivalDate = dates.find(x => x.date === ymd);
                    const isSelected = activeDate === ymd;
                    
                    let btnClass = "h-9 w-full flex flex-col items-center justify-center rounded-lg transition relative text-[13px] ";
                    let isDisabled = true;
                    let validSlotsRemaining = 0;

                    if (carnivalDate) {
                      // Only count slots that have not passed yet
                      const validFutureSlots = (carnivalDate.slots || []).filter(s => s.available && !isSlotInPast(carnivalDate.date, s.time));
                      validSlotsRemaining = validFutureSlots.reduce((sum, s) => sum + (s.remaining || 0), 0);
                      isDisabled = validSlotsRemaining === 0;
                      
                      if (isSelected) {
                         btnClass += "bg-[#08BD80] text-white font-medium shadow-sm";
                      } else if (isDisabled) {
                         btnClass += "bg-gray-50 text-gray-400 line-through cursor-not-allowed";
                      } else {
                         btnClass += "bg-[#08BD80]/10 text-[#08BD80] font-bold hover:bg-[#08BD80]/20 cursor-pointer";
                      }
                    } else {
                      btnClass += d.current ? "text-gray-300 cursor-not-allowed" : "text-gray-200 opacity-50 cursor-not-allowed";
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={isDisabled || !carnivalDate}
                        onClick={() => setActiveDate(ymd)}
                        className={btnClass}
                      >
                        {d.day}
                        {carnivalDate && validSlotsRemaining > 0 && !isSelected && (
                          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#08BD80]" />
                        )}
                        {carnivalDate && validSlotsRemaining > 0 && isSelected && (
                          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Section */}
              <AnimatePresence mode="wait">
                {activeDate && active ? (
                  <motion.div
                    key="slots"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pt-4 border-t border-gray-100 overflow-hidden"
                  >
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 font-semibold text-center">
                      Slots for {new Date(activeDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(active.slots || []).map(s => {
                        const past = isSlotInPast(active.date, s.time);
                        const disabled = !s.available || past;
                        const selected = chosenDate === active.date && chosenSlot === s.time;
                        
                        return (
                          <button
                            type="button"
                            key={s.time}
                            disabled={disabled}
                            onClick={() => handlePick(active.date, s.time)}
                            className={`w-full px-3 py-3 rounded-xl text-[12px] font-medium text-center flex flex-col items-center justify-center gap-1 transition ${
                              selected 
                                ? "bg-[#08BD80] text-white shadow-md" 
                                : disabled 
                                  ? "bg-transparent text-gray-400 cursor-not-allowed" 
                                  : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
                            }`}
                          >
                            <div className={`flex items-center justify-center gap-1.5 ${disabled ? "line-through opacity-70" : ""}`}>
                              <Clock size={14}/>{s.time}
                            </div>
                            <div className={`text-[10px] flex items-center justify-center gap-1 ${disabled ? "opacity-60" : "opacity-90"}`}>
                              {past ? "Time passed" : disabled ? "Full" : `${s.remaining}/${s.capacity} left`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pt-4 border-t border-gray-100 text-center text-xs text-gray-400 py-2"
                  >
                    Select an available date to view time slots.
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

export default function WATH() {
  const [pageState, setPageState] = useState(null);
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

function HeroSection({ campaign, carnival, mode, loading, onRegistered }) {
  const isCarnival = mode === "carnival" && !!carnival;
  const examDate = isCarnival
    ? carnival.exam_dates?.[0]?.date
    : campaign?.exam_date;
  const [form, setForm] = useState({
    name: "", email: "", phone: "", class_or_course: "", school_name: "", venue: "",
    father_name: "", gender: "", dob: "",
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

                      {isCarnival && (
                        <CarnivalSlotPicker
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