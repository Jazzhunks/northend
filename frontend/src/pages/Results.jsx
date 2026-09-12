import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import GlassPanel from "@/components/GlassPanel";
import { Reveal } from "@/components/Cinematic";
import { api } from "@/lib/api";
import { Trophy, Quotes } from "@phosphor-icons/react";

export default function Results() {
  const [items, setItems] = useState([]);
  const [year, setYear] = useState("All");

  useEffect(() => { api.get("/results").then(r => setItems(r.data)); }, []);

  const years = ["All", ...new Set(items.map(i => i.year).sort((a, b) => b - a))];
  const filtered = year === "All" ? items : items.filter(i => i.year === year);

  return (
    <div data-testid="results-page">
      <PageHero
        eyebrow="Wall of Fame"
        title="Recent"
        accent="conquerors."
        subtitle="Every rank here is a story of discipline, mentorship and faith — earned across Kashmir, recognised across India."
      />
      <section className="relative pb-24 -mt-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-10">
            {years.map(y => (
              <button key={y} onClick={() => setYear(y)} data-testid={`year-${y}`}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] rounded-full transition-all ${
                  year === y ? "bg-accent text-accent-foreground glow-accent" : "glass text-muted-foreground hover:text-foreground"
                }`}>{y}</button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.04}>
                <GlassPanel elevated className="p-7 h-full" data-testid={`result-${r.id}`}>
                  <div className="flex items-start justify-between mb-5">
                    <Trophy weight="duotone" size={24} className="text-accent" />
                    <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">{r.exam}</span>
                  </div>
                  <div className="font-display text-4xl font-medium tracking-tight">{r.rank}</div>
                  <div className="font-display text-lg mt-2">{r.student_name}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">{r.course} · {r.year}</div>
                  {r.quote && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <Quotes weight="fill" size={20} className="text-accent/50 mb-2" />
                      <p className="text-sm italic text-muted-foreground leading-relaxed">"{r.quote}"</p>
                    </div>
                  )}
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
