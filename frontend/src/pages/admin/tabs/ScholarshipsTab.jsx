import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, Loader2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminInput, AdminSelect, AdminTextarea, AdminCheckbox } from "@/components/admin";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

function EditApplicantDialog({ open, appNo, initialData, onClose, onSave }) {
  const [data, setData] = useState({});
  React.useEffect(() => { if(open && initialData) setData(initialData) }, [open, initialData]);

  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Edit Applicant Info</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <AdminInput label="Full Name" value={data.name || ""} onChange={e => setData({...data, name: e.target.value})} />
          <AdminInput label="Email" type="email" value={data.email || ""} onChange={e => setData({...data, email: e.target.value})} />
          <AdminInput label="Phone" value={data.phone || ""} onChange={e => setData({...data, phone: e.target.value})} />
          <AdminInput label="School Name" value={data.school || ""} onChange={e => setData({...data, school: e.target.value})} />
          <AdminInput label="Class/Standard" value={data.standard || ""} onChange={e => setData({...data, standard: e.target.value})} />
          <AdminInput label="Target Exam" value={data.target_exam || ""} onChange={e => setData({...data, target_exam: e.target.value})} />
          <AdminInput label="City" value={data.city || ""} onChange={e => setData({...data, city: e.target.value})} />
          <AdminInput label="Assigned Venue" value={data.venue || ""} onChange={e => setData({...data, venue: e.target.value})} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(appNo, data)}>Save Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditResultDialog({ open, resultId, initialData, onClose, onSave }) {
  const [data, setData] = useState({});
  React.useEffect(() => { if(open && initialData) setData(initialData) }, [open, initialData]);

  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Edit Scholarship Result</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-2">
          <AdminInput type="number" label="Marks Obtained" value={data.marks_obtained || ""} onChange={e => setData({...data, marks_obtained: Number(e.target.value)})} />
          <AdminInput type="number" label="Total Marks" value={data.total_marks || ""} onChange={e => setData({...data, total_marks: Number(e.target.value)})} />
          <AdminInput type="number" label="Rank" value={data.rank || ""} onChange={e => setData({...data, rank: Number(e.target.value)})} />
          <AdminInput type="number" label="Percentile" value={data.percentile || ""} onChange={e => setData({...data, percentile: Number(e.target.value)})} />
          <AdminInput type="number" label="Scholarship %" value={data.scholarship_percentage || ""} onChange={e => setData({...data, scholarship_percentage: Number(e.target.value)})} />
          <AdminCheckbox className="col-span-2" label="Publish Result (SMS/Email dispatched)" checked={data.publish || false} onCheckedChange={c => setData({...data, publish: c})} />
          <AdminTextarea className="col-span-2" label="Internal Remarks" value={data.remarks || ""} onChange={e => setData({...data, remarks: e.target.value})} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(resultId, data)}>Commit Result</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const statusColors = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20"
};

export default function ScholarshipsTab({ innerSearch }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 25;
  const skip = (page - 1) * limit;
  const [schKind, setSchKind] = useState("all");

  const [applicantDialogAppNo, setApplicantDialogAppNo] = useState(null);
  const [resultDialogId, setResultDialogId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['scholarship-apps', { page, innerSearch, schKind }],
    queryFn: async () => {
      const res = await api.get('/scholarship-applications', {
        params: { skip, limit, search: innerSearch || undefined, campaign_kind: schKind === "all" ? undefined : schKind }
      });
      return res.data;
    }
  });

  const apps = data?.items || [];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => api.put(`/scholarship-applications/${id}/status?status=${encodeURIComponent(status)}`),
    onSuccess: () => { toast.success("Status updated"); queryClient.invalidateQueries({ queryKey: ['scholarship-apps'] }); },
    onError: (e) => toast.error(formatError(e.response?.data?.detail))
  });

  const updateAppMutation = useMutation({
    mutationFn: async ({ appNo, payload }) => api.put(`/scholarship-applications/${appNo}`, payload),
    onSuccess: () => { toast.success("Details updated"); setApplicantDialogAppNo(null); queryClient.invalidateQueries({ queryKey: ['scholarship-apps'] }); },
    onError: (e) => toast.error(formatError(e.response?.data?.detail))
  });

  const updateResultMutation = useMutation({
    mutationFn: async ({ resultId, payload }) => api.put(`/scholarship-applications/${resultId}/result`, payload),
    onSuccess: () => { toast.success("Result committed"); setResultDialogId(null); queryClient.invalidateQueries({ queryKey: ['scholarship-apps'] }); },
    onError: (e) => toast.error(formatError(e.response?.data?.detail))
  });

  const [exporting, setExporting] = useState(false);
  const dl = async () => {
    setExporting(true);
    try {
      const res = await api.get(`/admin/export/scholarship-applications`, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `scholarship_apps.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
    finally { setExporting(false); }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <h3 className="font-display font-medium text-lg sm:text-xl text-foreground truncate">Scholarship Queue</h3>
        <div className="flex items-center gap-2">
          <select
            value={schKind}
            onChange={e => { setSchKind(e.target.value); setPage(1); }}
            className="text-xs font-bold uppercase tracking-wider border border-border rounded-xl px-3 py-2 bg-background text-foreground cursor-pointer focus:outline-none focus:border-accent"
          >
            <option value="all">All programmes</option>
            <option value="wath">WATH</option>
            <option value="carnival">WATH Carnival</option>
            <option value="scholarship">Scholarship</option>
          </select>
          <Button size="sm" variant="outline" onClick={dl} disabled={exporting} className="border-border rounded-xl text-xs px-2.5 sm:px-3 hover:bg-muted/50">
            {exporting ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Download size={14} className="mr-1 sm:mr-1.5"/>} Excel
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : !apps.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {apps.map((a) => (
            <div key={a.id} className="glass border border-border rounded-2xl bg-background/40 p-4 transition hover:border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-xs text-muted-foreground/60 truncate">App No: {a.application_no}</div>
                  <div className="font-bold text-foreground text-sm sm:text-base break-words">
                    {a.name} <span className="text-xs font-normal text-muted-foreground">· {a.standard} · Target: {a.target_exam}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {a.email} · <span className="font-mono">{a.phone}</span>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mt-0.5 flex gap-1">
                    Venue/School: <span className="text-emerald-600 font-bold">{a.venue || a.city}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                  {a.result_published && <span className="text-[10px] uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2.5 py-0.5 rounded-md font-bold">Published</span>}
                  <select 
                    value={a.status} 
                    onChange={ev => updateStatusMutation.mutate({ id: a.id, status: ev.target.value })}
                    disabled={updateStatusMutation.isPending}
                    className={`text-xs font-bold uppercase border rounded-lg px-2 py-1 focus:outline-none cursor-pointer ${statusColors[a.status] || ''}`}
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                  
                  <Button size="sm" variant="outline" onClick={() => setApplicantDialogAppNo(a.application_no)} className="rounded-xl text-xs uppercase tracking-wider font-bold">
                    Edit Info
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => setResultDialogId(a.id)} className="rounded-xl text-xs uppercase tracking-wider font-bold">
                    {a.result_published ? "Edit Score" : "Log Result"}
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {data.pages > 1 && (
            <div className="glass px-4 py-3 border border-border flex items-center justify-between rounded-2xl">
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

      {/* Edit Dialogs */}
      <EditApplicantDialog 
        open={!!applicantDialogAppNo} 
        appNo={applicantDialogAppNo}
        initialData={apps.find(a => a.application_no === applicantDialogAppNo)}
        onClose={() => setApplicantDialogAppNo(null)}
        onSave={(appNo, payload) => updateAppMutation.mutate({ appNo, payload })}
      />
      <EditResultDialog 
        open={!!resultDialogId} 
        resultId={resultDialogId}
        initialData={(() => {
          const res = apps.find(a => a.id === resultDialogId);
          if (!res) return null;
          return { marks_obtained: res.result_marks_obtained ?? "", total_marks: res.result_total_marks ?? 100, rank: res.result_rank ?? "", percentile: res.result_percentile ?? "", scholarship_percentage: res.result_scholarship_percentage ?? 0, remarks: res.result_remarks ?? "", publish: res.result_published ?? false };
        })()}
        onClose={() => setResultDialogId(null)}
        onSave={(resultId, payload) => updateResultMutation.mutate({ resultId, payload })}
      />
    </div>
  );
}
