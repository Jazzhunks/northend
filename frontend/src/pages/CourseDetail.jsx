import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Users, Award } from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const [c, setC] = useState(null);

  useEffect(() => {
    api.get(`/courses/${id}`).then(r => setC(r.data)).catch(()=>setC(false));
  }, [id]);

  if (c === null) return <div className="p-12 text-muted-foreground">Loading…</div>;
  if (!c) return <div className="p-12">Course not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12" data-testid="course-detail">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">{c.category}</div>
          <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter mt-2">{c.title}</h1>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{c.description}</p>

          {c.image_url && <div className="mt-8 rounded-md overflow-hidden border border-border aspect-[16/9]"><img src={c.image_url} alt={c.title} className="w-full h-full object-cover"/></div>}

          <div className="mt-10">
            <h3 className="font-display font-bold text-xl mb-4">Syllabus highlights</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {c.syllabus.map(s => <li key={s} className="flex items-center gap-2 text-sm"><CheckCircle2 size={16} className="text-primary"/>{s}</li>)}
            </ul>
          </div>

          {c.features?.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display font-bold text-xl mb-4">What you get</h3>
              <div className="flex flex-wrap gap-2">
                {c.features.map(f => <span key={f} className="px-3 py-1 bg-accent/15 border border-accent/30 rounded-md text-sm">{f}</span>)}
              </div>
            </div>
          )}

          <div className="mt-10">
            <h3 className="font-display font-bold text-xl mb-4">Faculty</h3>
            <div className="flex flex-wrap gap-2">
              {c.faculty.map(f => <span key={f} className="px-3 py-1 border border-border rounded-md text-sm">{f}</span>)}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start">
          <div className="border border-border rounded-md p-6 bg-secondary/30">
            <div className="font-display text-3xl font-black text-primary">₹{c.fee.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total programme fee</div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2"><Clock size={16} className="text-primary"/><span className="text-muted-foreground">Duration:</span> <span className="font-medium ml-auto">{c.duration}</span></div>
              <div className="flex items-center gap-2"><Users size={16} className="text-primary"/><span className="text-muted-foreground">Mentors:</span> <span className="font-medium ml-auto">{c.faculty.length}+</span></div>
              <div className="flex items-center gap-2"><Award size={16} className="text-primary"/><span className="text-muted-foreground">Scholarship:</span> <span className="font-medium ml-auto">{c.scholarship_available ? "Available" : "Not available"}</span></div>
            </div>

            <Link to={`/enroll?course=${c.id}`}><Button className="w-full mt-6 bg-primary text-primary-foreground h-12" data-testid="enroll-btn">Enroll Now</Button></Link>
            <Link to="/contact"><Button variant="outline" className="w-full mt-2" data-testid="demo-btn">Book Demo Class</Button></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
