import { useEffect, useRef } from "react";
import { api } from "../lib/api";

const PING_INTERVAL_MS = 30 * 60 * 1000;

export function useSessionKeepAlive() {
  const timerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("nw_token");
    if (!token) return;

    const ping = async () => {
      try {
        await api.get("/auth/me");
      } catch (err) {
        if (err?.response?.status === 401) {
          localStorage.removeItem("nw_token");
          window.location.href = "/login?session_expired=true";
        }
      }
    };

    const start = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(ping, PING_INTERVAL_MS);
    };

    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    if (document.visibilityState === "visible") {
      ping();
      start();
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        ping();
        start();
      } else {
        stop();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
}
