import axios from "axios";
import { toast } from "sonner";

// ============================================================================
// AXIOS CLIENT CONFIGURATION
// ============================================================================

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRedirecting = false;
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const onTokenRefreshFailed = (err) => {
  refreshSubscribers.forEach((cb) => cb(null, err));
  refreshSubscribers = [];
};

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
// RESPONSE INTERCEPTOR: CRASH DEFENSE MATRIX & AUTH MANAGEMENT
// ============================================================================

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Ignore canceled/aborted requests
    if (
      error?.name === "CanceledError" ||
      error?.name === "AbortError" ||
      axios.isCancel(error)
    ) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = error.config?.url || "";

    // 401 — Expired Session / Unauthenticated
    if (status === 401) {
      const originalRequest = error.config;

      if (!originalRequest.headers.Authorization) {
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await api.post("/auth/refresh");
          const newToken = data?.access_token;
          if (newToken) {
            localStorage.setItem("nw_token", newToken);
            onTokenRefreshed(newToken);
          }
        } catch (refreshError) {
          localStorage.removeItem("nw_token");
          onTokenRefreshFailed(refreshError);
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/login") &&
            !isRedirecting
          ) {
            isRedirecting = true;
            window.location.href = "/login?session_expired=true";
          }
          isRefreshing = false;
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }

        const token = localStorage.getItem("nw_token");
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token, err) => {
          if (err) {
            reject(err);
            return;
          }
          if (originalRequest) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    if (
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/login") &&
      !isRedirecting
    ) {
      isRedirecting = true;
      window.location.href = "/login?session_expired=true";
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// FASTAPI / PYDANTIC ERROR FORMATTER
// ============================================================================

export function formatError(error) {
  if (!error) return "An unexpected error occurred.";

  if (error.code === "ERR_NETWORK") {
    return "Network connection error: Unable to reach the backend server.";
  }

  if (error.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  const responseData = error?.response?.data;
  let detail;

  if (typeof error === "string" || Array.isArray(error) || error?.msg) {
    detail = error;
  } else if (typeof responseData === "string") {
    detail = `Server Error (${
      error?.response?.status || "Unknown"
    }): ${responseData.slice(0, 200)}`;
  } else {
    detail =
      responseData?.detail ||
      responseData?.message ||
      responseData?.error ||
      error?.message;
  }

  if (!detail) return "An unexpected application error occurred.";
  if (typeof detail === "string") return detail;

  // Parses FastAPI/Pydantic validation array structures [{ loc, msg }]
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (item && typeof item.msg === "string") {
          const field =
            Array.isArray(item.loc) && item.loc.length > 1
              ? `[${item.loc[item.loc.length - 1]}] `
              : "";
          return `${field}${item.msg}`;
        }
        if (typeof item === "string") return item;
        try {
          return JSON.stringify(item);
        } catch {
          return "Invalid validation error.";
        }
      })
      .join(" • ");
  }

  if (detail && typeof detail.msg === "string") {
    return detail.msg;
  }

  try {
    return JSON.stringify(detail);
  } catch {
    return "Something went wrong while processing the server response.";
  }
}

// ============================================================================
// CORE APPLICATION API METHODS (SERVER 6.PY ENDPOINTS)
// ============================================================================

const resData = (res) => res.data;

export const authAPI = {
  register: (data) => api.post("/auth/register", data).then(resData),
  login: (data) => api.post("/auth/login", data).then(resData),
  logout: () => api.post("/auth/logout").then(resData),
  me: () => api.get("/auth/me").then(resData),
};

export const publicAPI = {
  getStats: () => api.get("/stats").then(resData),
  getFeatured: () => api.get("/featured").then(resData),
  submitContact: (data) => api.post("/contact", data).then(resData),
};

export const coursesAPI = {
  list: (params = {}) => api.get("/courses", { params }).then(resData),
  get: (id) => api.get(`/courses/${id}`).then(resData),
  create: (data) => api.post("/courses", data).then(resData),
  update: (id, data) => api.put(`/courses/${id}`, data).then(resData),
  delete: (id) => api.delete(`/courses/${id}`).then(resData),
};

export const scholarshipsAPI = {
  list: () => api.get("/scholarships").then(resData),
  listAdmin: () => api.get("/admin/scholarships").then(resData),
  create: (data) => api.post("/scholarships", data).then(resData),
  update: (id, data) => api.put(`/scholarships/${id}`, data).then(resData),
  delete: (id) => api.delete(`/scholarships/${id}`).then(resData),
  regenerateToken: (id) =>
    api.post(`/admin/scholarships/${id}/regenerate-token`).then(resData),
  getStats: (id) => api.get(`/scholarships/${id}/stats`).then(resData),
  notifyApplicants: (id) =>
    api.post(`/admin/scholarships/${id}/notify-applicants`).then(resData),
  
  // Results Endpoints
  getResultsTemplateUrl: (id) => `/admin/scholarships/${id}/results-template`,
  uploadBulkResults: (id, formData) =>
    api.post(`/admin/scholarships/${id}/bulk-results`, formData, {
      headers: {},
    }).then(resData),

  // Bulk Registration Endpoints
  getBulkRegisterTemplateUrl: (id) => `/admin/scholarships/${id}/bulk-register-template`,
  uploadBulkRegister: (id, formData) =>
    api.post(`/admin/scholarships/${id}/bulk-register`, formData, {
      headers: {},
    }).then(resData),
};

export const schoolsAPI = {
  uploadStudents: (scholarshipId, formData) =>
    api.post(`/school/upload-students?scholarship_id=${encodeURIComponent(scholarshipId)}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(resData),
  requestVisit: (data) => api.post("/school/visit-request", data).then(resData),
  myVisits: () => api.get("/school/my-visits").then(resData),
  listVisitsAdmin: (params = {}) => api.get("/admin/school-visits", { params }).then(resData),
  updateVisit: (visitId, data) => api.put(`/admin/school-visits/${visitId}`, data).then(resData),
  checkDateAvailability: (date) => api.get(`/admin/school-visits/availability?date=${encodeURIComponent(date)}`).then(resData),
  downloadTemplate: () => api.get("/school/upload-template", { responseType: "blob" }).then(resData),
  listSchoolApplicationsAdmin: (params = {}) => api.get("/admin/school-applications", { params }).then(resData),
};

export const scholarshipApplicationsAPI = {
  apply: (data) => api.post("/scholarship-applications", data).then(resData),
  listAdmin: () => api.get("/scholarship-applications").then(resData),
  getByNo: (appNo, phone) =>
    api
      .get(`/scholarship-applications/${appNo}`, {
        params: phone ? { phone } : {},
      })
      .then(resData),
  updateStatus: (id, status) =>
    api.put(`/scholarship-applications/${id}/status?status=${status}`).then(resData),
  setResult: (id, data) =>
    api.put(`/scholarship-applications/${id}/result`, data).then(resData),
  lookup: (data) => api.post("/scholarship-applications/lookup", data).then(resData),
  mine: () => api.get("/scholarship-applications/mine").then(resData),
  getAdmitCardUrl: (appNo, phone) =>
    `${API_BASE}/scholarship-applications/${appNo}/admit-card${phone ? `?phone=${encodeURIComponent(phone)}` : ""}`,
  getResultCardUrl: (appNo, phone) =>
    `${API_BASE}/scholarship-applications/${appNo}/result-card${
      phone ? `?phone=${encodeURIComponent(phone)}` : ""
    }`,
};

export const attendanceAPI = {
  getCampaign: (token) =>
    api.get("/attendance/campaign", { params: { token } }).then(resData),
  getApplications: (token, venue) =>
    api
      .get("/attendance/applications", { params: { token, venue } })
      .then(resData),
  mark: (data) => api.post("/attendance/mark", data).then(resData),
  exportUrl: (id) => `${API_BASE}/admin/attendance/${id}/export`,
};

export const enrollmentsAPI = {
  create: (data) => api.post("/enrollments", data).then(resData),
  listAdmin: () => api.get("/enrollments").then(resData),
  mine: () => api.get("/enrollments/mine").then(resData),
  updateStatus: (id, status) =>
    api.put(`/enrollments/${id}/status?status=${status}`).then(resData),
};

export const jobsAPI = {
  listActive: () => api.get("/jobs").then(resData),
  listAll: () => api.get("/jobs/all").then(resData),
  create: (data) => api.post("/jobs", data).then(resData),
  update: (id, data) => api.put(`/jobs/${id}`, data).then(resData),
  delete: (id) => api.delete(`/jobs/${id}`).then(resData),
  apply: (data) => api.post("/job-applications", data).then(resData),
  listApplications: () => api.get("/job-applications").then(resData),
  updateApplicationStatus: (id, status) =>
    api.put(`/job-applications/${id}/status?status=${status}`).then(resData),
};

export const noticesAPI = {
  list: () => api.get("/notices").then(resData),
  create: (data) => api.post("/notices", data).then(resData),
  update: (id, data) => api.put(`/notices/${id}`, data).then(resData),
  delete: (id) => api.delete(`/notices/${id}`).then(resData),
};

export const centersAPI = {
  list: () => api.get("/centers").then(resData),
  create: (data) => api.post("/centers", data).then(resData),
  update: (id, data) => api.put(`/centers/${id}`, data).then(resData),
  delete: (id) => api.delete(`/centers/${id}`).then(resData),
};

export const resultsAPI = {
  list: () => api.get("/results").then(resData),
  create: (data) => api.post("/results", data).then(resData),
  update: (id, data) => api.put(`/results/${id}`, data).then(resData),
  delete: (id) => api.delete(`/results/${id}`).then(resData),
};

export const testimonialsAPI = {
  list: () => api.get("/testimonials").then(resData),
  create: (data) => api.post("/testimonials", data).then(resData),
  update: (id, data) => api.put(`/testimonials/${id}`, data).then(resData),
  delete: (id) => api.delete(`/testimonials/${id}`).then(resData),
};

export const galleryAPI = {
  list: () => api.get("/gallery").then(resData),
  listAdmin: () => api.get("/admin/gallery").then(resData),
  create: (data) => api.post("/admin/gallery", data).then(resData),
  update: (id, data) => api.put(`/admin/gallery/${id}`, data).then(resData),
  delete: (id) => api.delete(`/admin/gallery/${id}`).then(resData),
};

export const postsAPI = {
  list: () => api.get("/posts").then(resData),
  get: (slug) => api.get(`/posts/${slug}`).then(resData),
  listAdmin: () => api.get("/admin/posts").then(resData),
  create: (data) => api.post("/admin/posts", data).then(resData),
  update: (id, data) => api.put(`/admin/posts/${id}`, data).then(resData),
  delete: (id) => api.delete(`/admin/posts/${id}`).then(resData),
};

export const adminAPI = {
  getSummary: () => api.get("/admin/summary").then(resData),
  setFeatured: (kind, id) =>
    api.post(`/admin/feature?kind=${kind}&id=${id}`).then(resData),
  getInquiries: () => api.get("/inquiries").then(resData),
  getExportUrl: (kind) => `${API_BASE}/admin/export/${kind}`,
};

export const filesAPI = {
  upload: (formData) =>
    api.post("/upload", formData, {
      headers: {},
    }).then(resData),
  getFileUrl: (fileId) => `${API_BASE}/files/${fileId}`,
};

// Backwards compatibility helper
export async function notifyScholarshipApplicants(scholarshipId) {
  return scholarshipsAPI.notifyApplicants(scholarshipId);
}