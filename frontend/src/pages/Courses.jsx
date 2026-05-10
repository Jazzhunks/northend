import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

const CATS = ["All", "NEET", "IIT-JEE", "Foundation", "CUET", "NDA", "JKBOSE", "Crash"];

export default function Courses() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("All");

  useEffect(() => {
    api.get("/courses").then(r => setItems(r.data));
  }, []);

  const filtered = active === "All" ? items : items.filter(c => c.category === active);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16" data-testid="courses-page">
      <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Our Courses</div>
      <h1 className="font-display text-4xl lg:text-6xl font-black tracking-tighter">Find the programme that fits your goal.</h1>
      <p className="mt-4 text-muted-foreground text-lg max-w-2xl">Choose from NEET, JEE, Foundation, CUET, NDA and JKBOSE coaching — full-time, hybrid or crash.</p>

      <div className="mt-10 flex flex-wrap gap-2">
        {CATS.map(cat => (
          <button key={cat} onClick={() => setActive(cat)} data-testid={`filter-${cat}`}
            className={`px-4 py-2 text-sm rounded-md border ${active === cat ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {filtered.map(c => (
          <div key={c.id} className="border border-border rounded-md overflow-hidden bg-background" data-testid={`course-${c.id}`}>
            <div className="aspect-[16/10] relative bg-secondary">
              {c.image_url && <img src={c.image_url} alt={c.title} className="h-full w-full object-cover"/>}
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">{c.category}</span>
              {c.scholarship_available && <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">Scholarship</span>}
            </div>
            <div className="p-5">
              <h3 className="font-display font-bold text-lg">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.duration} · ₹{c.fee.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{c.description}</p>
              <div className="flex gap-2 mt-5">
                <Link to={`/courses/${c.id}`} className="flex-1"><Button variant="outline" className="w-full" data-testid={`details-${c.id}`}>Details</Button></Link>
                <Link to={`/enroll?course=${c.id}`} className="flex-1"><Button className="w-full bg-primary text-primary-foreground" data-testid={`enroll-${c.id}`}>Enroll</Button></Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
