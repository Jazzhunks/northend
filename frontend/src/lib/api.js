import axios from "axios";
import { toast } from "sonner"; // Fully imported and mapped to system alerts

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://nexed-neet.preview.emergentagent.com";
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 15000, 
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// ============================================================================
// REQUEST INTERCEPTOR: DYNAMIC TOKEN ATTACHMENT
// ============================================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nw_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================================
// RESPONSE INTERCEPTOR: COMPONENT-INTELLIGENT CRASH DEFENSE MATRIX
// ============================================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // --- CASE 401: AUTOMATED EXPIRED SESSION PURGE ---
    if (status === 401) {
      localStorage.removeItem("nw_token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?session_expired=true";
      }
      return Promise.reject(error);
    }

    // --- CASE 403: INTELLIGENT COMPONENT SAFELOCK ---
    if (status === 403) {
      const serverFeedbackMessage = error.response?.data?.detail;
      let displayWarning = "Access Denied: Your account role does not possess clearance for this operation.";

      if (typeof serverFeedbackMessage === "string") {
        displayWarning = serverFeedbackMessage;
      } else if (serverFeedbackMessage && typeof serverFeedbackMessage.msg === "string") {
        displayWarning = serverFeedbackMessage.msg;
      }

      // Safe invocation with unified alert IDs to prevent toast spamming
      toast.error(`Clearance Restriction: ${displayWarning}`, {
        id: "rbac-clearance-guard-toast", 
        duration: 5000,
      });

      // DYNAMIC OBJECT VS ARRAY DETECTOR: Evaluates what structure the component expects.
      // Plural endpoints expect arrays to prevent '.map is not a function' crashes.
      const isListEndpoint = 
        url.includes("/students") || 
        url.includes("/payments") || 
        url.includes("/expenses") || 
        url.includes("/leads") || 
        url.includes("/staff") ||
        url.includes("/erpattendance") || 
        url.includes("/branches") ||
        url.includes("/audit");

      const fallbackPayload = isListEndpoint ? [] : {};

      // Resolve smoothly to prevent uncaught runtime errors entirely
      return Promise.resolve({ data: fallbackPayload });
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// PYDANTIC / FASTAPI RESPONSE ERROR FORMATTER
// ============================================================================
export function formatError(error) {
  const data = error?.response?.data;
  const detail = data?.detail || data?.message || error?.message || error;

  if (!detail) return "An unexpected network execution boundary fault occurred.";
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        if (e && typeof e.msg === "string") {
          const field = e.loc && e.loc.length > 1 ? `[${e.loc[1]}] ` : "";
          return `${field}${e.msg}`;
        }
        return typeof e === "string" ? e : JSON.stringify(e);
      })
      .join(" • ");
  }

  if (detail && typeof detail.msg === "string") return detail.msg;

  return "Something went wrong within application endpoint interfaces.";
}