import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, Eye, Image, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import GalleryForm from "../GalleryForm";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

export default function GalleryTab({ innerSearch }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 25;
  const skip = (page - 1) * limit;

  const [newGallery, setNewGallery] = useState({ title:"", description:"", media_type:"image", media_url:"", category:"", order:0 });
  const [editingGalleryId, setEditingGalleryId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', { page, innerSearch }],
    queryFn: async () => {
      const res = await api.get('/admin/gallery', {
        params: { skip, limit, search: innerSearch || undefined }
      });
      return res.data;
    }
  });

  const galleryItems = data?.items || [];

  const createMutation = useMutation({
    mutationFn: async (payload) => api.post('/admin/gallery', payload),
    onSuccess: () => {
      toast.success("Gallery item added");
      setNewGallery({ title:"", description:"", media_type:"image", media_url:"", category:"", order:0 });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => api.put(`/admin/gallery/${id}`, payload),
    onSuccess: () => {
      toast.success("Gallery item updated");
      setEditingGalleryId(null);
      setNewGallery({ title:"", description:"", media_type:"image", media_url:"", category:"", order:0 });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!confirm("Delete this gallery item?")) throw new Error("cancelled");
      return api.delete(`/admin/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (e) => {
      if (e.message !== "cancelled") toast.error(formatError(e.response?.data?.detail) || e.message);
    }
  });

  // Extract unique categories for form autocomplete, just from current page is fine since we have paginated.
  // We can fetch a list of all categories if needed, but for now we just map what's visible.
  const galleryCategories = useMemo(() => {
    const cats = Array.from(new Set(galleryItems.map(x => x.category || "Uncategorised")));
    if (!cats.includes("Uncategorised")) cats.push("Uncategorised");
    return cats;
  }, [galleryItems]);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="font-display font-bold text-xl text-foreground">Gallery Studio</div>
      
      <GalleryForm
        onSubmit={(payload) => createMutation.mutate(payload)}
        onUpdate={(id, payload) => updateMutation.mutate({ id, payload })}
        editingId={editingGalleryId}
        galleryCategories={galleryCategories}
        previewMediaUrl={newGallery.media_url}
        mediaType={newGallery.media_type}
        onMediaTypeChange={(val) => setNewGallery({...newGallery, media_type: val})}
        onMediaUrlClear={() => setNewGallery({...newGallery, media_url: ""})}
      />

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : !galleryItems.length ? (
        <EmptyState title="No gallery items" description="Add your first image, video, or paragraph to get started." />
      ) : (
        <div className="space-y-6">
          {galleryCategories.map((cat) => {
            const items = galleryItems.filter(x => x.category === cat || (!x.category && cat === "Uncategorised"));
            if (items.length === 0) return null;
            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-medium">{cat}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{items.length} items</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="border border-border bg-background/30 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="aspect-video rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center">
                        {item.media_type === "video" && item.media_url ? (
                          <video src={item.media_url} controls className="w-full h-full object-cover" />
                        ) : item.media_type === "text" ? (
                          <p className="text-xs text-muted-foreground p-3 line-clamp-4 whitespace-pre-wrap">{item.description || item.title}</p>
                        ) : item.media_url ? (
                          <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <Image size={32} className="text-muted-foreground/40" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm">{item.title}</div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">{item.media_type} {item.category ? `· ${item.category}` : ""}</div>
                      </div>
                      <div className="flex justify-end pt-2 border-t border-border">
                        <div className="inline-flex gap-1.5">
                          <Button size="sm" variant="outline" onClick={() => { setEditingGalleryId(item.id); setNewGallery(item); }} className="rounded-xl border-transparent text-primary hover:bg-primary/5 cursor-pointer"><Eye size={14}/></Button>
                          <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(item.id)} className="rounded-xl border-transparent text-rose-600 hover:bg-rose-500/5 cursor-pointer"><Trash2 size={14}/></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

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
