import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, AlertCircle, Loader2, Pencil, Medal } from "lucide-react";
import ResultForm from "../ResultForm";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

export default function ResultsTab({ innerSearch }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  const { data: resultsData, isLoading } = useQuery({
    queryKey: ['results', { innerSearch }],
    queryFn: async () => {
      const res = await api.get('/results', { params: { search: innerSearch || undefined } });
      return res.data;
    }
  });

  const results = resultsData?.items || [];

  const createMutation = useMutation({
    mutationFn: async (payload) => api.post('/results', payload),
    onSuccess: () => {
      toast.success("Result record created");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => api.put(`/results/${id}`, payload),
    onSuccess: () => {
      toast.success("Result record updated");
      setEditingResult(null);
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!confirm("Delete this Result?")) throw new Error("cancelled");
      return api.delete(`/results/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
    onError: (e) => {
      if (e.message !== "cancelled") toast.error(formatError(e.response?.data?.detail) || e.message);
    }
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display font-medium text-lg sm:text-xl text-foreground flex items-center gap-2">
          <Medal size={20} className="text-accent" /> Results Honors
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl">
          <Plus size={14} className="mr-1.5" /> New Record
        </Button>
      </div>

      {showForm && (
        <div className="glass border border-border p-4 sm:p-6 rounded-2xl bg-background/20 mb-6">
          <ResultForm onSubmit={(payload) => createMutation.mutate(payload)} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : !results.length ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((r) => (
            <div key={r.id} className="glass border border-border p-4 rounded-2xl flex gap-4 transition-all hover:bg-muted/50 bg-background/30 group relative overflow-hidden">
              <div className="h-16 w-16 shrink-0 rounded-xl bg-muted/50 border border-border overflow-hidden">
                {r.photo_url ? <img src={r.photo_url} alt={r.student_name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground bg-background">{r.student_name.slice(0, 2).toUpperCase()}</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-foreground text-base truncate pr-14">{r.student_name}</div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{r.exam}</span> • {r.year}
                </div>
                <div className="mt-1.5 inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                  {r.rank}
                </div>
              </div>
              <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => setEditingResult(r)} className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg bg-background/80 shadow-sm">
                  <Pencil size={12} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(r.id)} className="h-7 w-7 text-rose-500 hover:text-rose-600 rounded-lg bg-background/80 shadow-sm">
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editingResult} onOpenChange={(open) => !open && setEditingResult(null)}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-xl border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Honors Record</DialogTitle>
          </DialogHeader>
          {editingResult && (
            <ResultForm 
              initialData={editingResult} 
              onSubmit={(payload) => updateMutation.mutate({ id: editingResult.id, payload })} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
