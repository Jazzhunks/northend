import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Enroll() {
  const [params] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [centers, setCenters] = useState([]);
  const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState({
    course_id: params.get("course") || "",
    name: "", email: "", phone: "", address: "", center: "",
  });

  useEffect(() => {
    Promise.all([
      api.get("/courses").then(r => setCourses(r.data)),
      api.get("/centers").then(r => setCenters(r.data)),
    ]);
  }, []);

  useEffect(() => {
    if (!form.course_id && courses.length) setForm(f => ({ ...f, course_id: courses[0].id }));
    if (!form.center && centers.length) setForm(f => ({ ...f, center: centers[0].name }));
  }, [courses, centers]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/enrollments", form);
      setSubmitted(data);
      toast.success("Enrollment received!");
    } catch (e) { toast.error(formatError(e.response?.data?.detail)); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16" data-testid="enroll-page">
      <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Enrollment</div>
      <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">Two minutes to your seat.</h1>
      <p className="mt-3 text-muted-foreground">Submit this form and our admissions team will reach out within 24 hours.</p>

      {submitted ? (
        <div className="mt-10 border border-primary p-8 rounded-md bg-primary/5" data-testid="enroll-success">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Enrollment received</div>
          <h3 className="font-display text-2xl font-black mt-2">Receipt: <span className="font-mono">{submitted.receipt_no}</span></h3>
          <p className="text-sm text-muted-foreground mt-3">Status: <span className="font-bold text-foreground">{submitted.status}</span>. We'll call you on {submitted.phone}.</p>
          <Button className="mt-4" variant="outline" onClick={() => setSubmitted(null)}>Submit another</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-10 border border-border p-8 rounded-md space-y-4 bg-background">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required data-testid="enr-name"/>
            <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required data-testid="enr-email"/>
            <Input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required data-testid="enr-phone"/>
            <Input placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required data-testid="enr-address"/>
            <select className="border border-border rounded-md px-3 py-2 bg-background" value={form.course_id} onChange={e => setForm({...form, course_id: e.target.value})} data-testid="enr-course">
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <select className="border border-border rounded-md px-3 py-2 bg-background" value={form.center} onChange={e => setForm({...form, center: e.target.value})} data-testid="enr-center">
              {centers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground h-12" data-testid="enr-submit">Submit Enrollment</Button>
        </form>
      )}
    </div>
  );
}
