import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Scholarship from "@/pages/Scholarship";
import WATH from "@/pages/WATH";
import Enroll from "@/pages/Enroll";
import Jobs from "@/pages/Jobs";
import Centers from "@/pages/Centers";
import Results from "@/pages/Results";
import Notices from "@/pages/Notices";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import StudentDashboard from "@/pages/StudentDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Examiner from "@/pages/Examiner";
import Privacy from "@/pages/Privacy";

// --- ERP Console Infrastructure Imports ---
import ErpLayout from "@/pages/erp/ErpLayout";
import ErpDashboard from "@/pages/erp/ErpDashboard";
import ErpStudents from "@/pages/erp/ErpStudents";
import ErpStudentDetail from "@/pages/erp/ErpStudentDetail";
import ErpPayments from "@/pages/erp/ErpPayments";
import ErpExpenses from "@/pages/erp/ErpExpenses";
import ErpLeads from "@/pages/erp/ErpLeads";
import ErpStaff from "@/pages/erp/ErpStaff";
import ErpBranches from "@/pages/erp/ErpBranches";
import ErpAudit from "@/pages/erp/ErpAudit";
import ErpIdCards from "@/pages/erp/ErpIdCards";       // Added ID card generation module
import ErpAttendance from "@/pages/erp/ErpAttendance";   

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/examiner" element={<Examiner />} />
          
          {/* ============================================================================
              ERP CONSOLE SUB-ROUTES (STAFF / COMPLIANCE ENVIRONMENT LOGIC)
              ============================================================================ */}
          <Route path="/erp" element={<ErpLayout />}>
            <Route index element={<ErpDashboard />} />
            <Route path="students" element={<ErpStudents />} />
            <Route path="students/:id" element={<ErpStudentDetail />} />
            <Route path="payments" element={<ErpPayments />} />
            <Route path="expenses" element={<ErpExpenses />} />
            <Route path="leads" element={<ErpLeads />} />
            <Route path="staff" element={<ErpStaff />} />
            <Route path="branches" element={<ErpBranches />} />
            <Route path="audit" element={<ErpAudit />} />
            
            {/* New Automation & Credential Features Fixed Elements Mapping */}
            <Route path="erpidcards" element={<ErpIdCards />} />
            <Route path="erpattendance" element={<ErpAttendance />} />
          </Route>

          {/* ============================================================================
              PUBLIC MARKETING APP & STUDENT LIFE PORTAL TRACKS
              ============================================================================ */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/scholarship" element={<Scholarship />} />
            <Route path="/wath" element={<WATH />} />
            <Route path="/enroll" element={<Enroll />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/centers" element={<Centers />} />
            <Route path="/results" element={<Results />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Authenticated Student/Admin Profile Nodes */}
            <Route path="/dashboard" element={<Protected><StudentDashboard /></Protected>} />
            <Route path="/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
            
            {/* Universal Fallback Direct Catch */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}