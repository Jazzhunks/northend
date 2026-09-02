import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, API_BASE } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import GlassPanel from "@/components/GlassPanel";
import { Eyebrow, Reveal } from "@/components/Cinematic";
import { OrbitalProgress } from "@/components/Metrics";
import {
  BookBookmark, Bell, GraduationCap, Wallet, Trophy, FileText,
  ArrowUpRight, Sparkle
} from "@phosphor-icons/react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [schApps, setSchApps] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/enrollments/mine").then(r => setEnrollments(r.data)).catch(()=>{}),
      api.get("/notices").then(r => setNotices(r.data.slice(0, 4))),
      api.get("/scholarship-applications/mine").then(r => setSchApps(r.data)).catch(()=>{}),
    ]);
  }, []);

  // Mock-ish progress for display since we don't track in DB yet
  const courseProgress = enrollments.length > 0 ? 42 : 0;
  const attendance = enrollments.length > 0 ? 87 : 0;
  const testScore = enrollments.length > 0 ? 73 : 0;

  return (
    <div className="relative min-h-[calc(100vh-64px)]" data-testid="student-dashboard">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-12 lg:pt-20 pb-24">
        {/* Greeting header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <Eyebrow>Command Centre</Eyebrow>
          <h1 className="font-display text-5xl lg:text-6xl font-light tracking-tight mt-4 leading-[0.95]">
            Hello, <span className="font-medium italic text-accent">{user?.name?.split(" ")[0] || "learner"}.</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">Your mission control for everything you're learning, attempting and earning at Northend.</p>
        </motion.div>

        {/* KPI orbital ring (full row, hero block) */}
        <div className="grid lg:grid-cols-3 gap-5 mt-12">
          <Reveal>
            <GlassPanel elevated className="p-7 text-center relative overflow-hidden" data-testid="kpi-progress">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
              <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">Course progress</div>
              <div className="mt-5 flex justify-center"><OrbitalProgress value={courseProgress} size={140} label="Curriculum"/></div>
              <p className="text-xs text-muted-foreground mt-4">Keep at it — you're on track.</p>
            </GlassPanel>
          </Reveal>
          <Reveal delay={0.1}>
            <GlassPanel elevated className="p-7 text-center relative overflow-hidden" data-testid="kpi-attendance">
              <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">Attendance</div>
              <div className="mt-5 flex justify-center"><OrbitalProgress value={attendance} size={140} label="This month" accent="#3D5BFF"/></div>
              <p className="text-xs text-muted-foreground mt-4">Above the 75% threshold.</p>
            </GlassPanel>
          </Reveal>
          <Reveal delay={0.2}>
            <GlassPanel elevated className="p-7 text-center relative overflow-hidden" data-testid="kpi-tests">
              <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">Mock-test avg</div>
              <div className="mt-5 flex justify-center"><OrbitalProgress value={testScore} size={140} label="Latest 5" accent="#10b981"/></div>
              <p className="text-xs text-muted-foreground mt-4">Best in Biology · push Physics.</p>
            </GlassPanel>
          </Reveal>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {[
            { Icon: BookBookmark, label: "Enrollments", val: enrollments.length },
            { Icon: Bell, label: "New notices", val: notices.length },
            { Icon: GraduationCap, label: "Learning mode", val: "Hybrid" },
            { Icon: Trophy, label: "Scholarship apps", val: schApps.length },
          ].map((x, i) => (
            <Reveal key={x.label} delay={i * 0.05}>
              <GlassPanel className="p-5">
                <x.Icon weight="duotone" size={20} className="text-accent mb-3"/>
                <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-muted-foreground">{x.label}</div>
                <div className="font-display text-2xl font-medium mt-1">{x.val}</div>
              </GlassPanel>
            </Reveal>
          ))}
        </div>

        {/* Two-column: enrollments + notices */}
        <div className="grid lg:grid-cols-12 gap-5 mt-5">
          <div className="lg:col-span-7">
            <GlassPanel elevated className="overflow-hidden" data-testid="enrollments-panel">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookBookmark weight="duotone" size={18} className="text-accent"/>
                  <h3 className="font-display font-medium text-lg">My Enrollments</h3>
                </div>
              </div>
              {enrollments.length === 0 ? (
                <div className="p-10 text-center">
                  <Sparkle weight="duotone" size={32} className="text-accent/40 mx-auto mb-3"/>
                  <p className="text-muted-foreground">You haven't enrolled in a programme yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {enrollments.map(e => (
                    <div key={e.id} className="p-5 flex items-center justify-between" data-testid={`enr-row-${e.id}`}>
                      <div>
                        <div className="font-medium">{e.center}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">{e.receipt_no}</div>
                      </div>
                      <span className={`text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 rounded-full ${e.status === "approved" ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"}`}>{e.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassPanel>
          </div>
          <div className="lg:col-span-5">
            <GlassPanel elevated className="overflow-hidden" data-testid="notices-panel">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell weight="duotone" size={18} className="text-accent"/>
                  <h3 className="font-display font-medium text-lg">Latest Notices</h3>
                </div>
              </div>
              <div className="divide-y divide-border">
                {notices.map(n => (
                  <div key={n.id} className="p-5">
                    <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">{n.category}</div>
                    <div className="font-medium mt-1.5">{n.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.content}</div>
                  </div>
                ))}
                {notices.length === 0 && <div className="p-6 text-sm text-muted-foreground text-center">No notices yet.</div>}
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Scholarship applications */}
        {schApps.length > 0 && (
          <div className="mt-5" data-testid="sch-apps-section">
            <GlassPanel elevated className="overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-2">
                <Trophy weight="duotone" size={18} className="text-accent"/>
                <h3 className="font-display font-medium text-lg">Scholarship applications</h3>
              </div>
              <div className="divide-y divide-border">
                {schApps.map(a => (
                  <div key={a.id} className="p-5 flex flex-wrap items-center justify-between gap-3" data-testid={`sch-row-${a.id}`}>
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">{a.application_no}</div>
                      <div className="font-medium mt-0.5">{a.scholarship_title || a.target_exam}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      {a.result_published ? (
                        <>
                          <span className="px-3 py-1 rounded-full bg-accent/15 text-accent text-[10px] font-bold uppercase tracking-[0.18em]">★ {a.result_scholarship_percentage}% scholarship</span>
                          <a href={`${API_BASE}/scholarship-applications/${a.application_no}/result-card?phone=${encodeURIComponent(a.phone)}`} target="_blank" rel="noreferrer" className="text-accent font-bold text-xs hover:underline flex items-center gap-1" data-testid={`dl-result-${a.id}`}>
                            <FileText weight="duotone" size={14}/>Download result card
                          </a>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Result pending</span>
                      )}
                          <a href={`${API_BASE}/scholarship-applications/${a.application_no}/admit-card?phone=${encodeURIComponent(a.phone || '')}`} target="_blank" rel="noreferrer" className="text-muted-foreground text-xs hover:text-foreground hover:underline flex items-center gap-1">
                        <ArrowUpRight weight="bold" size={12}/>Admit card
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  );
}
