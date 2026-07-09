import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================================
  // REFRESH / SESSION VALIDATION CORE LOGIC
  // ============================================================================
  const refresh = useCallback(async () => {
    const token = localStorage.getItem("nw_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Dynamic interceptors in api.js automatically catch this token from localStorage
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
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      
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
    <AuthCtx.Provider value={{ user, loading, login, register, logout, refresh }}>
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