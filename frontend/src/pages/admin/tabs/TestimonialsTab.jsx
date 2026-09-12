import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, AlertCircle, Loader2, Pencil, MessageSquareQuote } from "lucide-react";
import TestimonialForm from "../TestimonialForm";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

export default function TestimonialsTab({ innerSearch }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ['testimonials', { innerSearch }],
    queryFn: async () => {
      const res = await api.get('/testimonials', { params: { search: innerSearch || undefined } });
      return res.data;
    }
  });

  const testimonials = testimonialsData?.items || [];

  const createMutation = useMutation({
    mutationFn: async (payload) => api.post('/testimonials', payload),
    onSuccess: () => {
      toast.success("Testimonial record created");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => api.put(`/testimonials/${id}`, payload),
    onSuccess: () => {
      toast.success("Testimonial record updated");
      setEditingTestimonial(null);
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!confirm("Delete this Testimonial?")) throw new Error("cancelled");
      return api.delete(`/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
    onError: (e) => {
      if (e.message !== "cancelled") toast.error(formatError(e.response?.data?.detail) || e.message);
    }
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, isFeatured }) => {
      if (isFeatured) return api.post(`/admin/feature?kind=clear&id=none`);
      return api.post(`/admin/feature?kind=testimonial&id=${id}`);
    },
    onSuccess: (_, { isFeatured }) => {
      toast.success(isFeatured ? "Removed from homepage" : "Promoted to homepage");
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display font-medium text-lg sm:text-xl text-foreground flex items-center gap-2">
          <MessageSquareQuote size={20} className="text-accent" /> Word of Mouth
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl">
          <Plus size={14} className="mr-1.5" /> Post Review
        </Button>
      </div>

      {showForm && (
        <div className="glass border border-border p-4 sm:p-6 rounded-2xl bg-background/20 mb-6">
          <TestimonialForm onSubmit={(payload) => createMutation.mutate(payload)} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : !testimonials.length ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className={`glass border p-5 rounded-2xl flex flex-col justify-between transition-all hover:bg-muted/50 ${t.is_featured ? 'border-accent ring-1 ring-accent/20 bg-accent/[0.01]' : 'border-border bg-background/30'}`}>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-foreground text-lg">{t.name}</div>
                      {t.is_featured && <span className="text-[9px] uppercase font-bold tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded">★ Featured</span>}
                    </div>
                    <div className="text-xs font-mono uppercase tracking-widest text-accent">{t.role}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingTestimonial(t)} className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg">
                      <Pencil size={12} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(t.id)} className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg">
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-4">"{t.quote}"</p>
              </div>
              <div className="border-t border-border pt-3 mt-auto">
                <Button 
                  size="sm" 
                  variant={t.is_featured ? "default" : "outline"} 
                  onClick={() => toggleFeatureMutation.mutate({ id: t.id, isFeatured: t.is_featured })} 
                  className="rounded-xl text-[10px] uppercase font-bold tracking-wider h-7"
                >
                  {t.is_featured ? "Demote" : "Feature"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editingTestimonial} onOpenChange={(open) => !open && setEditingTestimonial(null)}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-xl border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>
          {editingTestimonial && (
            <TestimonialForm 
              initialData={editingTestimonial} 
              onSubmit={(payload) => updateMutation.mutate({ id: editingTestimonial.id, payload })} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
