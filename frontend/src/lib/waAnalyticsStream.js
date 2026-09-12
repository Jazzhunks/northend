import { useEffect, useRef, useCallback } from "react";

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function useWAAnalyticsStream(campaignId, onEvent) {
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const stoppedRef = useRef(false);

  const connect = useCallback(() => {
    if (stoppedRef.current || !campaignId || !onEvent) return;
    const url = `${API_BASE}/whatsapp/analytics/stream?campaign_id=${encodeURIComponent(campaignId)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      retryCountRef.current = 0;
    };

    es.addEventListener("job_update", (e) => {
      try {
        const data = JSON.parse(e.data);
        onEvent({ type: "job_update", data });
      } catch (err) {
        // ignore parse errors
      }
    });

    es.addEventListener("job_complete", (e) => {
      try {
        const data = JSON.parse(e.data);
        onEvent({ type: "job_complete", data });
      } catch (err) {
        // ignore
      }
      es.close();
    });

    es.onerror = () => {
      es.close();
      if (!stoppedRef.current) {
        const delay = Math.min(1000 * 2 ** retryCountRef.current, 30000);
        retryCountRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      }
    };
  }, [campaignId, onEvent]);

  useEffect(() => {
    stoppedRef.current = false;
    connect();
    return () => {
      stoppedRef.current = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, [connect]);
}
