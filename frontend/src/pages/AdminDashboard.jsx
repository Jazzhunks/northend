import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import {
  Search, Menu, X, RefreshCw, BarChart, UserCircle2, Calendar as CalendarIcon,
  GraduationCap, ClipboardList, Trophy, Briefcase, Terminal,
  Building2, MessageSquare, Megaphone, HelpCircle, Bell,
  Users, Image, FileText, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationCenter from "@/components/NotificationCenter.jsx";

import AnalyticsTab      from "./admin/tabs/AnalyticsTab";
import CalendarTab       from "./admin/tabs/CalendarTab";
import CrmTab            from "./admin/tabs/CrmTab";
import EnrollmentsTab    from "./admin/tabs/EnrollmentsTab";
import WathTab           from "./admin/tabs/WathTab";
import ScholarshipsTab   from "./admin/tabs/ScholarshipsTab";
import ChatsTab          from "./admin/tabs/ChatsTab";
import JobAppsTab        from "./admin/tabs/JobAppsTab";
import CoursesTab        from "./admin/tabs/CoursesTab";
import NoticesTab        from "./admin/tabs/NoticesTab";
import JobsTab           from "./admin/tabs/JobsTab";
import CentersTab        from "./admin/tabs/CentersTab";
import TestimonialsTab   from "./admin/tabs/TestimonialsTab";
import ResultsTab        from "./admin/tabs/ResultsTab";
import CampaignsTab      from "./admin/tabs/CampaignsTab";
import InquiriesTab      from "./admin/tabs/InquiriesTab";
import PushTab           from "./admin/tabs/PushTab";
import SchoolVisitsTab   from "./admin/tabs/SchoolVisitsTab";
import SchoolStudentsTab from "./admin/tabs/SchoolStudentsTab";
import GalleryTab        from "./admin/tabs/GalleryTab";
import BlogTab           from "./admin/tabs/BlogTab";

// ─── Side-nav config ────────────────────────────────────────────────────────
const SIDE_NAV = [
  { id: "analytics",       label: "Analytics",      icon: BarChart },
  { id: "crm",             label: "Student CRM",    icon: UserCircle2 },
  { id: "calendar",        label: "Calendar",       icon: CalendarIcon },
  { id: "enrollments",     label: "Enrollments",    icon: ClipboardList },
  { id: "wath",          label: "WATH Management",   icon: Trophy },
  { id: "scholarships",  label: "Scholarships",       icon: GraduationCap },
  { id: "chats",         label: "WhatsApp Inbox",     icon: MessageSquare },
  { id: "jobapps",       label: "Job Applications",   icon: Briefcase },
  { id: "courses",       label: "Course Catalog",     icon: Building2 },
  { id: "notices",       label: "Bulletin Board",     icon: Megaphone },
  { id: "jobs",          label: "Careers Portal",     icon: Briefcase },
  { id: "centers",       label: "Hub Stations",       icon: Building2 },
  { id: "testimonials",  label: "Testimonials",       icon: MessageSquare },
  { id: "results",       label: "Honors Deck",        icon: Trophy },
  { id: "campaigns",     label: "Campaigns",          icon: Megaphone },
  { id: "inquiries",     label: "Inquiries",          icon: HelpCircle },
  { id: "push",          label: "Push Notifications", icon: Bell },
  { id: "school-visits", label: "School Visits",      icon: Building2 },
  { id: "school-students", label: "School Students",  icon: Users },
  { id: "gallery",       label: "Gallery",            icon: Image },
  { id: "blog",          label: "Blog",               icon: FileText },
];

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, testId }) {
  return (
    <div
      className="glass-elevated p-4 sm:p-5 rounded-2xl border border-border bg-background/30 hover:bg-background/40 transition-all min-w-0 flex items-center justify-between"
      data-testid={testId}
    >
      <div className="min-w-0">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold truncate">
          {label}
        </div>
        <div className="font-display text-2xl sm:text-3xl font-medium mt-1 text-foreground truncate">
          {value ?? 0}
        </div>
      </div>
      {Icon && (
        <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-accent shrink-0">
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [innerSearch, setInnerSearch] = useState("");
  const [schKind, setSchKind]         = useState("all");

  const switchTab = (id) => {
    setActiveTab(id);
    setInnerSearch("");
    setSidebarOpen(false);
  };

  return (
    <div
      className="fixed inset-0 isolate w-screen h-[100dvh] min-h-0 flex flex-col lg:flex-row overflow-hidden select-none"
      role="region"
      aria-label="Admin Dashboard"
      style={{
        position: "fixed", inset: 0, width: "100vw", height: "100dvh",
        minHeight: 0, margin: 0, padding: 0, zIndex: 40,
        background: "#ffffff", color: "#3C4952",
        visibility: "visible", opacity: 1, display: "flex",
      }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-muted/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 h-[100dvh] lg:h-full glass-elevated z-50 border-r border-border flex flex-col justify-between shrink-0 overflow-hidden transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="w-full shrink-0 flex flex-col">
          <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold">Northend Group</div>
              <div className="font-display text-lg sm:text-xl font-medium tracking-tight mt-0.5 text-foreground">
                Operations Engine
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground p-1 hover:text-foreground cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-3 sm:p-4 border-b border-border bg-background/40">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold">System Identity</div>
            <div className="font-medium mt-0.5 text-xs sm:text-sm text-foreground">Operations Admin Desk</div>
            <div className="text-[10px] text-accent font-mono mt-0.5 uppercase tracking-wider">LEVEL 0 ROOT ACCESS</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto custom-scrollbar min-h-0">
          {SIDE_NAV.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => switchTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-[0_0_20px_rgba(var(--accent-rgb),0.12)] font-semibold"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon size={16} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border shrink-0 bg-background/40">
          <button
            onClick={() => navigate("/erp")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider text-accent border border-accent/20 bg-accent/5 hover:bg-accent/15 transition duration-200 cursor-pointer"
          >
            <Terminal size={14} className="shrink-0" />
            <span>Launch ERP Hub</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div
        className="relative z-10 flex-1 min-w-0 w-full min-h-0 flex flex-col overflow-hidden"
        style={{ minWidth: 0, minHeight: 0, height: "100%", position: "relative" }}
      >
        {/* Header */}
        <header
          className="relative z-30 shrink-0 px-4 sm:px-8 py-4 sm:py-6 border-b border-border backdrop-blur-md flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3"
          style={{ background: "rgba(255, 255, 255, 0.92)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 border border-border rounded-xl lg:hidden text-foreground hover:bg-muted/50 shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground flex items-center gap-1.5 truncate">
                <span className="w-4 h-px bg-muted-foreground/50 hidden sm:inline-block shrink-0" />
                Analytics Console Matrix
              </div>
              <h2 className="font-display text-xl sm:text-3xl font-light tracking-tight text-foreground truncate">
                Operations <span className="text-accent font-medium italic">Deck.</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80 sm:shrink-0 min-w-0">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={innerSearch}
                onChange={(e) => setInnerSearch(e.target.value)}
                placeholder="Search active tab records..."
                className="w-full pl-9 pr-8 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition text-foreground placeholder:text-muted-foreground/60"
              />
              {innerSearch && (
                <button
                  type="button"
                  onClick={() => setInnerSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <NotificationCenter />
            <Button
              size="icon"
              variant="outline"
              onClick={load}
              disabled={loadingData}
              className="rounded-xl border-border shrink-0 hover:bg-muted/50 cursor-pointer"
              aria-label="Refresh data"
            >
              <RefreshCw size={14} className={loadingData ? "animate-spin" : ""} />
            </Button>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="relative z-10 flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 space-y-6 min-w-0 custom-scrollbar overscroll-contain">
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fadeIn">
            <StatCard label="Pipeline Students"  value={summary.total_students}        icon={GraduationCap} testId="stat-students" />
            <StatCard label="Inbound Admissions" value={summary.total_enrollments}     icon={ClipboardList} testId="stat-enrollments" />
            <StatCard label="Scholarship Drives" value={summary.total_scholarship_apps} icon={Trophy}       testId="stat-sch" />
            <StatCard label="Talent Profiles"    value={summary.total_job_apps}        icon={Briefcase}     testId="stat-jobs" />
          </div>

          {/* Active tab content */}
          <div className="w-full min-w-0">
            {activeTab === "analytics"      && <AnalyticsTab />}
            {activeTab === "crm"            && <CrmTab />}
            {activeTab === "calendar"       && <CalendarTab />}
            {activeTab === "enrollments"    && <EnrollmentsTab    innerSearch={innerSearch} />}
            {activeTab === "chats"          && <ChatsTab          />}
            {activeTab === "wath"           && <WathTab           />}
            {activeTab === "scholarships"   && <ScholarshipsTab innerSearch={innerSearch} />}
            {activeTab === "jobapps"        && <JobAppsTab        innerSearch={innerSearch} />}
            {activeTab === "courses"        && <CoursesTab        innerSearch={innerSearch} />}
            {activeTab === "notices"        && <NoticesTab innerSearch={innerSearch} />}
            {activeTab === "jobs"           && <JobsTab innerSearch={innerSearch} />}
            {activeTab === "centers"        && <CentersTab innerSearch={innerSearch} />}
            {activeTab === "testimonials"   && <TestimonialsTab innerSearch={innerSearch} />}
            {activeTab === "results"        && <ResultsTab innerSearch={innerSearch} />}
            {activeTab === "campaigns"      && <CampaignsTab      />}
            {activeTab === "inquiries"      && <InquiriesTab      />}
            {activeTab === "push"           && <PushTab           />}
            {activeTab === "school-visits"  && <SchoolVisitsTab   />}
            {activeTab === "school-students"&& <SchoolStudentsTab />}
            {activeTab === "gallery"        && <GalleryTab        />}
            {activeTab === "blog"           && <BlogTab           />}
          </div>
        </main>
      </div>
    </div>
  );
}
