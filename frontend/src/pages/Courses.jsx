import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/PageHero";
import CourseCard3D from "@/components/CourseCard3D";
import { Reveal } from "@/components/Cinematic";
import { api } from "@/lib/api";

const CATS = ["All", "NEET", "IIT-JEE", "Foundation", "CBSE", "JKBOSE"];

const STATIC_FALLBACK_SCHEMA_COURSES = [
  { id: "neet-coaching", title: "NEET Professional Coaching Programme", description: "Comprehensive preparation track tailored for cracking NEET exams with AIR rankers." },
  { id: "jee-coaching", title: "IIT-JEE Advanced Engineering Track", description: "Advanced logical and structural problem-solving physics, chemistry, and math syllabus." },
  { id: "foundation-batches", title: "Foundation Academic Excellence Batch", description: "Early analytical skill development mapping Class 8 to 10 towards future national contests." }
];

export default function Courses() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("All");

  useEffect(() => { 
    api.get("/courses").then(r => setItems(r.data || [])); 
  }, []);

  const filtered = active === "All" ? items : items.filter(c => c.category === active);

  const schemaSourceData = filtered.length > 0 ? filtered : STATIC_FALLBACK_SCHEMA_COURSES;

  return (
    <>
      <Helmet>
        <title>Academic Programmes | Northend Educational World</title>
        <link rel="canonical" href="https://northendedu.com/courses" />
        <link rel="alternate" href="https://nexed-neet.preview.emergentagent.com/courses" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Northend Coaching Catalog",
            "description": "NEET, IIT-JEE, Foundation, CBSE, and JKBOSE integrated regular coaching batches across Kashmir.",
            "url": "https://northendedu.com/courses",
            "numberOfItems": schemaSourceData.length,
            "itemListElement": schemaSourceData.map((c, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "item": {
                "@type": "Course",
                "name": c.title,
                "description": c.description || "Premium competitive academic coaching curriculum.",
                "provider": {
                  "@type": "EducationalOrganization",
                  "name": "Northend Educational World",
                  "sameAs": "https://northendedu.com"
                }
              }
            }))
          })}
        </script>
      </Helmet>

      <div data-testid="courses-page" className="overflow-x-hidden w-full">
        <PageHero
          eyebrow="Programmes"
          title="Find the programme"
          accent="that engineers your AIR."
          subtitle="NEET, IIT-JEE, Foundation, CBSE, JKBOSE — full-time, hybrid or accelerated. Every track is engineered with daily mentor classes, weekly mocks and a personal performance dashboard."
        />

        <section className="relative pb-24 -mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <Link to={`/courses/${c.id}`} className="h-full block"><CourseCard3D course={c} /></Link>
                  </Reveal>
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-24 glass border border-border rounded-2xl text-muted-foreground" data-testid="courses-empty">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-sm">No programmes in this category yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}