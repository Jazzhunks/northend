import { useRef, useState } from "react";
import { Upload, CheckCircle2, X, Loader2, AlertCircle } from "lucide-react";
import { api, formatError, API_BASE } from "@/lib/api";
import { toast } from "sonner";

export default function FileUpload({ label = "Upload file", accept = "application/pdf,image/jpeg,image/png,image/webp", onUploaded, value, testId = "file-upload" }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState(value || null);
  const [error, setError] = useState(null);

  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) {
      toast.error("File too large (max 50 MB)");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": undefined } });
      console.log("[FileUpload] upload response", data);
      const baseUrl = API_BASE.replace(/\/api$/, "");
      const rawUrl = data?.url || "";
      const fullUrl = rawUrl ? (rawUrl.startsWith("http") ? rawUrl : `${baseUrl}${rawUrl}`) : "";
      if (!fullUrl) {
        throw new Error("Upload response missing file url");
      }
      const obj = { id: data.id, url: fullUrl, name: data.original_filename || f.name };
      setInfo(obj);
      onUploaded?.(obj);
      toast.success("Uploaded!");
    } catch (err) {
      console.error("[FileUpload] upload failed", err);
      const msg = formatError(err.response?.data?.detail) || err.message || "Upload failed";
      setError(msg);
      toast.error(msg);
      setInfo(null);
      onUploaded?.(null);
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
    <div className="border border-dashed border-border rounded-md p-3 bg-secondary/30" data-testid={testId}>
      <input ref={ref} type="file" accept={accept} onChange={pick} className="hidden" data-testid={`${testId}-input`} />
      {info ? (
        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2 text-primary truncate">
            <CheckCircle2 size={16} />
            <a href={info.url} target="_blank" rel="noreferrer" className="truncate underline">{info.name}</a>
          </div>
          <button type="button" onClick={clear} className="text-muted-foreground hover:text-destructive" data-testid={`${testId}-clear`}><X size={16} /></button>
        </div>
      ) : error ? (
        <div className="text-sm text-rose-600 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span className="break-all">{error}</span>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} disabled={busy}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary py-2"
          data-testid={`${testId}-btn`}>
          {busy ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          {busy ? "Uploading…" : label}
        </button>
      )}
      <div className="text-[11px] text-muted-foreground mt-1">PDF / JPG / PNG / WEBP / MP4 / WEBM / MOV · max 50 MB</div>
    </div>
  );
}
