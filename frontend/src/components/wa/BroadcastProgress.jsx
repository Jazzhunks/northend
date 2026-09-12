import { useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

export default function BroadcastProgress({ jobStatus }) {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [jobStatus?.recent_logs]);

  if (!jobStatus) return null;

  const pct = jobStatus.total_rows ? Math.round((jobStatus.processed / jobStatus.total_rows) * 100) : 0;
  const isComplete = jobStatus.status === "completed" || jobStatus.status === "failed";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 rounded-2xl border border-border bg-background/40">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Total</div>
          <div className="text-2xl font-bold">{jobStatus.total_rows || 0}</div>
        </Card>
        <Card className="p-4 rounded-2xl border border-border bg-background/40">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Processed</div>
          <div className="text-2xl font-bold">{jobStatus.processed || 0}</div>
        </Card>
        <Card className="p-4 rounded-2xl border border-border bg-background/40">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Success</div>
          <div className="text-2xl font-bold text-emerald-600">{jobStatus.success || 0}</div>
        </Card>
        <Card className="p-4 rounded-2xl border border-border bg-background/40">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Errors</div>
          <div className="text-2xl font-bold text-rose-600">{jobStatus.errors || 0}</div>
        </Card>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm font-medium">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} className="h-3 rounded-full" />
      </div>

      <Card className="rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-2 border-b border-border text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex justify-between bg-muted/30">
          <span>Activity Log</span>
          <span>{isComplete ? "Finished" : "Live Stream"}</span>
        </div>
        <div
          ref={logRef}
          className="p-4 h-64 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 custom-scrollbar bg-background/20"
        >
          {!jobStatus.recent_logs?.length && (
            <div className="text-muted-foreground italic">Waiting for logs...</div>
          )}
          {jobStatus.recent_logs?.map((log, idx) => (
            <div
              key={idx}
              className={
                log.includes("❌") || log.includes("⚠️")
                  ? "text-rose-600"
                  : log.includes("✅")
                  ? "text-emerald-600"
                  : ""
              }
            >
              <span className="text-muted-foreground/40 mr-2 shrink-0">
                [{new Date().toLocaleTimeString()}]
              </span>
              <span className="break-words">{log}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
