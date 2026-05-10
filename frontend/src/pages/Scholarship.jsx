import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Award, Calendar, MapPin, Clock, Trophy, Download, FileText } from "lucide-react";

export default function Scholarship() {
  const [campaigns, setCampaigns] = useState([]);
  const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", school: "", standard: "", target_exam: "NEET", city: "", scholarship_id: "" });
  const [calc, setCalc] = useState({ marks: "" });

  // Result lookup
  const [lookup, setLookup] = useState({ phone: "", application_no: "" });
  const [resultData, setResultData] = useState(null);
  const [busyLookup, setBusyLookup] = useState(false);

  useEffect(() => {
    api.get("/scholarships").then(r => {
      const active = r.data.filter(c => c.active);
      setCampaigns(active);
      if (active.length && !form.scholarship_id) setForm(f => ({ ...f, scholarship_id: active[0].id }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.scholarship_id) { toast.error("Please select a scholarship campaign."); return; }
    try {
      const { data } = await api.post("/scholarship-applications", form);
      setSubmitted(data);
      toast.success("Application submitted! Save your application number.");
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail));
    }
  };

  const doLookup = async (e) => {
    e.preventDefault();
    setBusyLookup(true); setResultData(null);
    try {
      const { data } = await api.post("/scholarship-applications/lookup", lookup);
      setResultData(data);
      if (data.result_published) toast.success("Result loaded.");
      else toast.info("Application found. Result not yet published.");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || err.message);
    } finally { setBusyLookup(false); }
  };

  const pct = calc.marks ? Math.min(Math.max(Math.round(Number(calc.marks)), 0), 100) : 0;
  const scholarshipPct = pct >= 90 ? 100 : pct >= 80 ? 75 : pct >= 70 ? 50 : pct >= 60 ? 25 : pct >= 50 ? 10 : 0;

  const BACKEND = process.env.REACT_APP_BACKEND_URL;
  const selectedCampaign = campaigns.find(c => c.id === form.scholarship_id);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16" data-testid="scholarship-page">
      <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Scholarship Portal</div>
      <h1 className="font-display text-4xl lg:text-6xl font-black tracking-tighter">Up to <span className="text-accent">100% off</span><br/>on tuition fees.</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-3xl">Take an active Northend Scholarship Test and unlock partial to full scholarships across all programmes.</p>

      <Tabs defaultValue="apply" className="mt-12">
        <TabsList data-testid="scholarship-tabs">
          <TabsTrigger value="apply" data-testid="tab-apply">Apply</TabsTrigger>
          <TabsTrigger value="result" data-testid="tab-result">Check Result</TabsTrigger>
        </TabsList>

        {/* ---- APPLY ---- */}
        <TabsContent value="apply" className="mt-6">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              {campaigns.length === 0 && (
                <div className="border border-dashed border-border p-6 rounded-md text-center text-muted-foreground" data-testid="no-campaigns">
                  No active scholarship campaigns at the moment. Please check back soon.
                </div>
              )}
              {campaigns.map(s => (
                <label key={s.id} className={`block border ${form.scholarship_id === s.id ? "border-primary ring-1 ring-primary/30" : "border-border"} p-6 rounded-md bg-background cursor-pointer transition`} data-testid={`campaign-${s.id}`}>
                  <input type="radio" name="campaign" className="hidden" checked={form.scholarship_id === s.id} onChange={() => setForm({...form, scholarship_id: s.id})}/>
                  <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary">{s.is_featured ? "★ Featured" : "Live now"}</div>
                  <h3 className="font-display text-xl font-bold mt-1">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground text-sm">{s.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="border-t border-border pt-3"><div className="text-muted-foreground text-xs flex items-center gap-1"><Calendar size={12}/>Exam date</div><div className="font-mono">{s.exam_date}</div></div>
                    <div className="border-t border-border pt-3"><div className="text-muted-foreground text-xs flex items-center gap-1"><Clock size={12}/>Time</div><div className="font-mono">{s.exam_time || "10:00 AM"}</div></div>
                    {s.venue && <div className="col-span-2 border-t border-border pt-3"><div className="text-muted-foreground text-xs flex items-center gap-1"><MapPin size={12}/>Venue</div><div>{s.venue}</div></div>}
                    <div className="col-span-2 border-t border-border pt-3"><div className="text-muted-foreground text-xs">Deadline</div><div className="font-mono">{s.deadline}</div></div>
                  </div>
                </label>
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
                  <p className="text-sm text-muted-foreground mt-4">Save this number along with your phone <b className="font-mono">{submitted.phone}</b> — you'll need both to view your result later.</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <a href={`${BACKEND}/api/scholarship-applications/${submitted.application_no}/admit-card`} target="_blank" rel="noreferrer">
                      <Button className="bg-primary text-primary-foreground" data-testid="download-admit-card"><Download size={14}/>Download Admit Card</Button>
                    </a>
                    <Button onClick={() => setSubmitted(null)} variant="outline" data-testid="another-app-btn">Submit another</Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="border border-border p-8 rounded-md space-y-4 bg-background">
                  <h3 className="font-display text-2xl font-bold mb-2">Scholarship Application</h3>

                  {selectedCampaign && (
                    <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-sm" data-testid="selected-campaign">
                      Applying for: <b>{selectedCampaign.title}</b> · Exam {selectedCampaign.exam_date}
                    </div>
                  )}

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
                    {campaigns.length > 1 && (
                      <select className="border border-border rounded-md px-3 py-2 bg-background sm:col-span-2" value={form.scholarship_id} onChange={e => setForm({...form, scholarship_id: e.target.value})} required data-testid="sch-campaign">
                        {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    )}
                  </div>
                  <Button type="submit" disabled={!form.scholarship_id} className="w-full bg-primary text-primary-foreground h-12" data-testid="sch-submit">Submit Application</Button>
                </form>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ---- RESULT LOOKUP ---- */}
        <TabsContent value="result" className="mt-6">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <form onSubmit={doLookup} className="border border-border p-6 rounded-md bg-background space-y-3">
                <h3 className="font-display text-xl font-bold">Check Your Scholarship Result</h3>
                <p className="text-sm text-muted-foreground">Enter the application number and the phone number you used while applying.</p>
                <Input placeholder="Application number (e.g. NEW-SCH-12345678)" value={lookup.application_no} onChange={e => setLookup({...lookup, application_no: e.target.value})} required data-testid="lookup-appno"/>
                <Input placeholder="Phone (10-digit)" value={lookup.phone} onChange={e => setLookup({...lookup, phone: e.target.value})} required data-testid="lookup-phone"/>
                <Button type="submit" disabled={busyLookup} className="w-full bg-primary text-primary-foreground h-11" data-testid="lookup-submit">{busyLookup ? "Searching…" : "View Result"}</Button>
              </form>
            </div>
            <div className="lg:col-span-7">
              {!resultData && <div className="border border-dashed border-border rounded-md p-8 text-center text-muted-foreground">Submit the form to view your result.</div>}
              {resultData && !resultData.result_published && (
                <div className="border border-border rounded-md p-8 bg-secondary/30" data-testid="result-pending">
                  <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Application found · Result pending</div>
                  <h3 className="font-display text-2xl font-bold mt-2">{resultData.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">{resultData.application_no}</p>
                  <p className="mt-4">Your result is not yet published. We'll notify you on <b>{resultData.email}</b> the moment it goes live.</p>
                </div>
              )}
              {resultData?.result_published && (
                <div className="border border-primary p-8 rounded-md bg-primary/5 space-y-5" data-testid="result-card">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Scholarship Result</div>
                    <h3 className="font-display text-3xl font-black mt-1">{resultData.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">{resultData.application_no} · {resultData.scholarship_title || resultData.target_exam}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background border border-border rounded-md p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Marks</div>
                      <div className="font-display text-3xl font-black mt-1">{resultData.result_marks_obtained}<span className="text-base text-muted-foreground"> / {resultData.result_total_marks}</span></div>
                    </div>
                    <div className="bg-primary text-primary-foreground rounded-md p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-accent">Scholarship</div>
                      <div className="font-display text-4xl font-black mt-1">{resultData.result_scholarship_percentage}%</div>
                      <div className="text-xs mt-1">off on tuition fee</div>
                    </div>
                    {resultData.result_rank && (
                      <div className="bg-background border border-border rounded-md p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1"><Trophy size={12}/>Rank</div>
                        <div className="font-display text-2xl font-black mt-1">{resultData.result_rank}</div>
                      </div>
                    )}
                    {resultData.result_percentile != null && (
                      <div className="bg-background border border-border rounded-md p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Percentile</div>
                        <div className="font-display text-2xl font-black mt-1">{resultData.result_percentile}</div>
                      </div>
                    )}
                  </div>

                  {resultData.result_remarks && (
                    <div className="text-sm border-l-4 border-accent pl-3 italic text-muted-foreground">"{resultData.result_remarks}"</div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    <a href={`${BACKEND}/api/scholarship-applications/${resultData.application_no}/result-card?phone=${encodeURIComponent(resultData.phone)}`} target="_blank" rel="noreferrer">
                      <Button className="bg-primary text-primary-foreground" data-testid="download-result-card"><FileText size={14}/>Download Result Card (PDF)</Button>
                    </a>
                    <a href={`${BACKEND}/api/scholarship-applications/${resultData.application_no}/admit-card`} target="_blank" rel="noreferrer">
                      <Button variant="outline"><Download size={14}/>Admit Card</Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
