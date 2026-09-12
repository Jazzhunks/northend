import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

export default function SchoolStudentsTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scholarshipFilter, setScholarshipFilter] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (scholarshipFilter) params.scholarship_id = scholarshipFilter;
      if (schoolFilter) params.school_id = schoolFilter;
      const { data } = await api.get("/admin/school-applications", { params });
      setRows(data || []);
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to load school applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [scholarshipFilter, schoolFilter]);

  const exportCsv = () => {
    if (!rows.length) return;
    const headers = ["Application No", "Name", "Phone", "Email", "School", "Class", "Course", "Campaign", "Status", "Date"];
    const csv = [
      headers.join(","),
      ...rows.map(r => [
        r.application_no, r.name, r.phone, r.email, r.school_name || r.school, r.standard, r.target_exam, r.scholarship_title || r.scholarship_id, r.status, r.created_at
      ].map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "school_applications.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="font-display font-medium text-lg sm:text-xl text-foreground truncate">School-Registered Students</h3>
        <div className="flex items-center gap-2">
          <input placeholder="Filter by school ID" value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)} className="border border-border rounded-lg px-3 py-2 bg-background text-xs" />
          <Button size="sm" variant="outline" onClick={exportCsv} disabled={!rows.length} className="rounded-lg text-xs font-bold cursor-pointer">Export CSV</Button>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-muted-foreground py-12">Loading...</div>
      ) : rows.length === 0 ? (
        <EmptyState title="No school applications" description="Students uploaded via school portal will appear here." />
      ) : (
        <div className="glass border border-border rounded-2xl overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[900px] table-auto">
              <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3 sm:p-4 text-left bg-muted">App No</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Name</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Phone</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">School</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Class</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Course</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Campaign</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Status</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground bg-background/20">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-3 sm:p-4 font-mono text-xs">{r.application_no}</td>
                    <td className="p-3 sm:p-4 font-medium">{r.name}</td>
                    <td className="p-3 sm:p-4 text-muted-foreground font-mono text-xs">{r.phone}</td>
                    <td className="p-3 sm:p-4 text-xs">{r.school_name || r.school || "-"}</td>
                    <td className="p-3 sm:p-4 text-xs">{r.standard}</td>
                    <td className="p-3 sm:p-4 text-xs">{r.target_exam}</td>
                    <td className="p-3 sm:p-4 text-xs truncate max-w-[200px]" title={r.scholarship_title || r.scholarship_id}>{r.scholarship_title || r.scholarship_id}</td>
                    <td className="p-3 sm:p-4 text-xs capitalize">{r.status}</td>
                    <td className="p-3 sm:p-4 text-xs text-muted-foreground">{r.created_at ? new Date(r.created_at).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

