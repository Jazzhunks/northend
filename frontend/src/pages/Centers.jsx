import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import GlassPanel from "@/components/GlassPanel";
import { Reveal } from "@/components/Cinematic";
import { api } from "@/lib/api";
import { MapPin, Phone, Clock, ArrowUpRight } from "@phosphor-icons/react";

export default function Centers() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/centers").then(r => setItems(r.data)); }, []);

  return (
    <div data-testid="centers-page">
      <PageHero
        eyebrow="Network"
        title="Four centres,"
        accent="one valley."
        subtitle="Walk into any Northend centre across Kashmir — same curriculum, same Unacademy access, same outcome focus."
      />
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.04}>
              <GlassPanel className="p-7 h-full group transition-all hover:-translate-y-1 hover:border-accent/30" data-testid={`center-${c.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 rounded-full glass text-[10px] uppercase tracking-[0.18em] text-accent font-bold">{c.city}</span>
                  <ArrowUpRight weight="bold" size={18} className="text-muted-foreground group-hover:text-accent group-hover:rotate-45 transition-all" />
                </div>
                <h3 className="font-display text-2xl font-medium">{c.name}</h3>
                <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2"><MapPin weight="duotone" size={16} className="text-accent mt-0.5 flex-shrink-0"/>{c.address}</div>
                  <div className="flex items-center gap-2 font-mono text-xs"><Phone weight="duotone" size={16} className="text-accent"/>{c.phone}</div>
                  {c.timing && <div className="flex items-center gap-2 text-xs"><Clock weight="duotone" size={16} className="text-accent"/>{c.timing}</div>}
                </div>
                {c.lat && c.lng && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`} target="_blank" rel="noreferrer" data-testid={`map-${c.id}`}
                    className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent hover:underline">
                    Get directions <ArrowUpRight weight="bold" size={12}/>
                  </a>
                )}
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
