import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, Loader2, Pencil, MessageSquare, Terminal, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BulkProgressModal from "../BulkProgressModal";
import AsyncBulkRegModal from "../AsyncBulkRegModal";
import WhatsAppBroadcastModal from "../WhatsAppBroadcastModal";
import CampaignOperationsModal from "../CampaignOperationsModal";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

export default function CampaignsTab({ innerSearch }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 25;
  const skip = (page - 1) * limit;

  // Modals state
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkState, setBulkState] = useState({ progress: 0, status: "idle" });
  const [asyncBulkRegId, setAsyncBulkRegId] = useState(null);
  const [broadcastModalId, setBroadcastModalId] = useState(null);
  const [operationsModalId, setOperationsModalId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-campaigns', { page, innerSearch }],
    queryFn: async () => {
      const res = await api.get('/admin/scholarships', {
        params: { skip, limit, search: innerSearch || undefined }
      });
      return res.data;
    }
  });

  // Load ALL scholarship apps temporarily for the broadcast and operations modals (as the old design did).
  // Ideally, these modals should handle their own API fetching natively, but for now we'll supply them.
  const { data: allAppsData } = useQuery({
    queryKey: ['all-scholarship-apps-for-campaign-modals'],
    queryFn: async () => {
      const res = await api.get('/scholarship-applications', { params: { limit: 100000 } });
      return res.data;
    }
  });

  const campaigns = data?.items || [];
  const scholarshipApps = allAppsData?.items || [];

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!confirm("Delete this campaign?")) throw new Error("cancelled");
      return api.delete(`/scholarships/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] }),
    onError: (e) => { if (e.message !== "cancelled") toast.error(formatError(e.response?.data?.detail)); }
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, isFeatured }) => {
      if (isFeatured) return api.post(`/admin/feature?kind=clear&id=none`);
      return api.post(`/admin/feature?kind=scholarship&id=${id}`);
    },
    onSuccess: (_, { isFeatured }) => {
      toast.success(isFeatured ? "Removed from homepage" : "Promoted to homepage");
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail))
  });

  const rotateToken = async (id) => {
    if (!confirm("Regenerate token? Old evaluators will lose access.")) return;
    try {
      await api.post(`/admin/scholarships/${id}/regenerate-token`);
      toast.success("Token regenerated");
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail));
    }
  };

  const copy = (txt) => { navigator.clipboard.writeText(txt); toast.success("Copied to clipboard"); };
  const examinerLink = (token) => `${window.location.origin}/evaluator?token=${token}`;

  // Operations modal callbacks
  const downloadResultsTemplate = async (campaignId) => {
    try {
      const res = await api.get(`/admin/scholarships/${campaignId}/results-template`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `results_template_${campaignId}.xlsx`; link.click(); URL.revokeObjectURL(url);
    } catch (err) { toast.error("Failed to download template"); }
  };

  const downloadBulkRegisterTemplate = async (campaignId) => {
    try {
      const res = await api.get(`/admin/scholarships/${campaignId}/bulk-register-template`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `bulk_register_template_${campaignId}.xlsx`; link.click(); URL.revokeObjectURL(url);
    } catch (err) { toast.error("Failed to download bulk register template"); }
  };

  const downloadAttendance = async (campaignId) => {
    try {
      const res = await api.get(`/admin/scholarships/${campaignId}/attendance`, { responseType: "blob" });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `attendance_sheet_${campaignId}.pdf`; a.click(); URL.revokeObjectURL(url);
    } catch (e) { toast.error("Failed to generate attendance sheet"); }
  };

  const bulkUploadResults = async (campaignId, file) => {
    setBulkModalOpen(true);
    setBulkState({ progress: 0, status: "uploading" });
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post(`/admin/scholarships/${campaignId}/bulk-results`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          if (ev.total) setBulkState({ progress: Math.round((ev.loaded * 100) / ev.total), status: "uploading" });
        }
      });
      setBulkState({ progress: 100, status: "success", data: res.data });
      toast.success("Results processed successfully");
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
    } catch (err) {
      setBulkState({ progress: 0, status: "error", error: formatError(err.response?.data?.detail) || err.message });
      toast.error("Upload failed");
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <BulkProgressModal isOpen={bulkModalOpen} onClose={() => setBulkModalOpen(false)} state={bulkState} />
      <AsyncBulkRegModal scholarshipId={asyncBulkRegId} onClose={() => { setAsyncBulkRegId(null); queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] }); }} />
      <WhatsAppBroadcastModal scholarshipId={broadcastModalId} onClose={() => setBroadcastModalId(null)} allApps={scholarshipApps} />
      <CampaignOperationsModal 
        scholarshipId={operationsModalId}
        onClose={() => setOperationsModalId(null)}
        onDownloadResultsTemplate={downloadResultsTemplate}
        onUploadResults={bulkUploadResults}
        onDownloadRegTemplate={downloadBulkRegisterTemplate}
        onOpenBulkReg={setAsyncBulkRegId}
        onDownloadAttendance={downloadAttendance}
        allApps={scholarshipApps}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] })} 
      />

      <div className="flex items-center justify-between gap-2">
        <div className="font-display font-bold text-xl text-foreground">Scholarship Campaigns Drivers</div>
        <Button size="sm" onClick={() => navigate("/admin/campaigns/new")} className="rounded-lg text-xs font-bold bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer">New Campaign</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : !campaigns.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => (
            <div key={c.id} className={`border ${c.is_featured ? "border-accent ring-1 ring-accent/20 bg-accent/[0.01]" : "border-border bg-background/30"} p-5 rounded-2xl transition duration-200`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-xs uppercase font-bold tracking-widest text-accent font-mono">{c.active ? "LIVE PROFILE" : "ARCHIVED RECORD"}</div>
                    {c.is_featured && <span className="text-[9px] uppercase font-bold tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded">★ Top Showcase</span>}
                  </div>
                  <div className="font-bold text-foreground text-lg mt-1">{c.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">Slot: <span className="font-semibold text-foreground">{c.exam_date}</span> {c.exam_time ? `at ${c.exam_time}` : ""} · Expiration Lock: <span className="font-semibold text-foreground font-mono">{c.deadline}</span></div>
                  {(c.start_date || c.end_date) && (
                    <div className="text-xs text-muted-foreground mt-1">Campaign Duration: <span className="font-semibold text-foreground">{c.start_date || "..."}</span> → <span className="font-semibold text-foreground">{c.end_date || "..."}</span></div>
                  )}
                  {c.eligible_classes && c.eligible_classes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {c.eligible_classes.map(cls => <span key={cls} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{cls}</span>)}
                    </div>
                  )}
                  {(c.available_venues || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {c.available_venues.map((v) => <span key={v} className="text-[10px] uppercase font-bold font-mono tracking-wider bg-muted/50 px-2.5 py-0.5 border border-border rounded text-muted-foreground">{v}</span>)}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-row gap-1.5 shrink-0 w-full sm:w-auto">
                  <Button size="sm" variant="default" onClick={() => navigate(`/admin/scholarships/${c.slug || c.id}/dashboard`)} className="rounded-lg text-xs font-bold bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer" data-testid={`campaign-dashboard-${c.id}`}>Dashboard</Button>
                  
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/campaigns/${c.id}/edit`)} className="rounded-lg text-xs font-bold cursor-pointer">
                    <Pencil size={13} className="mr-1.5"/> Edit
                  </Button>

                  <Button size="sm" onClick={() => setBroadcastModalId(c.id)} className="rounded-lg text-xs font-bold bg-[#25D366] hover:bg-[#20b858] text-black cursor-pointer shadow-md">
                    <MessageSquare size={13} className="mr-1.5"/> Broadcast
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => setOperationsModalId(c.id)} className="rounded-lg text-xs font-bold text-accent border-accent/20 hover:bg-accent/5 cursor-pointer">
                    <Terminal size={13} className="mr-1.5"/> Operations
                  </Button>

                  <Button size="sm" variant={c.is_featured ? "default" : "outline"} onClick={() => toggleFeatureMutation.mutate({ id: c.id, isFeatured: c.is_featured })} className="rounded-lg text-xs font-bold cursor-pointer">Promote</Button>
                  <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(c.id)} className="rounded-lg text-xs border-transparent text-rose-600 hover:bg-rose-500/5 col-span-2 sm:col-span-1 cursor-pointer"><Trash2 size={13}/></Button>
                </div>
              </div>

              {c.examiner_token && (
                <div className="mt-4 pt-4 border-t border-border bg-background/40 -mx-5 -mb-5 px-5 py-4 rounded-b-2xl">
                  <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5">Independent Evaluation Gateway Link</div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <code className="glass-elevated px-3 py-1.5 rounded-lg border border-border break-all flex-1 font-mono text-emerald-600 font-medium">{examinerLink(c.examiner_token)}</code>
                    <Button size="sm" variant="outline" onClick={() => copy(examinerLink(c.examiner_token))} className="rounded-lg text-xs font-bold cursor-pointer">Copy Link</Button>
                    <Button size="sm" variant="outline" onClick={() => rotateToken(c.id)} className="rounded-lg text-xs font-bold text-muted-foreground cursor-pointer">Rotate Token</Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination Controls */}
          {data.pages > 1 && (
            <div className="px-4 py-3 border border-border rounded-2xl flex items-center justify-between glass">
              <div className="text-xs text-muted-foreground">
                Showing {skip + 1} to {Math.min(skip + limit, data.total)} of {data.total}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-lg h-8 px-2">
                  <ChevronLeft size={14} />
                </Button>
                <div className="flex items-center text-sm px-2 font-medium">Page {page} of {data.pages}</div>
                <Button size="sm" variant="outline" disabled={page >= data.pages} onClick={() => setPage(p => p + 1)} className="rounded-lg h-8 px-2">
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
