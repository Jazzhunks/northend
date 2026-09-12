import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export function useWathPage() {
  const [pageState, setPageState] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = (silent = false) => {
    if (!silent) setLoading(true);
    api.get("/wath/page")
      .then(r => setPageState(r.data || null))
      .catch(() => { if (!silent) setPageState(null); })
      .finally(() => { if (!silent) setLoading(false); });
  };
  
  useEffect(() => { load(); }, []);

  return { pageState, loading, load };
}
