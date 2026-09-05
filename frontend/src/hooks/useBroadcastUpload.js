import { useCallback, useState } from "react";
import { toast } from "sonner";
import { waAPI } from "@/lib/api";

export function useBroadcastUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const upload = useCallback(async (file) => {
    setUploading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const data = await waAPI.uploadContacts(fd);
      setResult(data);
      if (data.warnings && data.warnings.length > 0) {
        data.warnings.forEach((w) => toast.warning(w));
      }
      toast.success(`Imported ${data.contacts_imported} contacts`);
      return data;
    } catch (e) {
      const msg = e.response?.data?.detail || e.message || "Upload failed";
      toast.error(msg);
      throw e;
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploading, result, upload };
}
