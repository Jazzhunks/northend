import { api } from "./api";

export const erp = {
  me: () => api.get("/erp/me").then(r => r.data),
  meta: () => api.get("/erp/meta").then(r => r.data),

  // branches
  listBranches: () => api.get("/erp/branches").then(r => r.data),
  updateBranch: (id, body) => api.patch(`/erp/branches/${id}`, body).then(r => r.data),

  // staff
  listStaff: (branch_id) => api.get("/erp/staff", { params: branch_id ? { branch_id } : {} }).then(r => r.data),
  createStaff: (body) => api.post("/erp/staff", body).then(r => r.data),
  updateStaff: (id, body) => api.patch(`/erp/staff/${id}`, body).then(r => r.data),
  deactivateStaff: (id) => api.delete(`/erp/staff/${id}`).then(r => r.data),

  // students
  listStudents: (params = {}) => api.get("/erp/students", { params }).then(r => r.data),
  getStudent: (id) => api.get(`/erp/students/${id}`).then(r => r.data),
  createStudent: (body) => api.post("/erp/students", body).then(r => r.data),
  updateStudent: (id, body) => api.patch(`/erp/students/${id}`, body).then(r => r.data),
  studentStatement: (id) => api.get(`/erp/students/${id}/statement`).then(r => r.data),

  // payments
  listPayments: (params = {}) => api.get("/erp/payments", { params }).then(r => r.data),
  createPayment: (body) => api.post("/erp/payments", body).then(r => r.data),

  // expenses
  listExpenses: (params = {}) => api.get("/erp/expenses", { params }).then(r => r.data),
  createExpense: (body) => api.post("/erp/expenses", body).then(r => r.data),
  decideExpense: (id, body) => api.post(`/erp/expenses/${id}/decision`, body).then(r => r.data),

  // leads
  listLeads: (params = {}) => api.get("/erp/leads", { params }).then(r => r.data),
  createLead: (body) => api.post("/erp/leads", body).then(r => r.data),
  updateLead: (id, body) => api.patch(`/erp/leads/${id}`, body).then(r => r.data),

  // dashboards
  superDashboard: () => api.get("/erp/dashboard/super").then(r => r.data),
  branchDashboard: (branch_id) => api.get(`/erp/dashboard/branch/${branch_id}`).then(r => r.data),

  // audit
  audit: (params = {}) => api.get("/erp/audit", { params }).then(r => r.data),
};

export const isSuper = (user) => user?.role === "super_admin" || user?.role === "admin";
export const isManagerPlus = (user) => isSuper(user) || user?.role === "center_manager";
export const isFinance = (user) => isManagerPlus(user) || user?.role === "accountant";
export const canSeeStaff = isManagerPlus;
export const isERPUser = (user) => ["super_admin", "admin", "center_manager", "accountant", "counsellor"].includes(user?.role);

export const fmtINR = (n) => {
  const v = Number(n || 0);
  return "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

export const fmtDate = (s) => {
  if (!s) return "—";
  try { return new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return s; }
};
