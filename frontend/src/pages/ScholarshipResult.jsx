import { useState } from "react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHero from "@/components/PageHero";
import { FileText } from "lucide-react";

export default function ScholarshipResult() {
  const [lookup, setLookup] = useState({ phone: "", application_no: "" });
  const [resultData, setResultData] = useState(null);
  const [busyLookup, setBusyLookup] = useState(false);

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

  return (
    <div data-testid="scholarship-result-page">
      <PageHero
        eyebrow="Result Portal"
        title="Scholarship Result"
        subtitle="Enter your application number and phone number to view your result."
      />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-24 -mt-8">
        <div className="mt-12 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <form onSubmit={doLookup} className="border border-border p-6 rounded-md bg-background space-y-3">
              <h3 className="font-display text-xl font-bold">Check Your Scholarship Result</h3>
              <p className="text-sm text-muted-foreground">Enter the application number and the phone number you used while applying.</p>
              <Input placeholder="Application number (e.g. NEW-SCH-12345678)" value={lookup.application_no} onChange={e => setLookup({...lookup, application_no: e.target.value})} required data-testid="lookup-appno" />
              <Input placeholder="Phone (10-digit)" value={lookup.phone} onChange={e => setLookup({...lookup, phone: e.target.value})} required data-testid="lookup-phone" />
              <Button type="submit" disabled={busyLookup} className="w-full bg-primary text-primary-foreground h-11" data-testid="lookup-submit">{busyLookup ? "Searching…" : "View Result"}</Button>
            </form>
          </div>
          <div className="lg:col-span-7">
            {!resultData && <div className="border border-dashed border-border rounded-md p-8 text-center text-muted-foreground">Submit the form to view your result.</div>}
            {resultData && !resultData.result_published && (
              <div className="border border-border rounded-md p-8 bg-muted/30" data-testid="result-pending">
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
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1"><FileText size={12}/>Rank</div>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
