import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { MapPin, Phone, Clock } from "lucide-react";

const KASHMIR = "https://images.unsplash.com/photo-1606355792317-4dcadc93ed26?w=1600";

export default function Centers() {
  const [list, setList] = useState([]);
  useEffect(() => { api.get("/centers").then(r => setList(r.data)); }, []);
  return (
    <div data-testid="centers-page">
      <section className="relative overflow-hidden">
        <img src={KASHMIR} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Kashmir"/>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background"/>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Centers</div>
          <h1 className="font-display text-4xl lg:text-6xl font-black tracking-tighter">Four centers. One promise.<br/>The whole valley, covered.</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 -mt-6">
          {list.map(c => (
            <div key={c.id} className="border border-border p-6 rounded-md bg-background" data-testid={`center-${c.id}`}>
              <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary">{c.city}</div>
              <h3 className="font-display text-xl font-bold mt-1">{c.name}</h3>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2"><MapPin size={14} className="mt-0.5"/>{c.address}</div>
                <div className="flex items-center gap-2"><Phone size={14}/>{c.phone}</div>
                <div className="flex items-center gap-2"><Clock size={14}/>{c.timing}</div>
              </div>
              <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`} className="text-sm font-bold text-primary mt-4 inline-block" data-testid={`map-${c.id}`}>View on Google Maps →</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
