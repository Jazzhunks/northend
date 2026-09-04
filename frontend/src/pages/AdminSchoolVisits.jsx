import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import GlassPanel from "@/components/GlassPanel";
import { Eyebrow, Reveal } from "@/components/Cinematic";
import { CheckCircle2, XCircle, Clock, Loader2, RefreshCw, Filter } from "lucide-react";

export default function AdminSchoolVisits() {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState({});

  const loadVisits = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "all") params.status = filter;
      const { data } = await api.get("/admin/school-visits", { params });
      setVisits(data || []);
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to load visits");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const updateStatus = async (visitId, status) => {
    setUpdating(prev => ({ ...prev, [visitId]: true }));
    try {
      await api.put(`/admin/school-visits/${visitId}`, { status });
      toast.success("Visit updated");
      loadVisits();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || e.message);
    } finally {
      setUpdating(prev => ({ ...prev, [visitId]: false }));
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: "bg-amber-500/10 text-amber-500",
      approved: "bg-emerald-500/10 text-emerald-500",
      rejected: "bg-rose-500/10 text-rose-500",
    };
    const icons = { pending: Clock, approved: CheckCircle2, rejected: XCircle };
    const Icon = icons[status] || Clock;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        <Icon size={12} /> {status}
      </span>
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)]" data-testid="admin-school-visits">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-12 lg:pt-20 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Eyebrow>Admin Console</Eyebrow>
          <h1 className="font-display text-5xl lg:text-6xl font-light tracking-tight mt-4 leading-[0.95]">
            School <span className="font-medium italic text-accent">Visits</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">Manage school exam visit requests. Approve or reject preferred dates.</p>
        </motion.div>

        <Reveal>
          <GlassPanel elevated className="p-7 mt-10" data-testid="school-visits-table">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-muted-foreground" />
                <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-border rounded-md px-3 py-2 bg-background text-sm">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <button onClick={loadVisits} className="text-xs font-bold uppercase tracking-[0.16em] px-3 py-2 rounded-lg border border-border hover:bg-muted/50 transition inline-flex items-center gap-2">
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center text-muted-foreground py-12 flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Loading...</div>
            ) : visits.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">No visit requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground border-b border-border">
                      <th className="text-left py-3 px-4">School</th>
                      <th className="text-left py-3 px-4">Campaign</th>
                      <th className="text-left py-3 px-4">Preferred Date</th>
                      <th className="text-left py-3 px-4">Time</th>
                      <th className="text-left py-3 px-4">Notes</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visits.map(v => (
                      <tr key={v.id} className="hover:bg-muted/30 transition">
                        <td className="py-3 px-4 font-medium">{v.school_name || v.school_id}</td>
                        <td className="py-3 px-4 text-muted-foreground">{v.scholarship_id}</td>
                        <td className="py-3 px-4">{v.preferred_date}</td>
                        <td className="py-3 px-4">{v.preferred_slot_time}</td>
                        <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">{v.admin_notes || "-"}</td>
                        <td className="py-3 px-4">{statusBadge(v.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {v.status === "pending" && (
                              <>
                                <button onClick={() => updateStatus(v.id, "approved")} disabled={updating[v.id]} className="p-2 rounded-md bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition" title="Approve">
                                  <CheckCircle2 size={16} />
                                </button>
                                <button onClick={() => updateStatus(v.id, "rejected")} disabled={updating[v.id]} className="p-2 rounded-md bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition" title="Reject">
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                            {updating[v.id] && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassPanel>
        </Reveal>
      </div>
    </div>
  );
}
