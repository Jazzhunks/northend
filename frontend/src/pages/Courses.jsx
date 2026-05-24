import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/PageHero";
import CourseCard3D from "@/components/CourseCard3D";
import { Reveal } from "@/components/Cinematic";
import { api } from "@/lib/api";

const CATS = ["All", "NEET", "IIT-JEE", "Foundation", "CBSE", "JKBOSE"];

export default function Courses() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("All");

  useEffect(() => { api.get("/courses").then(r => setItems(r.data)); }, []);

  const filtered = active === "All" ? items : items.filter(c => c.category === active);

  return (
    <div data-testid="courses-page">
      <PageHero
        eyebrow="Programmes"
        title="Find the programme"
        accent="that engineers your AIR."
        subtitle="NEET, IIT-JEE, Foundation, CBSE, JKBOSE — full-time, hybrid or accelerated. Every track is engineered with daily mentor classes, weekly mocks and a personal performance dashboard."
      />

      <section className="relative pb-24 -mt-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-10" data-testid="course-filters">
            {CATS.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                data-testid={`filter-${cat}`}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] rounded-full transition-all ${
                  active === cat
                    ? "bg-accent text-accent-foreground glow-accent"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.04}>
                  <Link to={`/courses/${c.id}`}><CourseCard3D course={c} /></Link>
                </Reveal>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">No programmes in this category yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
