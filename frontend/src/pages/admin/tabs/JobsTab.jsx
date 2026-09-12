import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, AlertCircle, Loader2, Pencil, Briefcase } from "lucide-react";
import JobForm from "../JobForm";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

export default function JobsTab({ innerSearch }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['jobs', { innerSearch }],
    queryFn: async () => {
      const res = await api.get('/jobs/all', { params: { search: innerSearch || undefined } });
      return res.data;
    }
  });

  const jobs = jobsData?.items || [];

  const createMutation = useMutation({
    mutationFn: async (payload) => api.post('/jobs', payload),
    onSuccess: () => {
      toast.success("Job record created");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => api.put(`/jobs/${id}`, payload),
    onSuccess: () => {
      toast.success("Job record updated");
      setEditingJob(null);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!confirm("Delete this Job Posting?")) throw new Error("cancelled");
      return api.delete(`/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (e) => {
      if (e.message !== "cancelled") toast.error(formatError(e.response?.data?.detail) || e.message);
    }
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async (id) => api.post(`/admin/feature?kind=job&id=${id}`),
    onSuccess: () => {
      toast.success("Promoted to home layout");
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display font-medium text-lg sm:text-xl text-foreground flex items-center gap-2">
          <Briefcase size={20} className="text-accent" /> Careers Portal
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl">
          <Plus size={14} className="mr-1.5" /> New Opening
        </Button>
      </div>

      {showForm && (
        <div className="glass border border-border p-4 sm:p-6 rounded-2xl bg-background/20 mb-6">
          <JobForm onSubmit={(payload) => createMutation.mutate(payload)} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : !jobs.length ? (
        <EmptyState />
      ) : (
        <div className="glass border border-border rounded-2xl overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[650px] table-auto">
              <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3 sm:p-4 text-left bg-muted">Role Title</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Department</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Location</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Status</th>
                  <th className="p-3 sm:p-4 text-right bg-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground bg-background/20">
                {jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-3 sm:p-4 font-bold">{j.title}</td>
                    <td className="p-3 sm:p-4 text-muted-foreground">{j.department}</td>
                    <td className="p-3 sm:p-4 text-muted-foreground truncate max-w-[200px]">{j.location}</td>
                    <td className="p-3 sm:p-4">
                      <span className={`px-2 py-1 text-xs rounded-md font-bold uppercase ${j.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                        {j.active ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleFeatureMutation.mutate(j.id)}
                          className={`rounded-lg px-2 h-7 text-[10px] uppercase font-bold tracking-wider ${j.featured ? 'bg-accent/10 border-accent/20 text-accent' : 'border-border'}`}
                        >
                          {j.featured ? 'Featured' : 'Promote'}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditingJob(j)} className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg">
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(j.id)} className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={!!editingJob} onOpenChange={(open) => !open && setEditingJob(null)}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-xl border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Job Opening</DialogTitle>
          </DialogHeader>
          {editingJob && (
            <JobForm 
              initialData={editingJob} 
              onSubmit={(payload) => updateMutation.mutate({ id: editingJob.id, payload })} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
