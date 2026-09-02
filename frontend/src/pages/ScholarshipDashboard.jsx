import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { ArrowLeft, TrendingUp, TrendingDown, Users, Trophy, RefreshCw, Calendar, Share2 } from "lucide-react";

export default function ScholarshipDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Safely fetch public data with cancellation support
  const fetchStats = useCallback(async (isRefresh = false, signal = null) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { data } = await api.get(`/scholarships/${id}/stats`, { 
        signal,
        headers: { "X-Skip-Auth": "true" }
      });
      setStats(data);
    } catch (e) {
      if (e.name !== "CanceledError" && e.code !== "ERR_CANCELED") {
        toast.error(formatError(e.response?.data?.detail) || "Could not load stats.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    fetchStats(false, controller.signal);
    return () => controller.abort();
  }, [fetchStats]);

  // Combine "Srinagar" and "90 FT" under the default name "90 FT"
  const consolidatedByVenue = useMemo(() => {
    if (!stats?.by_venue) return [];

    const consolidated = [];
    let ninetyFtCombined = null;

    stats.by_venue.forEach((row) => {
      const venueLower = row.venue?.trim().toLowerCase() ?? "";

      if (venueLower === "srinagar" || venueLower === "90 ft" || venueLower === "90ft") {
        if (!ninetyFtCombined) {
          ninetyFtCombined = {
            venue: "90 FT",
            total: 0,
            today: 0,
            last_7_days: 0,
          };
          consolidated.push(ninetyFtCombined);
        }
        ninetyFtCombined.total += row.total || 0;
        ninetyFtCombined.today += row.today || 0;
        ninetyFtCombined.last_7_days += row.last_7_days || 0;
      } else {
        consolidated.push(row);
      }
    });

    return consolidated;
  }, [stats?.by_venue]);

  // Recalculate top venue using merged totals
  const topVenue = useMemo(() => {
    if (!consolidatedByVenue.length) return stats?.top_venue;
    const sorted = [...consolidatedByVenue].sort((a, b) => (b.total || 0) - (a.total || 0));
    return sorted[0]?.venue ?? (stats?.top_venue === "Srinagar" ? "90 FT" : stats?.top_venue);
  }, [consolidatedByVenue, stats?.top_venue]);

  const isPositive = (stats?.wow_growth_pct ?? 0) >= 0;

  // Format date helper
  const formattedDate = useMemo(() => {
    const dateObj = stats?.as_of ? new Date(stats.as_of) : new Date();
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedHours = String(hours).padStart(2, "0");

    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
  }, [stats?.as_of]);

  // Construct WhatsApp Share URL
  const handleWhatsAppShare = () => {
    if (!consolidatedByVenue.length) return;

    let todayTotal = 0;
    let todayLines = "";

    let totalCampusLines = "";
    let grandTotal = 0;

    consolidatedByVenue.forEach((item) => {
      const todayVal = item.today || 0;
      const totalVal = item.total || 0;

      todayTotal += todayVal;
      grandTotal += totalVal;

      todayLines += `▸ ${item.venue}: ${todayVal}\n`;
      totalCampusLines += `▸ ${item.venue}: ${totalVal}\n`;
    });

    const message = `Campus Summary Update ​​​\n${formattedDate}\n\n` +
      `Today's Registrations:\n${todayLines}` +
      `Today Total: ${todayTotal}\n\n` +
      `────────────────\n\n` +
      `Total Campus Breakdown:\n${totalCampusLines}\n` +
      `Top Performing Branch: ${topVenue || "N/A"}\n` +
      `Grand Total: ${grandTotal}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Configuration for tables
  const tables = useMemo(() => [
    { title: "Venue Registrations", rightLabel: "Registrations", rowKey: "total", testid: "table-total" },
    { title: "Today's Registrations", rightLabel: "Today", rowKey: "today", testid: "table-today" },
    { title: "Last 7 Days", rightLabel: "Last 7 Days", rowKey: "last_7_days", testid: "table-week" },
  ], []);

  if (loading && !stats) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground bg-background" role="status">
        Loading dashboard…
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground bg-background">
        No data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="scholarship-dashboard">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-background/60 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-white/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              data-testid="back-btn"
              aria-label="Back to Home"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold block">
                Registrations Dashboard
              </span>
              <h1 className="font-display text-base font-medium truncate max-w-[40vw] sm:max-w-[60vw]" data-testid="dashboard-title">
                {stats.campaign?.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="text-xs font-bold uppercase tracking-[0.12em] px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition inline-flex items-center gap-2 shadow-lg shadow-emerald-900/20"
              data-testid="whatsapp-share-btn"
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">Share to WhatsApp</span>
              <span className="sm:hidden">Share</span>
            </button>

            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="text-xs font-bold uppercase tracking-[0.16em] px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition inline-flex items-center gap-2 disabled:opacity-50"
              data-testid="refresh-btn"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-elevated rounded-2xl border border-white/10 p-5 lg:p-7 bg-background/40 text-center"
            data-testid="kpi-total"
          >
            <span className="text-xs lg:text-sm text-muted-foreground font-medium">Total Registrations</span>
            <div className="font-display text-5xl lg:text-7xl font-medium mt-2 text-foreground tabular-nums" data-testid="total-count">
              {stats.total_registrations?.toLocaleString("en-IN") ?? 0}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
              <Users size={11} /> All-time
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className={`glass-elevated rounded-2xl border p-5 lg:p-7 bg-background/40 text-center ${
              isPositive ? "border-emerald-500/25" : "border-rose-500/25"
            }`}
            data-testid="kpi-wow"
          >
            <span className="text-xs lg:text-sm text-muted-foreground font-medium">Overall WoW Growth</span>
            <div
              className={`font-display text-5xl lg:text-7xl font-medium mt-2 tabular-nums flex items-center justify-center gap-2 ${
                isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
              data-testid="wow-pct"
            >
              {isPositive ? (
                <TrendingUp size={28} className="hidden lg:block" />
              ) : (
                <TrendingDown size={28} className="hidden lg:block" />
              )}
              {(stats.wow_growth_pct ?? 0).toFixed(2)}%
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-3">
              {stats.this_week} this wk · {stats.prev_week} prev wk
            </div>
          </motion.div>
        </div>

        {/* Total Venue Table */}
        <VenueTable {...tables[0]} rows={consolidatedByVenue} />

        {/* Top Venue Banner */}
        {topVenue && (
          <div className="glass-elevated border border-accent/25 rounded-2xl overflow-hidden bg-accent/[0.03]" data-testid="top-venue-card">
            <div className="grid grid-cols-2">
              <div className="p-4 lg:p-5 border-r border-accent/20 flex items-center gap-2">
                <Trophy size={18} className="text-accent" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Top Venue</span>
              </div>
              <div className="p-4 lg:p-5 text-right">
                <div className="font-display text-lg font-medium text-foreground" data-testid="top-venue-name">
                  {topVenue}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remaining Tables */}
        <VenueTable {...tables[1]} rows={consolidatedByVenue} />
        <VenueTable {...tables[2]} rows={consolidatedByVenue} />

        {/* Timestamp */}
        {stats.as_of && (
          <footer className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground text-center pt-4 pb-8 flex items-center justify-center gap-2">
            <Calendar size={11} />
            As of {formattedDate}
          </footer>
        )}
      </main>
    </div>
  );
}

function VenueTable({ title, rightLabel, rows = [], rowKey, testid }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-elevated border border-white/10 rounded-2xl overflow-hidden bg-background/40"
      data-testid={testid}
    >
      <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02]">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.18em] font-bold text-muted-foreground bg-white/[0.02]">
              <th scope="col" className="text-left px-5 py-2.5 w-1/2">Venue</th>
              <th scope="col" className="text-right px-5 py-2.5 w-1/2">{rightLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {rows.map((r) => {
              const testKey = r.venue ? r.venue.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() : "unknown";
              return (
                <tr key={r.venue} className="hover:bg-white/[0.02] transition">
                  <td className="px-5 py-3 text-foreground/90">{r.venue}</td>
                  <td
                    className="px-5 py-3 text-right tabular-nums font-mono font-medium text-foreground"
                    data-testid={`${testid}-${testKey}-value`}
                  >
                    {(r[rowKey] ?? 0).toLocaleString("en-IN")}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={2} className="px-5 py-6 text-center text-muted-foreground text-xs">
                  No venue data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}