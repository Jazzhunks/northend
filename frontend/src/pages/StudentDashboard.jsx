import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Bell, GraduationCap, Wallet } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/enrollments/mine").then(r => setEnrollments(r.data)).catch(()=>{}),
      api.get("/notices").then(r => setNotices(r.data.slice(0, 5))),
    ]);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12" data-testid="student-dashboard">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-2">Student Dashboard</div>
          <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">Hello, {user?.name?.split(" ")[0]}.</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-10">
        {[
          [BookOpen, "Enrollments", enrollments.length],
          [Bell, "Notices", notices.length],
          [GraduationCap, "Mode", "Hybrid"],
          [Wallet, "Fee Status", "—"],
        ].map(([Icon, label, val]) => (
          <div key={label} className="border border-border p-5 rounded-md">
            <Icon className="text-primary mb-2" size={18}/>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
            <div className="font-display text-2xl font-black">{val}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 border border-border rounded-md">
          <div className="p-5 border-b border-border font-display font-bold">My Enrollments</div>
          <div className="divide-y divide-border">
            {enrollments.length === 0 && <div className="p-6 text-sm text-muted-foreground">You don't have any enrollments yet.</div>}
            {enrollments.map(e => (
              <div key={e.id} className="p-5 flex items-center justify-between" data-testid={`enr-row-${e.id}`}>
                <div>
                  <div className="font-bold">{e.center}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">{e.receipt_no}</div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${e.status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{e.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-5 border border-border rounded-md">
          <div className="p-5 border-b border-border font-display font-bold">Latest Notices</div>
          <div className="divide-y divide-border">
            {notices.map(n => (
              <div key={n.id} className="p-5">
                <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary">{n.category}</div>
                <div className="font-bold mt-1">{n.title}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.content}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
