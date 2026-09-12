import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

const statusColors = {
  received: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  shortlisted: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  hired: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20"
};

export default function JobAppsTab({ innerSearch }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 25;
  const skip = (page - 1) * limit;

  const { data, isLoading } = useQuery({
    queryKey: ['job-apps', { page, innerSearch }],
    queryFn: async () => {
      const res = await api.get('/job-applications', {
        params: { skip, limit, search: innerSearch || undefined }
      });
      return res.data;
    }
  });

  const apps = data?.items || [];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => api.put(`/job-applications/${id}/status?status=${encodeURIComponent(status)}`),
    onSuccess: () => {
      toast.success("Application status updated");
      queryClient.invalidateQueries({ queryKey: ['job-apps'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail))
  });

  const [exporting, setExporting] = useState(false);
  const dl = async () => {
    setExporting(true);
    try {
      const res = await api.get(`/admin/export/job-applications`, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `job-applications.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
    finally { setExporting(false); }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center gap-2">
        <h3 className="font-display font-medium text-lg sm:text-xl text-foreground truncate">Talent Recruitment Applications</h3>
        <Button size="sm" variant="outline" onClick={dl} disabled={exporting} className="border-border rounded-xl text-xs px-2.5 sm:px-3 shrink-0 hover:bg-muted/50">
          {exporting ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Download size={14} className="mr-1 sm:mr-1.5"/>} Excel
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : !apps.length ? (
        <EmptyState />
      ) : (
        <div className="glass border border-border rounded-2xl overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[650px] table-auto">
              <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3 sm:p-4 text-left bg-muted">Applicant Name</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Email Endpoint</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Qualification</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Dossier Sheet</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground bg-background/20">
                {apps.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-foreground">{a.name}</td>
                    <td className="p-3 sm:p-4 text-muted-foreground font-mono text-xs">{a.email}</td>
                    <td className="p-3 sm:p-4 text-muted-foreground truncate max-w-[200px]">{a.qualification}</td>
                    <td className="p-3 sm:p-4">{a.resume_url ? <a href={a.resume_url} target="_blank" rel="noreferrer" className="text-accent underline font-semibold text-xs uppercase tracking-wider">View Resume</a> : "—"}</td>
                    <td className="p-3 sm:p-4">
                      <select 
                        value={a.status} 
                        onChange={ev => updateStatusMutation.mutate({ id: a.id, status: ev.target.value })}
                        disabled={updateStatusMutation.isPending}
                        className={`text-xs font-bold uppercase border rounded-lg px-2 py-1 focus:outline-none cursor-pointer transition-colors ${statusColors[a.status] || ''}`}
                      >
                        <option value="received">received</option>
                        <option value="shortlisted">shortlisted</option>
                        <option value="rejected">rejected</option>
                        <option value="hired">hired</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {data.pages > 1 && (
            <div className="px-4 py-3 border-t border-border flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Showing {skip + 1} to {Math.min(skip + limit, data.total)} of {data.total}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-lg h-8 px-2 border-border">
                  <ChevronLeft size={14} />
                </Button>
                <div className="flex items-center text-sm px-2 font-medium">Page {page} of {data.pages}</div>
                <Button size="sm" variant="outline" disabled={page >= data.pages} onClick={() => setPage(p => p + 1)} className="rounded-lg h-8 px-2 border-border">
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
