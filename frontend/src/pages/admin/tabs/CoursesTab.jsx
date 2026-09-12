import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, AlertCircle, Loader2, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import CourseForm from "../CourseForm";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

export default function CoursesTab({ innerSearch }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 25;
  const skip = (page - 1) * limit;

  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['courses', { page, innerSearch }],
    queryFn: async () => {
      const res = await api.get('/courses', {
        params: { skip, limit, search: innerSearch || undefined }
      });
      return res.data;
    }
  });

  const courses = data?.items || [];

  const createMutation = useMutation({
    mutationFn: async (payload) => api.post('/courses', payload),
    onSuccess: () => {
      toast.success("New course framework deployed");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => api.put(`/courses/${id}`, payload),
    onSuccess: () => {
      toast.success("Course configuration synchronized");
      setEditingCourse(null);
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (e) => toast.error(formatError(e.response?.data?.detail) || e.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!confirm("Delete this course parameter?")) throw new Error("cancelled");
      return api.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (e) => {
      if (e.message !== "cancelled") toast.error(formatError(e.response?.data?.detail) || e.message);
    }
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h3 className="font-display font-medium text-lg sm:text-xl text-foreground flex items-center gap-2">
          <BookOpen size={20} className="text-accent" /> Course Catalog Matrix
        </h3>
        {!editingCourse && !showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer">
            <Plus size={14} className="mr-1.5"/> Add Custom Course
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 border border-border p-4 rounded-2xl bg-background/20">
          <CourseForm 
            onCancel={() => setShowForm(false)} 
            onSave={(payload) => createMutation.mutate(payload)} 
            busy={createMutation.isPending}
          />
        </div>
      )}

      {editingCourse && (
        <div className="mb-6 border border-border p-4 rounded-2xl bg-background/20">
          <CourseForm 
            initial={editingCourse} 
            onCancel={() => setEditingCourse(null)} 
            onSave={(payload) => updateMutation.mutate({ id: editingCourse.id, payload })} 
            busy={updateMutation.isPending}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : !courses.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div key={c.id} className="border border-border bg-background/30 p-4 sm:p-5 rounded-2xl flex flex-col justify-between group hover:border-accent/30 transition duration-300 min-w-0" data-testid={`course-row-${c.id}`}>
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] font-bold text-accent font-mono">{c.category}</div>
                      <h4 className="font-bold text-foreground text-base sm:text-lg break-words mt-1">{c.title}</h4>
                      <div className="text-xs text-muted-foreground font-mono mt-1">{c.duration} · ₹{c.fee?.toLocaleString()}</div>
                    </div>
                    <div className="flex gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" onClick={() => { setEditingCourse(c); setShowForm(false); }} className="rounded-lg text-xs font-bold cursor-pointer">Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(c.id)} className="rounded-lg text-xs text-rose-600 border-transparent hover:border-rose-500/20 hover:bg-rose-500/5 cursor-pointer"><Trash2 size={14}/></Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-1 border-t border-border pt-3">
                  {(c.features || []).slice(0, 3).map((f) => <span key={f} className="text-[10px] uppercase font-bold font-mono tracking-wider bg-muted/50 border border-border px-2.5 py-0.5 rounded-md text-muted-foreground">{f}</span>)}
                </div>
              </div>
            ))}
          </div>
          
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
