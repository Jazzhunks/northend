import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import GlassPanel from "@/components/GlassPanel";
import { Reveal, CTAPrimary } from "@/components/Cinematic";
import { api, formatError } from "@/lib/api";
import FileUpload from "@/components/FileUpload";
import { MapPin, Briefcase, ArrowRight } from "@phosphor-icons/react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ name:"", email:"", phone:"", qualification:"", experience:"", subject_expertise:"", preferred_location:"", cover_letter:"", resume_url:"" });
  const [done, setDone] = useState(false);

  useEffect(() => { api.get("/jobs").then(r => setJobs(r.data)); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/job-applications", { ...form, job_id: active.id });
      setDone(true);
      toast.success("Application submitted!");
    } catch (e) { toast.error(formatError(e.response?.data?.detail)); }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition";

  return (
    <div data-testid="jobs-page">
      <PageHero
        eyebrow="Careers"
        title="Build Kashmir's"
        accent="future, with us."
        subtitle="Open positions across academics, operations and business development. We hire for excellence, intent and integrity."
      />

      <section className="relative pb-24 -mt-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            {jobs.map((j, i) => (
              <Reveal key={j.id} delay={i * 0.04}>
                <GlassPanel
                  className={`p-6 lg:p-7 cursor-pointer transition-all hover:-translate-y-0.5 ${active?.id === j.id ? "border-accent/50 glow-primary" : ""}`}
                  onClick={() => { setActive(j); setDone(false); }}
                  data-testid={`job-${j.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl lg:text-2xl font-medium">{j.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                        <span className="flex items-center gap-1.5"><Briefcase weight="duotone" size={14}/>{j.department}</span>
                        <span className="flex items-center gap-1.5"><MapPin weight="duotone" size={14}/>{j.location}</span>
                        <span className="px-2 py-0.5 rounded-full glass text-[10px] uppercase tracking-wider">{j.type}</span>
                      </div>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-[0.18em] text-accent flex items-center gap-1.5 whitespace-nowrap" data-testid={`apply-${j.id}`}>
                      Apply <ArrowRight weight="bold" size={12}/>
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{j.description}</p>
                </GlassPanel>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            {!active ? (
              <GlassPanel className="p-10 text-center border-dashed">
                <p className="text-muted-foreground">Select a position to apply.</p>
              </GlassPanel>
            ) : done ? (
              <GlassPanel elevated className="p-8" data-testid="job-success">
                <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">Application sent</div>
                <h3 className="font-display text-3xl font-medium mt-3">Thanks, {form.name}.</h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">We'll review your application for <b className="text-foreground">{active.title}</b> and reach out shortly.</p>
              </GlassPanel>
            ) : (
              <GlassPanel elevated className="p-7" as="form" onSubmit={submit}>
                <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">Apply for</div>
                <div className="font-display text-2xl font-medium mt-1 mb-5">{active.title}</div>
                <div className="space-y-3">
                  <input className={inputCls} placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required data-testid="job-name"/>
                  <input className={inputCls} type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required data-testid="job-email"/>
                  <input className={inputCls} placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required data-testid="job-phone"/>
                  <input className={inputCls} placeholder="Highest qualification" value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} required data-testid="job-qual"/>
                  <input className={inputCls} placeholder="Years of experience" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} required data-testid="job-exp"/>
                  <input className={inputCls} placeholder="Subject expertise (if any)" value={form.subject_expertise} onChange={e => setForm({...form, subject_expertise: e.target.value})} data-testid="job-subject"/>
                  <input className={inputCls} placeholder="Preferred location" value={form.preferred_location} onChange={e => setForm({...form, preferred_location: e.target.value})} required data-testid="job-loc"/>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.22em] font-bold text-muted-foreground mb-2 block">Resume (PDF)</label>
                    <FileUpload label="Upload resume" accept="application/pdf,image/jpeg,image/png" testId="job-resume-upload"
                      onUploaded={(f)=>setForm({...form, resume_url: f?.url || ""})}/>
                  </div>
                  <textarea className={`${inputCls} min-h-24`} placeholder="Short cover letter" value={form.cover_letter} onChange={e => setForm({...form, cover_letter: e.target.value})} data-testid="job-cover"/>
                </div>
                <div className="mt-5">
                  <CTAPrimary type="submit" className="w-full justify-center" data-testid="job-submit">Submit application</CTAPrimary>
                </div>
              </GlassPanel>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
