import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Scholarship() {
  const [campaigns, setCampaigns] = useState([]);
  const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", school: "", standard: "", target_exam: "NEET", city: "" });
  const [calc, setCalc] = useState({ marks: "" });

  useEffect(() => { api.get("/scholarships").then(r => setCampaigns(r.data)); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/scholarship-applications", form);
      setSubmitted(data);
      toast.success("Application submitted! Save your application number.");
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail));
    }
  };

  const pct = calc.marks ? Math.min(Math.max(Math.round((Number(calc.marks) / 100) * 100), 0), 100) : 0;
  const scholarshipPct = pct >= 90 ? 100 : pct >= 80 ? 75 : pct >= 70 ? 50 : pct >= 60 ? 25 : pct >= 50 ? 10 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16" data-testid="scholarship-page">
      <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Scholarship Portal</div>
      <h1 className="font-display text-4xl lg:text-6xl font-black tracking-tighter">Up to <span className="text-accent">100% off</span><br/>on tuition fees.</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-3xl">Take the Northend Scholarship Test (NST) and unlock partial to full scholarships across all our programmes.</p>

      <div className="grid lg:grid-cols-12 gap-8 mt-12">
        <div className="lg:col-span-5 space-y-6">
          {campaigns.map(s => (
            <div key={s.id} className="border border-border p-6 rounded-md bg-background" data-testid={`campaign-${s.id}`}>
              <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary">{s.active ? "Live now" : "Closed"}</div>
              <h3 className="font-display text-xl font-bold mt-1">{s.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{s.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="border-t border-border pt-3"><div className="text-muted-foreground text-xs">Exam date</div><div className="font-mono">{s.exam_date}</div></div>
                <div className="border-t border-border pt-3"><div className="text-muted-foreground text-xs">Deadline</div><div className="font-mono">{s.deadline}</div></div>
              </div>
            </div>
          ))}

          <div className="border border-border p-6 rounded-md bg-secondary/40">
            <div className="font-display font-bold text-lg mb-3">Scholarship Calculator</div>
            <p className="text-sm text-muted-foreground mb-3">Enter your last academic year percentage to estimate your scholarship.</p>
            <Input type="number" placeholder="e.g. 85" value={calc.marks} onChange={e => setCalc({ marks: e.target.value })} data-testid="calc-input"/>
            <div className="mt-4 p-4 bg-primary text-primary-foreground rounded-md">
              <div className="text-xs uppercase tracking-[0.18em] text-accent">Estimated Scholarship</div>
              <div className="font-display text-4xl font-black mt-1" data-testid="calc-result">{scholarshipPct}%</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {submitted ? (
            <div className="border border-primary p-8 rounded-md bg-primary/5" data-testid="submission-success">
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Application Received</div>
              <h3 className="font-display text-3xl font-black mt-2">Save your application number</h3>
              <div className="font-mono text-2xl mt-4 p-4 bg-background border border-border rounded-md">{submitted.application_no}</div>
              <p className="text-sm text-muted-foreground mt-4">Your admit card will be available for download 3 days before the exam. We'll also send updates via WhatsApp on your registered number.</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <a href={`${process.env.REACT_APP_BACKEND_URL}/api/scholarship-applications/${submitted.application_no}/admit-card`} target="_blank" rel="noreferrer">
                  <Button className="bg-primary text-primary-foreground" data-testid="download-admit-card">Download Admit Card (PDF)</Button>
                </a>
                <Button onClick={() => setSubmitted(null)} variant="outline" data-testid="another-app-btn">Submit another</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="border border-border p-8 rounded-md space-y-4 bg-background">
              <h3 className="font-display text-2xl font-bold mb-2">Scholarship Application</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required data-testid="sch-name"/>
                <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required data-testid="sch-email"/>
                <Input placeholder="Phone (10-digit)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required data-testid="sch-phone"/>
                <Input placeholder="School / college" value={form.school} onChange={e => setForm({...form, school: e.target.value})} required data-testid="sch-school"/>
                <Input placeholder="Standard / Class" value={form.standard} onChange={e => setForm({...form, standard: e.target.value})} required data-testid="sch-standard"/>
                <Input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required data-testid="sch-city"/>
                <select className="border border-border rounded-md px-3 py-2 bg-background sm:col-span-2" value={form.target_exam} onChange={e => setForm({...form, target_exam: e.target.value})} data-testid="sch-target">
                  {["NEET","IIT-JEE","Foundation","CBSE","JKBOSE"].map(x => <option key={x}>{x}</option>)}
                </select>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground h-12" data-testid="sch-submit">Submit Application</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
