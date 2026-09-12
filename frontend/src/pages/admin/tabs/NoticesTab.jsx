import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, AlertCircle, Loader2, Pencil, Megaphone } from "lucide-react";
import NoticeForm from "../NoticeForm";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

export default function NoticesTab({ innerSearch }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const { data: noticesData, isLoading } = useQuery({
    queryKey: ['notices', { innerSearch }],
    queryFn: async () => {
      const res = await api.get('/notices', { params: { search: innerSearch || undefined } });
      return res.data;
    }
  });

  const notices = noticesData?.items || [];

  const createMutation = useMutation({
    mutationFn: async (payload) => api.post('/notices', payload),
    onSuccess: () => {
      toast.success("Notice posted successfully");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => api.put(`/notices/${id}`, payload),
    onSuccess: () => {
      toast.success("Notice updated successfully");
      setEditingNotice(null);
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!confirm("Delete this notice?")) throw new Error("cancelled");
      return api.delete(`/notices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (e) => {
      if (e.message !== "cancelled") toast.error(formatError(e.response?.data?.detail) || e.message);
    }
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, isFeatured }) => {
      if (isFeatured) return api.post(`/admin/feature?kind=clear&id=none`);
      return api.post(`/admin/feature?kind=notice&id=${id}`);
    },
    onSuccess: (_, { isFeatured }) => {
      toast.success(isFeatured ? "Removed from homepage" : "Promoted to homepage");
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display font-medium text-lg sm:text-xl text-foreground flex items-center gap-2">
          <Megaphone size={20} className="text-accent" /> Bulletin Board
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl">
          <Plus size={14} className="mr-1.5" /> Post Notice
        </Button>
      </div>

      {showForm && (
        <div className="glass border border-border p-4 sm:p-6 rounded-2xl bg-background/20 mb-6">
          <NoticeForm onSubmit={(payload) => createMutation.mutate(payload)} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : !notices.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {notices.map((n) => (
            <div key={n.id} className={`border ${n.is_featured ? "border-accent ring-1 ring-accent/20 bg-accent/[0.01]" : "border-border bg-background/30"} p-4 rounded-2xl flex items-center justify-between gap-4 transition-all hover:bg-muted/50`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-xs uppercase tracking-[0.18em] font-bold text-accent font-mono">{n.category}</div>
                  {n.pinned && <span className="text-[9px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/20">Pinned</span>}
                  {n.is_featured && <span className="text-[9px] uppercase font-bold tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded">★ Featured</span>}
                </div>
                <div className="font-bold text-foreground text-base truncate">{n.title}</div>
                <div className="text-sm text-muted-foreground line-clamp-1 mt-1">{n.content}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button 
                  size="sm" 
                  variant={n.is_featured ? "default" : "outline"} 
                  onClick={() => toggleFeatureMutation.mutate({ id: n.id, isFeatured: n.is_featured })} 
                  className="rounded-xl text-[10px] uppercase font-bold cursor-pointer h-8"
                >
                  {n.is_featured ? "Demote" : "Feature"}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setEditingNotice(n)} className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg">
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(n.id)} className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg border-transparent">
                  <Trash2 size={14}/>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editingNotice} onOpenChange={(open) => !open && setEditingNotice(null)}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-xl border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
          </DialogHeader>
          {editingNotice && (
            <NoticeForm 
              initialData={editingNotice} 
              onSubmit={(payload) => updateMutation.mutate({ id: editingNotice.id, payload })} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
