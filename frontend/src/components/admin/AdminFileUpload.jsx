import { useState } from "react";
import { Upload, CheckCircle2, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminFileUpload({
  label = "Upload file",
  accept,
  onUploaded,
  value,
  error: errorProp,
  id,
  testId = "admin-file-upload",
  className,
  ...props
}) {
  const inputId = id || props.name || testId;
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState(value || null);
  const [error, setError] = useState(errorProp || null);
  const ref = { current: null };

  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (accept) {
      const allowed = accept.split(",").map((s) => s.trim());
      const typeOk = allowed.includes(f.type) || allowed.some((a) => a === "*/*");
      if (!typeOk) {
        setError(`Unsupported file type: ${f.type}. Allowed: ${accept}`);
        return;
      }
    }
    setBusy(true);
    setError(null);
    try {
      const obj = { id: crypto.randomUUID(), url: URL.createObjectURL(f), name: f.name };
      setInfo(obj);
      onUploaded?.(obj);
    } catch {
      setError("Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  const clear = () => {
    setInfo(null);
    setError(null);
    onUploaded?.(null);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={`${inputId}-input`} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div
        className={cn(
          "rounded-xl border border-dashed border-border bg-secondary/30 p-4 transition-colors",
          error && "border-rose-500"
        )}
        data-testid={testId}
      >
        <input
          ref={ref}
          id={`${inputId}-input`}
          type="file"
          accept={accept}
          onChange={pick}
          className="hidden"
          data-testid={`${testId}-input`}
        />
        {info ? (
          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 text-primary truncate">
              <CheckCircle2 size={16} />
              {info.url.startsWith("blob:") ? (
                <span className="truncate">{info.name}</span>
              ) : (
                <a href={info.url} target="_blank" rel="noreferrer" className="truncate underline">{info.name}</a>
              )}
            </div>
            <button type="button" onClick={clear} className="text-muted-foreground hover:text-destructive" data-testid={`${testId}-clear`}>
              <X size={16} />
            </button>
          </div>
        ) : error ? (
          <div className="text-sm text-rose-600 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span className="break-all">{error}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={busy}
            className="w-full flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary py-4 transition-colors"
            data-testid={`${testId}-btn`}
          >
            {busy ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            {busy ? "Uploading…" : "Drop a file here or click to browse"}
          </button>
        )}
      </div>
      {(errorProp || error) && <p className="text-xs text-rose-600" role="alert">{errorProp || error}</p>}
    </div>
  );
}
