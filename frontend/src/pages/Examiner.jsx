import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, CheckCircle2, XCircle, RefreshCw, ScanLine } from "lucide-react";

/**
 * Examiner attendance page.
 * Access via /examiner?token=<examiner_token>
 * No login required — token is the auth.
 */
export default function Examiner() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [campaign, setCampaign] = useState(null);
  const [venue, setVenue] = useState("");
  const [data, setData] = useState({ items: [], marked_count: 0 });
  const [scanning, setScanning] = useState(false);
  const [manualNo, setManualNo] = useState("");
  const [recent, setRecent] = useState([]);
  const scannerRef = useRef(null);

  // Load campaign metadata
  useEffect(() => {
    if (!token) return;
    api.get(`/attendance/campaign?token=${token}`)
      .then(r => {
        setCampaign(r.data);
        const venues = r.data.available_venues || [];
        if (venues.length) setVenue(venues[0]);
      })
      .catch(e => toast.error(formatError(e.response?.data?.detail) || "Invalid token"));
  }, [token]);

  // Load applications for selected venue
  const loadApps = async () => {
    if (!campaign) return;
    try {
      const url = `/attendance/applications?token=${token}` + (venue ? `&venue=${encodeURIComponent(venue)}` : "");
      const { data } = await api.get(url);
      setData(data);
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };
  useEffect(() => { loadApps(); /* eslint-disable-next-line */ }, [campaign?.id, venue]);

  // Helper to extract application_no from URL, piped strings, or plain input
  const parseAppNo = (rawText) => {
    if (!rawText) return "";
    const text = rawText.trim();
    
    // Check if it's a URL with query params
    if (text.includes("?")) {
      try {
        const urlObj = new URL(text.startsWith("http") ? text : `https://${text}`);
        const appNoParam = urlObj.searchParams.get("app_no") || urlObj.searchParams.get("application_no");
        if (appNoParam) return appNoParam.trim();
      } catch (e) {
        console.warn("Could not parse as URL:", e);
      }
    }

    // Check if piped string (e.g. UAC|73459760|Name or NEW|73459760|Name)
    if (text.includes("|")) {
      const parts = text.split("|");
      return (parts[1] || parts[0]).trim();
    }

    return text;
  };

  const mark = async (rawInput, status = "present") => {
    const app_no = parseAppNo(rawInput);
    if (!app_no) { toast.error("Invalid Application Number"); return; }
    if (!venue) { toast.error("Select a venue first"); return; }
    try {
      const { data } = await api.post("/attendance/mark", { token, application_no: app_no, venue, status });
      toast.success(`${data.name} marked ${status}`);
      setRecent(prev => [{ ...data, ts: Date.now() }, ...prev].slice(0, 6));
      loadApps();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || e.message);
    }
  };

  const onManualSubmit = (e) => {
    e.preventDefault();
    if (!manualNo) return;
    mark(manualNo);
    setManualNo("");
  };

  const startScanner = async () => {
    if (scanning) return;
    if (!venue) { toast.error("Select a venue first"); return; }
    setScanning(true);
    try {
      const html5Qr = new Html5Qrcode("qr-reader");
      scannerRef.current = html5Qr;
      await html5Qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 }, formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE] },
        (decodedText) => {
          // Parse application number from scanned text (URL or Piped or Plain App No)
          const app_no = parseAppNo(decodedText);
          mark(app_no);
          
          // brief pause + restart camera
          html5Qr.pause(true);
          setTimeout(() => {
            try { html5Qr.resume(); } catch (e) { console.warn("QR resume failed", e); }
          }, 1200);
        },
        () => {} // ignore decode errors
      );
    } catch (err) {
      toast.error("Could not start camera: " + err.message);
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      await scannerRef.current?.stop();
      await scannerRef.current?.clear();
    } catch (e) {
      console.warn("Scanner stop failed", e);
    }
    scannerRef.current = null;
    setScanning(false);
  };

  useEffect(() => () => { stopScanner(); /* cleanup on unmount */ /* eslint-disable-next-line */ }, []);

  if (!token) {
    return <div className="max-w-xl mx-auto p-12 text-center"><h1 className="font-display text-2xl font-medium">Examiner link missing</h1><p className="text-muted-foreground mt-2">Open the link your administrator shared.</p></div>;
  }
  if (!campaign) {
    return <div className="p-12 text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="bg-background min-h-screen relative overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 relative" data-testid="examiner-page">
      <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-2">Examiner Console</div>
      <h1 className="font-display text-3xl lg:text-4xl font-light tracking-[-0.04em]">{campaign.title}</h1>
      <div className="text-sm text-muted-foreground mt-1">Exam {campaign.exam_date} · {campaign.exam_time || "10:00 AM"}</div>

      <div className="mt-8 grid lg:grid-cols-12 gap-8">
        {/* Scanner column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-elevated p-5 rounded-2xl bg-background">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-2 block">Venue</label>
            {(campaign.available_venues || []).length ? (
              <select className="w-full glass rounded-xl px-3 py-2 bg-background" value={venue} onChange={e => setVenue(e.target.value)} data-testid="ex-venue">
                {campaign.available_venues.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            ) : (
              <Input placeholder="Enter venue name" value={venue} onChange={e => setVenue(e.target.value)} data-testid="ex-venue-input"/>
            )}
          </div>

          <div className="glass-elevated p-5 rounded-2xl bg-background">
            <div className="flex items-center justify-between mb-3">
              <div className="font-display font-bold flex items-center gap-2"><ScanLine size={18}/>Scan Admit Card</div>
              {scanning ? (
                <Button size="sm" variant="outline" onClick={stopScanner} data-testid="ex-stop-btn"><XCircle size={14}/>Stop</Button>
              ) : (
                <Button size="sm" onClick={startScanner} className="bg-primary text-primary-foreground" data-testid="ex-start-btn"><Camera size={14}/>Start Camera</Button>
              )}
            </div>
            <div id="qr-reader" className="rounded-md overflow-hidden bg-black/30 min-h-[240px]"/>
          </div>

          <form onSubmit={onManualSubmit} className="glass-elevated p-5 rounded-2xl bg-background">
            <div className="font-display font-bold mb-3">Manual Entry</div>
            <div className="flex gap-2">
              <Input placeholder="Application No" value={manualNo} onChange={e => setManualNo(e.target.value)} data-testid="ex-manual-input"/>
              <Button type="submit" className="bg-primary text-primary-foreground" data-testid="ex-manual-submit"><CheckCircle2 size={14}/>Mark</Button>
            </div>
          </form>

          {recent.length > 0 && (
            <div className="glass-elevated p-5 rounded-2xl bg-background">
              <div className="font-display font-bold mb-3">Recently Marked</div>
              <ul className="space-y-2 text-sm">
                {recent.map((r) => (
                  <li key={`${r.application_no}-${r.ts}`} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-600"/><span className="font-bold">{r.name}</span><span className="text-muted-foreground font-mono text-xs">{r.application_no}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Roster column */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display font-bold text-lg">Applicants ({data.items.length})</div>
            <div className="flex items-center gap-3">
              <span className="text-sm">Marked: <b className="text-primary">{data.marked_count}</b></span>
              <Button size="sm" variant="outline" onClick={loadApps} data-testid="ex-refresh"><RefreshCw size={14}/>Refresh</Button>
            </div>
          </div>
          <div className="glass rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase">
                <tr>
                  <th className="p-3 text-left">App No</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left hidden md:table-cell">School</th>
                  <th className="p-3 text-left hidden md:table-cell">Standard</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.items.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No applicants for this venue yet.</td></tr>}
                {data.items.map(a => (
                  <tr key={a.application_no} className={`border-t border-border ${a.attendance_status === "present" ? "bg-green-50/40" : ""}`} data-testid={`row-${a.application_no}`}>
                    <td className="p-3 font-mono text-xs">{a.application_no}</td>
                    <td className="p-3 font-bold">{a.name}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{a.school}</td>
                    <td className="p-3 hidden md:table-cell">{a.standard}</td>
                    <td className="p-3">
                      {a.attendance_status === "present" ? <span className="text-green-700 text-xs font-bold">✓ Present</span> :
                       a.attendance_status === "absent" ? <span className="text-red-600 text-xs font-bold">✗ Absent</span> :
                       <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" onClick={() => mark(a.application_no, "present")} data-testid={`mark-pres-${a.application_no}`}>Present</Button>
                        <Button size="sm" variant="outline" onClick={() => mark(a.application_no, "absent")} data-testid={`mark-abs-${a.application_no}`}>Absent</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}