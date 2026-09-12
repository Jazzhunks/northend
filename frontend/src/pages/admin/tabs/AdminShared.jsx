import React, { useState } from "react";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";

export function StatCard({ label, value, icon: Icon, testId }) {
  return (
    <div className="glass-elevated p-4 sm:p-5 rounded-2xl border border-border bg-background/30 hover:bg-background/40 transition-all min-w-0 flex items-center justify-between" data-testid={testId}>
      <div className="min-w-0">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold truncate">{label}</div>
        <div className="font-display text-2xl sm:text-3xl font-medium mt-1 text-foreground truncate">{value ?? 0}</div>
      </div>
      {Icon && (
        <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-accent shrink-0">
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}

export function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

export function ExportBtn({ kind }) {
  const [loading, setLoading] = useState(false);
  const dl = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/export/${kind}`, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; 
      a.download = `${kind}.xlsx`; 
      a.click(); 
      URL.revokeObjectURL(url);
    } catch (e) { 
      toast.error(formatError(e.response?.data?.detail) || e.message); 
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button size="sm" variant="outline" onClick={dl} disabled={loading} data-testid={`export-${kind}`} className="border-border rounded-xl text-xs px-2.5 sm:px-3 shrink-0 hover:bg-muted/50">
      {loading ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Download size={14} className="mr-1 sm:mr-1.5"/>} Excel
    </Button>
  );
}
