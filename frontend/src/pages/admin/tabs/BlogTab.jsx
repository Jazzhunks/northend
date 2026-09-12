import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, Loader2, Eye, ChevronLeft, ChevronRight, PenTool } from "lucide-react";
import BlogPostForm from "../BlogPostForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

export default function BlogTab({ innerSearch }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 25;
  const skip = (page - 1) * limit;

  const [editingPost, setEditingPost] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['posts', { page, innerSearch }],
    queryFn: async () => {
      const res = await api.get('/admin/posts', {
        params: { skip, limit, search: innerSearch || undefined }
      });
      return res.data;
    }
  });

  const posts = data?.items || [];

  const createMutation = useMutation({
    mutationFn: async (payload) => api.post('/admin/posts', payload),
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => api.put(`/admin/posts/${id}`, payload),
    onSuccess: () => {
      toast.success("Post updated successfully");
      setEditingPost(null);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!confirm("Delete this post?")) throw new Error("cancelled");
      return api.delete(`/admin/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (e) => {
      if (e.message !== "cancelled") toast.error(formatError(e.response?.data?.detail) || e.message);
    }
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="font-display font-bold text-xl text-foreground flex items-center gap-2">
        <PenTool size={20} className="text-accent" /> Blog Studio
      </div>
      
      <BlogPostForm onSubmit={(payload) => createMutation.mutate(payload)} />

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : !posts.length ? (
        <EmptyState title="No posts" description="Create your first blog post to get started." />
      ) : (
        <div className="glass border border-border rounded-2xl overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[900px] table-auto">
              <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3 sm:p-4 text-left bg-muted">Title</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Category</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Author</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Status</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Visibility</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Published</th>
                  <th className="p-3 sm:p-4 text-right bg-muted"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground bg-background/20">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-foreground">{p.title}</td>
                    <td className="p-3 sm:p-4 text-muted-foreground">{p.category || "—"}</td>
                    <td className="p-3 sm:p-4 text-muted-foreground">{p.author}</td>
                    <td className="p-3 sm:p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === "published" ? "bg-accent/10 text-accent border border-accent/20" : "bg-muted/50 text-muted-foreground border border-border"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-muted-foreground capitalize">{p.visibility}</td>
                    <td className="p-3 sm:p-4 text-muted-foreground">{p.published_at ? new Date(p.published_at).toLocaleDateString() : "—"}</td>
                    <td className="p-3 sm:p-4 text-right">
                      <div className="inline-flex gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => setEditingPost(p)} className="rounded-xl border-transparent text-primary hover:bg-primary/5 cursor-pointer"><Eye size={14}/></Button>
                        <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(p.id)} className="rounded-xl border-transparent text-rose-600 hover:bg-rose-500/5 cursor-pointer"><Trash2 size={14}/></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
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
      
      {/* Edit Dialog is a simplification, but we can reuse BlogPostForm logic. I'll just use a modal. */}
      {editingPost && (
        <Dialog open={!!editingPost} onOpenChange={(o) => !o && setEditingPost(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Blog Post</DialogTitle></DialogHeader>
            <BlogPostForm 
              initial={editingPost}
              onSubmit={(payload) => updateMutation.mutate({ id: editingPost.id, payload })} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
