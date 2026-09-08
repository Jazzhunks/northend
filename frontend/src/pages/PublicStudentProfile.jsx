import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { api, API_BASE } from "@/lib/api";
import { formatError } from "@/lib/api";

export default function PublicStudentProfile() {
  const { enrollment_number } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    api.get(`/erp/public/student-profile/${encodeURIComponent(enrollment_number)}${token ? `?token=${encodeURIComponent(token)}` : ""}`)
      .then(r => setStudent(r.data))
      .catch(e => {
        toast.error(formatError(e) || "Failed to load student profile");
      })
      .finally(() => setLoading(false));
  }, [enrollment_number]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-20 text-center animate-pulse">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-muted-foreground text-xs font-mono tracking-wider uppercase">Loading Student Profile...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-muted-foreground text-sm">Student profile not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-fadeIn">
      <div className="glass-elevated rounded-2xl p-6 border border-border">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-muted shrink-0">
            {student.photo_url ? (
              <img src={student.photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Photo</div>
            )}
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent font-mono">{student.student_no}</div>
            <h1 className="font-display text-3xl font-medium tracking-tight text-foreground">{student.full_name}</h1>
            <p className="text-muted-foreground text-sm">
              {student.course_title && <span>{student.course_title}</span>}
              {student.batch && <span className="pl-2 font-mono">Batch: {student.batch}</span>}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">LUID</div>
            <div className="text-sm mt-0.5 font-medium text-foreground">{student.luid || "—"}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Enrollment Number</div>
            <div className="text-sm mt-0.5 font-medium text-foreground">{student.enrollment_number || "—"}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Contact</div>
            <div className="text-sm mt-0.5 font-medium text-foreground">{student.contact_phone || "—"}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Branch</div>
            <div className="text-sm mt-0.5 font-medium text-foreground">{student.branch_name || "—"}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Address</div>
            <div className="text-sm mt-0.5 font-medium text-foreground">{student.address || "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
