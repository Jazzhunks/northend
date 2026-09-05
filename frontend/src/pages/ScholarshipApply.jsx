import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHero from "@/components/PageHero";

export default function ScholarshipApply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", school: "", standard: "", target_exam: "NEET", city: "", venue: "" });

  useEffect(() => {
    setLoading(true);
    api.get(`/scholarships/${id}`)
      .then(r => setCampaign(r.data))
      .catch(e => toast.error(formatError(e.response?.data?.detail) || "Failed to load campaign"))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    if (!campaign) return;
    const venues = campaign.available_venues || [];
    if (venues.length && !form.venue) { toast.error("Please choose your nearest exam venue."); return; }
    setSubmitting(true);
    try {
      const { data } = await api.post("/scholarship-applications", { ...form, scholarship_id: id });
      setSubmitted(data);
      if (data.whatsapp_community_url) {
        window.open(data.whatsapp_community_url, "_blank");
      }
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
        <PageHero eyebrow="Application Received" title="Save your application number" subtitle={`${campaign.title}`} />
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
      <div className="max-w-2xl mx-auto px-4 lg:px-8 pb-24">
        <div className="border border-border p-6 sm:p-8 rounded-md bg-background space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required data-testid="sch-name" />
            <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required data-testid="sch-email" />
            <Input placeholder="Phone (10-digit)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required data-testid="sch-phone" />
            <Input placeholder="School / college" value={form.school} onChange={e => setForm({...form, school: e.target.value})} required data-testid="sch-school" />
            <Input placeholder="Standard / Class" value={form.standard} onChange={e => setForm({...form, standard: e.target.value})} required data-testid="sch-standard" />
            <Input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required data-testid="sch-city" />
            <select className="border border-border rounded-md px-3 py-2 bg-background sm:col-span-2" value={form.target_exam} onChange={e => setForm({...form, target_exam: e.target.value})} data-testid="sch-target">
              {["NEET","IIT-JEE","Foundation","CBSE","JKBOSE"].map(x => <option key={x}>{x}</option>)}
            </select>
            {venues.length > 0 && (
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block flex items-center gap-1"><MapPin size={12}/>Choose your nearest exam venue</label>
                <select className="w-full border border-border rounded-md px-3 py-2 bg-background" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} required data-testid="sch-venue">
                  <option value="">Select a venue…</option>
                  {venues.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            )}
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground h-12" data-testid="sch-submit">
            {submitting ? "Submitting…" : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
}
