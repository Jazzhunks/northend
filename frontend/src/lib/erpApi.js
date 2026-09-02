import { api } from "./api";

// 1. DRY Data Extractor: Saves you from typing `.then(r => r.data)` on basic handshakes.
const resData = (res) => res.data;

export const erp = {
  // --- Auth & Meta ---
  me: () => api.get("/erp/me").then(resData),
  meta: () => api.get("/erp/meta").then(resData),

  // ============================================================================
  // ATTENDANCE MODULE ENDPOINTS (SYNCHRONIZED WITH ERPATTENDANCE SUITE)
  // ============================================================================
  
  /**
   * Fetches historical check-in record lists filterable by branch parameters.
   */
  listAttendanceLogs: (params = {}) => api.get("/erp/erpattendance", { params }).then(resData),
  
  /**
   * Dispatches hardware scanner string tokens down to the verification engine.
   * @param {Object} body - { student_no: "NES-SRI-0001", device_signature: "GATE-01" }
   */
  submitAttendanceScan: (body) => api.post("/erp/erpattendance/scan", body).then(resData),
  
  /**
   * Injects an immediate forced state logging bypass into the branch registry ledger.
   * @param {Object} body - { student_id: "uuid-string", status: "present" | "late" }
   */
  submitManualAttendanceOverride: (body) => api.post("/erp/erpattendance/override", body).then(resData),
  
  /**
   * Instantiates an active Server-Sent Events (SSE) stream client connection string.
   * Appends active authorization token inside URL query params to bypass native client limitations.
   * Guarantees an absolute protocol string path fallback to satisfy native browser handshakes.
   */
  getAttendanceStreamUrl: (branchId) => {
    const token = localStorage.getItem("nw_token");
    const baseEndpoint = api.defaults.baseURL;
    return `${baseEndpoint}/erp/erpattendance/stream/${encodeURIComponent(branchId)}?token=${encodeURIComponent(token)}`;
  },

  // --- Branches ---
  listBranches: () => api.get("/erp/branches").then(resData),
  updateBranch: (id, body) => api.patch(`/erp/branches/${encodeURIComponent(id)}`, body).then(resData),

  // --- Staff ---
  listStaff: (branch_id) => api.get("/erp/staff", { params: branch_id ? { branch_id } : {} }).then(resData),
  createStaff: (body) => api.post("/erp/staff", body).then(resData),
  updateStaff: (id, body) => api.patch(`/erp/staff/${encodeURIComponent(id)}`, body).then(resData),
  deactivateStaff: (id) => api.delete(`/erp/staff/${encodeURIComponent(id)}`).then(resData),

  // --- Students (MULTIPART / FORM-DATA TRAFFIC COMPLIANT) ---
  listStudents: (params = {}) => api.get("/erp/students", { params }).then(resData),
  getStudent: (id) => api.get(`/erp/students/${encodeURIComponent(id)}`).then(resData),
  
  /**
   * Accepts both direct JSON payloads and standard binary payload objects seamlessly.
   * @param {FormData | Object} body - Binary multipart compiler fields context.
   */
  createStudent: (body) => {
    const isFormData = body instanceof FormData;
    return api.post("/erp/students", body, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    }).then(resData);
  },
  
  updateStudent: (id, body) => {
    const isFormData = body instanceof FormData;
    return api.patch(`/erp/students/${encodeURIComponent(id)}`, body, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    }).then(resData);
  },
  
  studentStatement: (id) => api.get(`/erp/students/${encodeURIComponent(id)}/statement`).then(resData),

  // --- Payments ---
  listPayments: (params = {}) => api.get("/erp/payments", { params }).then(resData),
  createPayment: (body) => api.post("/erp/payments", body).then(resData),

  // --- Expenses ---
  listExpenses: (params = {}) => api.get("/erp/expenses", { params }).then(resData),
  createExpense: (body) => api.post("/erp/expenses", body).then(resData),
  decideExpense: (id, body) => api.post(`/erp/expenses/${encodeURIComponent(id)}/decision`, body).then(resData),

  // --- Leads ---
  listLeads: (params = {}) => api.get("/erp/leads", { params }).then(resData),
  createLead: (body) => api.post("/erp/leads", body).then(resData),
  updateLead: (id, body) => api.patch(`/erp/leads/${encodeURIComponent(id)}`, body).then(resData),

  // --- Dashboards ---
  superDashboard: () => api.get("/erp/dashboard/super").then(resData),
  branchDashboard: (branch_id) => api.get(`/erp/dashboard/branch/${encodeURIComponent(branch_id)}`).then(resData),

  // --- Audit ---
  audit: (params = {}) => api.get("/erp/audit", { params }).then(resData),
};

// ============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC) SYSTEM HELPERS
// ============================================================================

export const isSuper = (user) => user?.role === "super_admin" || user?.role === "admin";
export const isManagerPlus = (user) => isSuper(user) || user?.role === "center_manager";
export const isFinance = (user) => isManagerPlus(user) || user?.role === "accountant";
export const canSeeStaff = isManagerPlus;

// Grants accountants explicit permission privileges to write and manage student records
export const canManageStudents = (user) => isSuper(user) || user?.role === "center_manager" || user?.role === "accountant";

const ERP_ROLES = new Set(["super_admin", "admin", "center_manager", "accountant", "counsellor"]);
export const isERPUser = (user) => ERP_ROLES.has(user?.role);

// ============================================================================
// LOCALIZED FORMATTING UTILITY MATRIX
// ============================================================================

/**
 * Formats a number securely into Indian Rupees (INR) with native comma spacing patterns
 */
export const fmtINR = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return "₹0.00";
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Safely formats an ISO timestamp string into localized Indian date notations (e.g., 25 May 2026)
 */
export const fmtDate = (s, includeTime = false) => {
  if (!s) return "—";
  try {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
    return new Intl.DateTimeFormat("en-IN", options).format(new Date(s));
  } catch {
    return String(s);
  }
};