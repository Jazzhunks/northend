import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CircleAlert, Trophy, Megaphone, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";

const TYPE_COLORS = {
  deadline: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  exam: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  notice: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  post: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
};

const TYPE_ICONS = {
  deadline: <CircleAlert size={10} className="mr-1 inline" />,
  exam: <Trophy size={10} className="mr-1 inline" />,
  notice: <Megaphone size={10} className="mr-1 inline" />,
  post: <PenTool size={10} className="mr-1 inline" />
};

export default function CalendarTab() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-calendar'],
    queryFn: async () => {
      const res = await api.get('/admin/calendar');
      return res.data.events || [];
    }
  });

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const today = () => setCurrentDate(new Date());

  const { days, eventsByDate } = useMemo(() => {
    if (!data) return { days: [], eventsByDate: {} };
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Group events by YYYY-MM-DD
    const grouped = {};
    data.forEach(ev => {
      // Expecting date format parseable by JS (e.g. YYYY-MM-DD)
      try {
        const d = new Date(ev.date);
        if (isNaN(d)) return;
        const key = d.toISOString().split('T')[0];
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(ev);
      } catch (e) {}
    });

    const daysArray = [];
    
    // Pad previous month days
    const startDayOfWeek = firstDay.getDay(); // 0 is Sunday
    const prevLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      daysArray.push({
        date: new Date(year, month - 1, prevLastDay - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Pad next month days
    const remainingSlots = 42 - daysArray.length;
    for (let i = 1; i <= remainingSlots; i++) {
      daysArray.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return { days: daysArray, eventsByDate: grouped };
  }, [currentDate, data]);

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 animate-fadeIn pb-12 flex flex-col h-full min-h-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <div>
          <h3 className="font-display font-medium text-2xl text-foreground flex items-center gap-2">
            <CalendarIcon className="text-accent" size={24} /> Ecosystem Calendar
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Unified schedule for exams, deadlines, notices, and blog publishes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={today} className="rounded-lg h-9">Today</Button>
          <div className="flex items-center bg-background/50 border border-border rounded-lg overflow-hidden ml-2 h-9">
            <Button variant="ghost" size="sm" onClick={prevMonth} className="rounded-none h-full px-3 hover:bg-muted"><ChevronLeft size={16} /></Button>
            <div className="px-4 font-bold text-sm min-w-[140px] text-center">{monthName}</div>
            <Button variant="ghost" size="sm" onClick={nextMonth} className="rounded-none h-full px-3 hover:bg-muted"><ChevronRight size={16} /></Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[600px] glass border border-border rounded-3xl overflow-hidden flex flex-col bg-background/30 shadow-sm">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/40 shrink-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {isLoading ? (
            <div className="col-span-7 flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-muted-foreground w-8 h-8" />
            </div>
          ) : error ? (
            <div className="col-span-7 flex items-center justify-center text-rose-500 h-full">
              Failed to load calendar events.
            </div>
          ) : (
            days.map((day, idx) => {
              const isToday = new Date().toDateString() === day.date.toDateString();
              const dateStr = day.date.toISOString().split('T')[0];
              const dayEvents = eventsByDate[dateStr] || [];

              return (
                <div 
                  key={idx} 
                  className={`min-h-[100px] p-2 border-r border-b border-border/50 relative transition-colors hover:bg-muted/30
                    ${!day.isCurrentMonth ? 'bg-background/20 opacity-50' : ''}
                    ${idx % 7 === 6 ? 'border-r-0' : ''}
                  `}
                >
                  <div className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1
                    ${isToday ? 'bg-accent text-white shadow-md' : 'text-foreground/70'}
                  `}>
                    {day.date.getDate()}
                  </div>
                  
                  <div className="space-y-1.5 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
                    {dayEvents.map(ev => (
                      <div 
                        key={ev.id} 
                        className={`text-[10px] p-1.5 rounded-lg border font-medium truncate leading-tight cursor-pointer hover:opacity-80 transition-opacity ${TYPE_COLORS[ev.type]}`}
                        title={ev.title}
                        onClick={() => { if(ev.link) window.location.href = ev.link; }}
                      >
                        {TYPE_ICONS[ev.type]}{ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
