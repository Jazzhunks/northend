import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, formatError } from "../lib/api";
import { useSessionKeepAlive } from "../hooks/useSessionKeepAlive";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useSessionKeepAlive();

  // ============================================================================
  // REFRESH / SESSION VALIDATION CORE LOGIC
  // ============================================================================
  const refresh = useCallback(async () => {
    const token = localStorage.getItem("nw_token");
    // Supporting dual-mode parsing until backend switches fully to cookie sessions
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch (err) {
      console.error("Session verification fallback triggered:", err);
      localStorage.removeItem("nw_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- CROSS-TAB BROADCAST SYNCHRONIZATION MATRIX ---
  useEffect(() => {
    refresh();

    const handleStorageSync = (e) => {
      if (e.key === "nw_token") {
        setLoading(true);
        refresh();
      }
    };

    window.addEventListener("storage", handleStorageSync);
    return () => window.removeEventListener("storage", handleStorageSync);
  }, [refresh]);

  // ============================================================================
  // AUTHENTICATION INTERACTION MUTATORS
  // ============================================================================
  const login = async (email, password, options = {}) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password }, {
        signal: options.signal // Wire upstream controller cancellation signals
      });
      
      if (data?.access_token) {
        localStorage.setItem("nw_token", data.access_token);
      }
      
      setUser(data.user);
      return data.user;
    } catch (err) {
      localStorage.removeItem("nw_token");
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      
      if (data?.access_token) {
        localStorage.setItem("nw_token", data.access_token);
      }
      
      setUser(data.user);
      return data.user;
    } catch (err) {
      localStorage.removeItem("nw_token");
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { 
      await api.post("/auth/logout"); 
    } catch (e) { 
      console.warn("Server-side token revocation fallback sequence logs:", e); 
    } finally {
      localStorage.removeItem("nw_token");
      setUser(null);
    }
  };

  return (
    // Provided formatError securely to Context value object mapping
    <AuthCtx.Provider value={{ user, loading, login, register, logout, refresh, formatError }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error("useAuth hook must be evaluated strictly inside an AuthProvider wrapper element");
  }
  return context;
};