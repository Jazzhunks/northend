import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/FileUpload";
import { MapPin, Briefcase } from "lucide-react";

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

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16" data-testid="jobs-page">
      <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Careers</div>
      <h1 className="font-display text-4xl lg:text-6xl font-black tracking-tighter">Build Kashmir's future, with us.</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">Open positions across academics, operations and business development.</p>

      <div className="grid lg:grid-cols-12 gap-8 mt-12">
        <div className="lg:col-span-7 space-y-3">
          {jobs.map(j => (
            <div key={j.id} className="border border-border p-6 rounded-md cursor-pointer hover:border-primary/40" onClick={() => { setActive(j); setDone(false); }} data-testid={`job-${j.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg">{j.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Briefcase size={14}/>{j.department}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/>{j.location}</span>
                    <span className="px-2 py-0.5 text-xs bg-secondary rounded">{j.type}</span>
                  </div>
                </div>
                <Button size="sm" className="bg-primary text-primary-foreground" data-testid={`apply-${j.id}`}>Apply</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">{j.description}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">
          {!active ? (
            <div className="border border-dashed border-border p-8 rounded-md text-center text-muted-foreground">Select a position to apply.</div>
          ) : done ? (
            <div className="border border-primary p-6 rounded-md bg-primary/5" data-testid="job-success">
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Application sent</div>
              <h3 className="font-display text-2xl font-black mt-2">Thanks, {form.name}.</h3>
              <p className="text-sm text-muted-foreground mt-2">We'll review your application for <b>{active.title}</b> and reach out shortly.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="border border-border p-6 rounded-md space-y-3 bg-background">
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Apply for</div>
              <div className="font-display text-xl font-bold">{active.title}</div>
              <Input placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required data-testid="job-name"/>
              <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required data-testid="job-email"/>
              <Input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required data-testid="job-phone"/>
              <Input placeholder="Highest qualification" value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} required data-testid="job-qual"/>
              <Input placeholder="Years of experience" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} required data-testid="job-exp"/>
              <Input placeholder="Subject expertise (if any)" value={form.subject_expertise} onChange={e => setForm({...form, subject_expertise: e.target.value})} data-testid="job-subject"/>
              <Input placeholder="Preferred location" value={form.preferred_location} onChange={e => setForm({...form, preferred_location: e.target.value})} required data-testid="job-loc"/>
              <div>
                <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-2 block">Resume (PDF preferred)</label>
                <FileUpload label="Upload resume" accept="application/pdf,image/jpeg,image/png" testId="job-resume-upload"
                  onUploaded={(f)=>setForm({...form, resume_url: f?.url || ""})}/>
              </div>
              <textarea className="w-full border border-border rounded-md px-3 py-2 bg-background min-h-24" placeholder="Short cover letter" value={form.cover_letter} onChange={e => setForm({...form, cover_letter: e.target.value})} data-testid="job-cover"/>
              <Button type="submit" className="w-full bg-primary text-primary-foreground" data-testid="job-submit">Submit Application</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
