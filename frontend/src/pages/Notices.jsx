import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import GlassPanel from "@/components/GlassPanel";
import { Reveal } from "@/components/Cinematic";
import { api } from "@/lib/api";
import { PushPin, Megaphone, Bell } from "@phosphor-icons/react";

const ICONS = { "Admissions": PushPin, "Scholarship": Megaphone, "Workshop": Bell };

export default function Notices() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/notices").then(r => setItems(r.data)); }, []);

  return (
    <div data-testid="notices-page">
      <PageHero
        eyebrow="What's new"
        title="Latest"
        accent="from Northend."
        subtitle="Admissions windows, scholarship drives, workshops and announcements — straight from the operations desk."
      />
      <section className="relative pb-24 -mt-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4">
          {items.map((n, i) => {
            const Icon = ICONS[n.category] || Bell;
            return (
              <Reveal key={n.id} delay={i * 0.04}>
                <GlassPanel className={`p-6 lg:p-8 ${n.pinned ? "border-accent/30 glow-accent" : ""}`} data-testid={`notice-${n.id}`}>
                  <div className="flex items-start gap-5">
                    <div className="h-12 w-12 rounded-xl glass-elevated grid place-items-center flex-shrink-0">
                      <Icon weight="duotone" size={22} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">{n.category}</span>
                        {n.pinned && <span className="text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">★ Pinned</span>}
                        <span className="text-xs text-muted-foreground ml-auto font-mono">{new Date(n.created_at).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}</span>
                      </div>
                      <h3 className="font-display text-xl lg:text-2xl font-medium">{n.title}</h3>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed whitespace-pre-line">{n.content}</p>
                    </div>
                  </div>
                </GlassPanel>
              </Reveal>
            );
          })}
          {items.length === 0 && <div className="text-center py-16 text-muted-foreground">No notices yet.</div>}
        </div>
      </section>
    </div>
  );
}
