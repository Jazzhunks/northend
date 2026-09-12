import { useEffect, useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarBlank, CaretDown, ArrowUp, ArrowDown, X, Clock } from "@phosphor-icons/react";

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

export default function WathSlotPicker({ carnival, chosenDate, chosenSlot, onPick }) {
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
