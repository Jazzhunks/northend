import { useEffect, useState } from "react";

export default function OpenWA() {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const token = localStorage.getItem("nw_token");
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    fetch("/admin/openwa/api/health", {
      credentials: "include",
      headers,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(() => {
        if (!cancelled) {
          setStatus("ready");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus("error");
          setMessage(err.message || "OpenWA service is unreachable");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
          <p className="text-muted-foreground">Loading OpenWA Dashboard…</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-destructive">OpenWA Dashboard Unavailable</p>
          <p className="text-sm text-muted-foreground">{message}</p>
          <p className="text-xs text-muted-foreground">
            Ensure the OpenWA service is running and reachable at localhost:2785.
          </p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src="/admin/openwa/"
      title="OpenWA Dashboard"
      className="h-[calc(100vh-4rem)] w-full border-0"
      allow="clipboard-write"
    />
  );
}
