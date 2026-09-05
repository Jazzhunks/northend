import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Loader2, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHero from "@/components/PageHero";

const CLASSES = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11 (NEET)", "Class 11 (IIT-JEE)", "Class 12 (NEET)", "Class 12 (IIT-JEE)", "Dropper (NEET)", "Dropper (IIT-JEE)"];
const GENDERS = ["Male", "Female", "Other"];
const DISTRICTS = [
  "Anantnag", "Bandipora", "Baramulla", "Budgam", "Ganderbal", "Kulgam", "Kupwara", "Pulwama", "Shopian", "Srinagar",
  "Doda", "Jammu", "Kathua", "Kishtwar", "Poonch", "Rajouri", "Ramban", "Reasi", "Samba", "Udhampur",
  "Kargil", "Leh", "Other"
];

export default function ScholarshipApply() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", school: "", standard: "", target_exam: "NEET",
    city: "", venue: "", address: "", district: "", father_name: "", gender: "", dob: "",
  });

  useEffect(() => {
    setLoading(true);
    api.get(`/scholarships/${slug}`)
      .then(r => setCampaign(r.data))
      .catch(e => toast.error(formatError(e.response?.data?.detail) || "Failed to load campaign"))
      .finally(() => setLoading(false));
  }, [slug]);

  const update = (patch) => setForm(prev => ({ ...prev, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    if (!campaign) return;
    const venues = campaign.available_venues || [];
    if (venues.length && !form.venue) { toast.error("Please choose your nearest exam venue."); return; }
    if (!form.name || !form.email || !form.phone || !form.school || !form.standard) {
      toast.error("Please fill all required fields."); return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/scholarship-applications", {
        ...form,
        scholarship_id: slug,
      });
      setSubmitted(data);
      toast.success("Application submitted! Save your application number.");
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-center">
          <div className="font-display text-2xl font-bold">Campaign not found</div>
          <Button onClick={() => navigate("/scholarship")} className="mt-4">Back to Scholarships</Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <PageHero eyebrow="Application Received" title="Save your application number" subtitle={campaign.title} />
        <div className="max-w-2xl mx-auto px-4 lg:px-8 pb-24">
          <div className="border border-primary p-8 rounded-md bg-primary/5" data-testid="submission-success">
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Application Received</div>
            <h3 className="font-display text-3xl font-black mt-2">Save your application number</h3>
            <div className="font-mono text-2xl mt-4 p-4 bg-background border border-border rounded-md">{submitted.application_no}</div>
            <p className="text-sm text-muted-foreground mt-4">Save this number along with your phone <b className="font-mono">{submitted.phone}</b> — you'll need both to view your result later.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={() => navigate("/scholarship")} className="bg-primary text-primary-foreground">Submit another</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const venues = campaign.available_venues || [];

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        eyebrow="Scholarship Application"
        title={campaign.title}
        subtitle={campaign.description || "Complete the form below to apply for this scholarship campaign."}
      />
      <div className="max-w-3xl mx-auto px-4 lg:px-8 pb-24">
        <form onSubmit={submit} className="border border-border p-6 sm:p-8 rounded-md bg-background space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Full name *</label>
              <Input value={form.name} onChange={e => update({ name: e.target.value })} required data-testid="sch-name" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Email *</label>
              <Input type="email" value={form.email} onChange={e => update({ email: e.target.value })} required data-testid="sch-email" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Phone (10-digit) *</label>
              <Input value={form.phone} onChange={e => update({ phone: e.target.value })} required data-testid="sch-phone" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">School / College *</label>
              <Input value={form.school} onChange={e => update({ school: e.target.value })} required data-testid="sch-school" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Standard / Class *</label>
              <select value={form.standard} onChange={e => update({ standard: e.target.value })} required className="w-full border border-border rounded-md px-3 py-2 bg-background" data-testid="sch-standard">
                <option value="">Select class</option>
                {CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Target exam *</label>
              <select value={form.target_exam} onChange={e => update({ target_exam: e.target.value })} required className="w-full border border-border rounded-md px-3 py-2 bg-background" data-testid="sch-target">
                <option value="NEET">NEET</option>
                <option value="IIT-JEE">IIT-JEE</option>
                <option value="Foundation">Foundation</option>
                <option value="CBSE">CBSE</option>
                <option value="JKBOSE">JKBOSE</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">City *</label>
              <Input value={form.city} onChange={e => update({ city: e.target.value })} required data-testid="sch-city" />
            </div>
            {venues.length > 0 && (
              <div>
                <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block flex items-center gap-1"><MapPin size={12}/>Exam venue *</label>
                <select value={form.venue} onChange={e => update({ venue: e.target.value })} required className="w-full border border-border rounded-md px-3 py-2 bg-background" data-testid="sch-venue">
                  <option value="">Select a venue…</option>
                  {venues.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Father's name</label>
              <Input value={form.father_name} onChange={e => update({ father_name: e.target.value })} data-testid="sch-father" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Gender</label>
              <select value={form.gender} onChange={e => update({ gender: e.target.value })} className="w-full border border-border rounded-md px-3 py-2 bg-background" data-testid="sch-gender">
                <option value="">Select gender</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Date of birth</label>
              <Input type="date" value={form.dob} onChange={e => update({ dob: e.target.value })} data-testid="sch-dob" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">District</label>
              <select value={form.district} onChange={e => update({ district: e.target.value })} className="w-full border border-border rounded-md px-3 py-2 bg-background" data-testid="sch-district">
                <option value="">Select district</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Address</label>
              <textarea value={form.address} onChange={e => update({ address: e.target.value })} rows={2} className="w-full border border-border rounded-md px-3 py-2 bg-background text-sm" data-testid="sch-address" />
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground h-12" data-testid="sch-submit">
            {submitting ? "Submitting…" : "Submit Application"}
          </Button>
        </form>
      </div>
    </div>
  );
}
