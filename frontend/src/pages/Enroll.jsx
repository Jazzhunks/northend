import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import GlassPanel from "@/components/GlassPanel";
import { CTAPrimary } from "@/components/Cinematic";
import { api, formatError } from "@/lib/api";
import FileUpload from "@/components/FileUpload";

export default function Enroll() {
  const [params] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [centers, setCenters] = useState([]);
  const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState({
    course_id: params.get("course") || "",
    name: "", email: "", phone: "", address: "", center: "", id_proof_url: "",
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
  }, [courses, centers, form.course_id, form.center]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/enrollments", form);
      setSubmitted(data);
      toast.success("Enrollment received!");
    } catch (e) { toast.error(formatError(e.response?.data?.detail)); }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition";

  return (
    <div data-testid="enroll-page">
      <PageHero
        eyebrow="Enrollment"
        title="Two minutes to"
        accent="your seat."
        subtitle="Submit this form and our admissions team will reach out within 24 hours with batch details and fee plans."
      />
      <section className="relative pb-24 -mt-8">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          {submitted ? (
            <GlassPanel elevated className="p-8" data-testid="enroll-success">
              <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">Enrollment received</div>
              <h3 className="font-display text-3xl font-medium mt-3">Receipt: <span className="font-mono text-accent">{submitted.receipt_no}</span></h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Status: <b className="text-foreground capitalize">{submitted.status}</b>. We'll call you on {submitted.phone}.</p>
              <button onClick={() => setSubmitted(null)} className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-accent hover:underline">Submit another →</button>
            </GlassPanel>
          ) : (
            <GlassPanel elevated className="p-7" as="form" onSubmit={submit}>
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required data-testid="enr-name"/>
                  <input className={inputCls} type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required data-testid="enr-email"/>
                  <input className={inputCls} placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required data-testid="enr-phone"/>
                  <input className={inputCls} placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required data-testid="enr-address"/>
                  <select className={inputCls} value={form.course_id} onChange={e => setForm({...form, course_id: e.target.value})} data-testid="enr-course">
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                  <select className={inputCls} value={form.center} onChange={e => setForm({...form, center: e.target.value})} data-testid="enr-center">
                    {centers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="pt-2">
                  <label className="text-[10px] uppercase tracking-[0.22em] font-bold text-muted-foreground mb-2 block">ID Proof (optional)</label>
                  <FileUpload label="Upload Aadhaar / school ID (PDF / image)" testId="enr-id-upload"
                    onUploaded={(f)=>setForm({...form, id_proof_url: f?.url || ""})}/>
                </div>
              </div>
              <div className="mt-5">
                <CTAPrimary type="submit" className="w-full justify-center" data-testid="enr-submit">Submit enrollment</CTAPrimary>
              </div>
            </GlassPanel>
          )}
        </div>
      </section>
    </div>
  );
}
