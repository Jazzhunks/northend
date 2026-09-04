import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Calendar, Clock, Users, GraduationCap, ArrowLeft, XCircle
} from "lucide-react";

const CLASSES = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Dropper (JEE)", "Dropper (NEET)"];

export default function CarnivalDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [carnival, setCarnival] = useState(null);
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/admin/wath/carnivals/${id}`),
      api.get(`/admin/wath/carnivals/${id}/registrations`),
    ])
      .then(([cRes, rRes]) => {
        setCarnival(cRes.data);
        setRegs(Array.isArray(rRes.data) ? rRes.data : []);
      })
      .catch(e => toast.error(formatError(e.response?.data?.detail) || "Failed to load carnival dashboard"))
      .finally(() => setLoading(false));
  }, [id]);

  const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const stats = useMemo(() => {
    if (!carnival) return { totalCap: 0, total: 0, pct: 0, byDate: [], byVenue: [], byClass: [] };
    const totalCap = (carnival.exam_dates || []).flatMap(d => d.slots || []).reduce((s, x) => s + (x.capacity || 0), 0);
    const total = regs.length;
    const byDate = (carnival.exam_dates || []).map(d => {
      const cap = (d.slots || []).reduce((s, x) => s + (x.capacity || 0), 0);
      const count = regs.filter(r => r.chosen_date === d.date).length;
      return { date: d.date, cap, count, pct: cap ? Math.round((count / cap) * 100) : 0 };
    });
    const tally = (key) => {
      const m = {};
      for (const r of regs) { const k = r[key] || "—"; m[k] = m[k] || 0; m[k]++; }
      return Object.entries(m).sort((a, b) => b[1] - a[1]);
    };
    return {
      totalCap, total, pct: totalCap ? Math.round((total / totalCap) * 100) : 0,
      byDate, byVenue: tally("venue"), byClass: tally("standard")
    };
  }, [regs, carnival]);

  const bySlot = useMemo(() => {
    const map = {};
    for (const r of regs) {
      const key = `${r.chosen_date || "—"}|${r.chosen_slot_time || "—"}`;
      if (!map[key]) map[key] = { date: r.chosen_date, time: r.chosen_slot_time, rows: [] };
      map[key].rows.push(r);
    }
    return Object.values(map).sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.time || "").localeCompare(b.time || ""));
  }, [regs]);

  const StatCard = ({ label, value, sub }) => (
    <div className="glass border border-white/10 rounded-xl p-3 text-center flex flex-col justify-center min-h-[56px] sm:min-h-[76px]">
      <div className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground font-bold leading-tight">{label}</div>
      <div className="font-display text-lg sm:text-2xl font-medium text-foreground mt-1 leading-none">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/admin")} className="p-2 rounded-xl border border-border hover:bg-muted/50 cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold">WATH Carnival Dashboard</div>
            <div className="font-display text-xl sm:text-3xl font-light tracking-tight text-foreground truncate">{carnival?.title || "Loading…"}</div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-muted-foreground">Loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              <StatCard label="Registrations" value={stats.total}/>
              <StatCard label="Total capacity" value={stats.totalCap}/>
              <StatCard label="Overall fill" value={`${stats.pct}%`} sub={`${stats.total}/${stats.totalCap} seats`}/>
              <StatCard label="Exam dates" value={carnival?.exam_dates?.length || 0}/>
            </div>

            {stats.byDate.length > 0 && (
              <div className="glass border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold flex items-center gap-1.5"><Calendar size={11}/> Fill by exam date</div>
                <div className="space-y-2">
                  {stats.byDate.map(d => (
                    <div key={d.date} className="flex items-center gap-3">
                      <div className="text-xs w-24 shrink-0 text-foreground/80">{d.date}</div>
                      <div className="flex-1 h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${Math.min(100, d.pct)}%` }}/>
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground w-24 text-right shrink-0">{d.count}/{d.cap} · {d.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
              <div className="glass border border-white/10 rounded-2xl p-4 sm:p-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2.5 flex items-center gap-1.5"><Users size={11}/> By venue</div>
                <div className="flex flex-wrap gap-1.5">
                  {stats.byVenue.length === 0 && <span className="text-[11px] text-muted-foreground">—</span>}
                  {stats.byVenue.map(([v, n]) => <span key={v} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 whitespace-nowrap">{v} <b className="text-accent ml-0.5">{n}</b></span>)}
                </div>
              </div>
              <div className="glass border border-white/10 rounded-2xl p-4 sm:p-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2.5 flex items-center gap-1.5"><GraduationCap size={11}/> By class</div>
                <div className="flex flex-wrap gap-1.5">
                  {stats.byClass.length === 0 && <span className="text-[11px] text-muted-foreground">—</span>}
                  {stats.byClass.map(([cl, n]) => <span key={cl} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 whitespace-nowrap">{cl} <b className="text-accent ml-0.5">{n}</b></span>)}
                </div>
              </div>
            </div>

            {regs.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No registrations yet</div>
            ) : (
              <div className="glass border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-4 sm:px-5 py-3 border-b border-white/10">
                  <div className="font-medium text-sm">Registrations</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[640px]">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                        <th className="text-left px-5 py-2">App No</th>
                        <th className="text-left px-5 py-2">Name</th>
                        <th className="text-left px-5 py-2">Phone</th>
                        <th className="text-left px-5 py-2">Class</th>
                        <th className="text-left px-5 py-2">Venue</th>
                        <th className="text-left px-5 py-2">Date</th>
                        <th className="text-left px-5 py-2">Slot</th>
                        <th className="text-left px-5 py-2">Registered on</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {bySlot.map(grp => (
                        grp.rows.map(r => (
                          <tr key={r.id} className="hover:bg-white/[0.02]">
                            <td className="px-5 py-2 font-mono text-accent">{r.application_no}</td>
                            <td className="px-5 py-2">{r.name}</td>
                            <td className="px-5 py-2 text-muted-foreground">{r.phone}</td>
                            <td className="px-5 py-2 text-muted-foreground">{r.standard || "—"}</td>
                            <td className="px-5 py-2 text-muted-foreground">{r.venue || "—"}</td>
                            <td className="px-5 py-2 text-muted-foreground">{r.chosen_date || "—"}</td>
                            <td className="px-5 py-2 text-muted-foreground">{r.chosen_slot_time || "—"}</td>
                            <td className="px-5 py-2 text-muted-foreground font-mono">{fmtDate(r.created_at)}</td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
