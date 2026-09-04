import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function AdminForm({ title, subtitle, onSubmit, onCancel, submitLabel = "Save", busy = false, error: errorBanner, children, className, ...props }) {
  const [error, setError] = React.useState(errorBanner || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit?.(e);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <Card className={cn("rounded-2xl border bg-background/20 backdrop-blur-md", className)} {...props}>
      {(title || subtitle) && (
        <CardHeader className="pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          {title && <CardTitle className="text-base sm:text-lg font-display font-medium">{title}</CardTitle>}
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </CardHeader>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className={cn("p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4", !title && "pt-4 sm:pt-5")}>
          {error && (
            <div className="col-span-full flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
              <span>{error}</span>
            </div>
          )}
          {children}
        </CardContent>
        {(onSubmit || onCancel) && (
          <div className="flex items-center justify-end gap-2 px-4 sm:px-6 pb-4 sm:pb-5 pt-0">
            {onCancel && (
              <button type="button" onClick={onCancel} className="rounded-xl border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-muted transition-colors cursor-pointer">
                Cancel
              </button>
            )}
            {onSubmit && (
              <button type="submit" disabled={busy} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer">
                {busy ? "Saving…" : submitLabel}
              </button>
            )}
          </div>
        )}
      </form>
    </Card>
  );
}

export { AdminForm };
