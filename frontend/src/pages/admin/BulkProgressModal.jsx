import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

function BulkProgressModal({ isOpen, onClose, state }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2147483648] flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md glass-elevated border border-border bg-background p-6 rounded-3xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            {state.status === "uploading" || state.status === "processing" ? (
              <Loader2 className="animate-spin text-accent" size={20} />
            ) : state.status === "completed" ? (
              <CheckCircle2 className="text-emerald-600" size={20} />
            ) : (
              <AlertCircle className="text-rose-600" size={20} />
            )}
            <h3 className="font-display font-medium text-lg text-foreground">
              {state.title || "Bulk Batch Processing"}
            </h3>
          </div>
          {state.status !== "uploading" && state.status !== "processing" && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">{state.currentStep}</span>
              <span className="text-accent font-bold">{state.progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden border border-border">
              <div 
                className="h-full bg-accent transition-all duration-300 ease-out" 
                style={{ width: `${state.progress}%` }} 
              />
            </div>
          </div>

          <div className="glass p-4 rounded-xl border border-border bg-background/30 text-xs font-mono space-y-2 text-muted-foreground">
            {state.details?.map((line, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span>{line.label}</span>
                <span className="font-bold text-foreground">{line.value}</span>
              </div>
            ))}
          </div>

          {state.status === "completed" && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 text-xs text-center font-medium animate-fadeIn">
              ✓ Process completed successfully!
            </div>
          )}

          {state.error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 text-xs text-center font-medium animate-fadeIn">
              {state.error}
            </div>
          )}
        </div>

        {(state.status === "completed" || state.status === "error") && (
          <Button 
            onClick={onClose} 
            className="w-full bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider py-2.5"
          >
            Acknowledge &amp; Close
          </Button>
        )}
      </div>
    </div>
  );
}

export default BulkProgressModal;
