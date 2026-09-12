import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './queryClient';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useOneSignal } from "@/hooks/useOneSignal";
import ScrollToTop from "@/components/ScrollToTop";
import Layout from "@/components/Layout";
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Courses = lazy(() => import('@/pages/Courses'));
const CourseDetail = lazy(() => import('@/pages/CourseDetail'));
const Scholarship = lazy(() => import('@/pages/Scholarship'));
const ScholarshipApply = lazy(() => import('@/pages/ScholarshipApply'));
const ScholarshipResult = lazy(() => import('@/pages/ScholarshipResult'));
const WATH = lazy(() => import('@/pages/WATH'));
const Enroll = lazy(() => import('@/pages/Enroll'));
const Jobs = lazy(() => import('@/pages/Jobs'));
const Centers = lazy(() => import('@/pages/Centers'));
const Results = lazy(() => import('@/pages/Results'));
const Notices = lazy(() => import('@/pages/Notices'));
const Contact = lazy(() => import('@/pages/Contact'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const StudentDashboard = lazy(() => import('@/pages/StudentDashboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const CarnivalDashboard = lazy(() => import('@/pages/CarnivalDashboard'));
const ScholarshipDashboard = lazy(() => import('@/pages/ScholarshipDashboard'));
const CampaignFormPage = lazy(() => import('@/pages/CampaignFormPage'));
const SchoolDashboard = lazy(() => import('@/pages/SchoolDashboard'));
const AdminSchoolVisits = lazy(() => import('@/pages/AdminSchoolVisits'));
const Examiner = lazy(() => import('@/pages/Examiner'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const PublicStudentProfile = lazy(() => import('@/pages/PublicStudentProfile'));

// --- ERP Console Infrastructure Imports ---
const ErpLayout = lazy(() => import('@/pages/erp/ErpLayout'));
const ErpDashboard = lazy(() => import('@/pages/erp/ErpDashboard'));
const ErpStudents = lazy(() => import('@/pages/erp/ErpStudents'));
const ErpStudentDetail = lazy(() => import('@/pages/erp/ErpStudentDetail'));
const ErpPayments = lazy(() => import('@/pages/erp/ErpPayments'));
const ErpExpenses = lazy(() => import('@/pages/erp/ErpExpenses'));
const ErpLeads = lazy(() => import('@/pages/erp/ErpLeads'));
const ErpStaff = lazy(() => import('@/pages/erp/ErpStaff'));
const ErpBranches = lazy(() => import('@/pages/erp/ErpBranches'));
const ErpAudit = lazy(() => import('@/pages/erp/ErpAudit'));
const ErpIdCards = lazy(() => import('@/pages/erp/ErpIdCards'));       
const ErpAttendance = lazy(() => import('@/pages/erp/ErpAttendance'));   
const ErpWhatsApp = lazy(() => import('@/pages/erp/ErpWhatsApp'));

import { ERP_ROLES, ADMIN_ONLY, SCHOOL_ONLY } from "@/lib/roles";

function Protected({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  // Hard role array checking loop architecture
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function OneSignalBridge() {
  useOneSignal();
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <OneSignalBridge />
        <Toaster position="top-right" richColors />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-muted-foreground">Loading…</div></div>}>
          <Routes>
            <Route path="/examiner" element={<Examiner />} />
            
            {/* ============================================================================
                ERP CONSOLE SUB-ROUTES (SECURED VIA ARRAYS OF ENTERPRISE ROLES)
                ============================================================================ */}
            <Route 
              path="/erp" 
              element={
                <Protected allowedRoles={ERP_ROLES}>
                  <ErpLayout />
                </Protected>
              }
            >
              <Route index element={<ErpDashboard />} />
              <Route path="students" element={<ErpStudents />} />
              <Route path="students/:id" element={<ErpStudentDetail />} />
              <Route path="payments" element={<ErpPayments />} />
              <Route path="expenses" element={<ErpExpenses />} />
              <Route path="leads" element={<ErpLeads />} />
              <Route path="staff" element={<ErpStaff />} />
              <Route path="branches" element={<ErpBranches />} />
              <Route path="audit" element={<ErpAudit />} />
              <Route path="erpidcards" element={<ErpIdCards />} />
              <Route path="erpattendance" element={<ErpAttendance />} />
              <Route path="whatsapp" element={<ErpWhatsApp />} />
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
              <Route path="/scholarship/:slug/apply" element={<ScholarshipApply />} />
              <Route path="/scholarship/result" element={<ScholarshipResult />} />
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
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/gallery" element={<Gallery />} />
              
              {/* Unprotected Public Scholarship Dashboards */}
              <Route path="/scholarships/:id/dashboard" element={<ScholarshipDashboard />} />
              <Route path="/admin/scholarships/:id/dashboard" element={<ScholarshipDashboard />} />

              {/* Authenticated Student/Admin Profile Nodes */}
              <Route path="/dashboard" element={<Protected><StudentDashboard /></Protected>} />
              <Route path="/school-dashboard" element={<Protected allowedRoles={SCHOOL_ONLY}><SchoolDashboard /></Protected>} />
              <Route path="/admin" element={<Protected allowedRoles={ADMIN_ONLY}><AdminDashboard /></Protected>} />
              <Route path="/admin/school-visits" element={<Protected allowedRoles={ADMIN_ONLY}><AdminSchoolVisits /></Protected>} />
              <Route path="/admin/carnivals/:id/dashboard" element={<Protected allowedRoles={ADMIN_ONLY}><CarnivalDashboard /></Protected>} />
              <Route path="/admin/campaigns/new" element={<Protected allowedRoles={ADMIN_ONLY}><CampaignFormPage /></Protected>} />
              <Route path="/admin/campaigns/:id/edit" element={<Protected allowedRoles={ADMIN_ONLY}><CampaignFormPage /></Protected>} />
              
              {/* Universal Fallback Direct Catch */}
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="student-profile/:enrollment_number" element={<PublicStudentProfile />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}