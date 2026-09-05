import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Scholarship() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/scholarships")
      .then(r => {
        const active = r.data.filter(c => c.active);
        setCampaigns(active);
      })
      .catch(e => toast.error(formatError(e.response?.data?.detail) || "Failed to load campaigns"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="scholarship-page">
      <PageHero
        eyebrow="Scholarship Portal"
        title="Up to"
        accent="100% off on tuition."
        subtitle="Sit the Northend Scholarship Test (NST) and unlock partial to full waivers across every programme — open to all Class 8–12 students of J&K."
      />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-24 -mt-8">
        <div className="mt-12 flex items-center justify-between">
          <div>
            <div className="font-display font-bold text-2xl text-foreground">Active Campaigns</div>
            <div className="text-sm text-muted-foreground mt-1">Choose a campaign below to start your application.</div>
          </div>
          <Button variant="outline" onClick={() => navigate("/scholarship/result")} className="cursor-pointer">Check Result</Button>
        </div>
        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading campaigns…</div>
        ) : campaigns.length === 0 ? (
          <div className="border border-dashed border-border p-6 rounded-md text-center text-muted-foreground" data-testid="no-campaigns">
            No active scholarship campaigns at the moment. Please check back soon.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map(c => (
              <div key={c.id} className="border border-border bg-background rounded-xl p-5 flex flex-col hover:border-primary/40 transition">
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">{c.is_featured ? "★ Featured" : "Live now"}</div>
                <h3 className="font-display text-xl font-bold mt-1">{c.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm line-clamp-3">{c.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-muted-foreground text-xs flex items-center gap-1"><Calendar size={12}/>Exam date</div><div className="font-mono">{c.exam_date}</div></div>
                  <div><div className="text-muted-foreground text-xs flex items-center gap-1"><Clock size={12}/>Time</div><div className="font-mono">{c.exam_time || "10:00 AM"}</div></div>
                  {c.venue && <div className="col-span-2"><div className="text-muted-foreground text-xs flex items-center gap-1"><MapPin size={12}/>Venue</div><div>{c.venue}</div></div>}
                  <div className="col-span-2"><div className="text-muted-foreground text-xs">Deadline</div><div className="font-mono">{c.deadline}</div></div>
                </div>
                {(c.available_venues || []).length > 0 && (
                  <div className="mt-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-1">Venues</div>
                    <div className="flex flex-wrap gap-1">
                      {c.available_venues.map(v => <span key={v} className="text-[10px] uppercase font-bold font-mono tracking-wider bg-muted/50 px-2 py-0.5 border border-border rounded text-muted-foreground">{v}</span>)}
                    </div>
                  </div>
                )}
                  <Button onClick={() => navigate(`/scholarship/${c.slug || c.id}/apply`)} className="mt-4 w-full bg-primary text-primary-foreground" data-testid={`campaign-apply-${c.id}`}>
                  Apply <ArrowRight size={14} className="ml-1.5"/>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
