import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, AlertCircle, Loader2, Pencil, Building2 } from "lucide-react";
import CenterForm from "../CenterForm";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

export default function CentersTab({ innerSearch }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);

  const { data: centersData, isLoading } = useQuery({
    queryKey: ['centers', { innerSearch }],
    queryFn: async () => {
      const res = await api.get('/centers', { params: { search: innerSearch || undefined } });
      return res.data;
    }
  });

  const centers = centersData?.items || [];

  const createMutation = useMutation({
    mutationFn: async (payload) => api.post('/centers', payload),
    onSuccess: () => {
      toast.success("Center record created");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => api.put(`/centers/${id}`, payload),
    onSuccess: () => {
      toast.success("Center record updated");
      setEditingCenter(null);
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!confirm("Delete this Center Hub?")) throw new Error("cancelled");
      return api.delete(`/centers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
    onError: (e) => {
      if (e.message !== "cancelled") toast.error(formatError(e.response?.data?.detail) || e.message);
    }
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display font-medium text-lg sm:text-xl text-foreground flex items-center gap-2">
          <Building2 size={20} className="text-accent" /> Regional Centers Hub
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl">
          <Plus size={14} className="mr-1.5" /> New Center
        </Button>
      </div>

      {showForm && (
        <div className="glass border border-border p-4 sm:p-6 rounded-2xl bg-background/20 mb-6">
          <CenterForm onSubmit={(payload) => createMutation.mutate(payload)} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : !centers.length ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {centers.map((c) => (
            <div key={c.id} className="glass border border-border p-5 rounded-2xl flex flex-col justify-between transition-all hover:bg-muted/50 bg-background/30">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="font-display text-lg font-bold text-foreground">{c.name}</div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingCenter(c)} className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg">
                      <Pencil size={12} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(c.id)} className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg">
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
                <div className="text-xs uppercase tracking-widest font-bold text-accent mb-3">{c.city}</div>
                <div className="text-sm text-muted-foreground mb-1">{c.address}</div>
                <div className="text-sm font-mono text-foreground mb-3">{c.phone}</div>
              </div>
              <div className="text-xs text-muted-foreground pt-3 border-t border-border mt-auto">
                <span className="font-semibold">Timing:</span> {c.timing}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editingCenter} onOpenChange={(open) => !open && setEditingCenter(null)}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-xl border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Center Hub</DialogTitle>
          </DialogHeader>
          {editingCenter && (
            <CenterForm 
              initialData={editingCenter} 
              onSubmit={(payload) => updateMutation.mutate({ id: editingCenter.id, payload })} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
