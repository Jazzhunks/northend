import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Eyebrow, Reveal } from "@/components/Cinematic";
import { galleryAPI } from "@/lib/api";
import PageHero from "@/components/PageHero";
import GlassPanel from "@/components/GlassPanel";
import { Play, FileText, Image as ImageIcon, Plus } from "@phosphor-icons/react";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    galleryAPI.list()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const grouped = items.reduce((acc, item) => {
    const key = item.category || "Uncategorised";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped);
  const displayCategory = activeCategory || categories[0];

  return (
    <>
      <Helmet>
        <title>Gallery | Northend Educational World</title>
        <link rel="canonical" href="https://northendedu.com/gallery" />
      </Helmet>

      <div data-testid="gallery-page">
        <PageHero
          eyebrow="Moments"
          title="Life at Northend"
          accent="in frames."
          subtitle="Campus, classrooms, events, and student milestones — captured live from our centres across Kashmir."
        />

        <section className="relative section-padding">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-muted/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-24 glass border border-border rounded-2xl text-muted-foreground">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm">The gallery is being curated. Check back soon.</p>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Category navigation */}
                <aside className="lg:w-64 shrink-0">
                  <div className="lg:sticky lg:top-28">
                    <h2 className="text-[10px] uppercase tracking-[0.22em] font-bold text-muted-foreground mb-3">Categories</h2>
                    <div className="flex flex-wrap lg:flex-col gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all text-left ${
                            displayCategory === cat
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "glass border border-border text-foreground hover:border-primary/30"
                          }`}
                          data-testid={`gallery-cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Category content */}
                <div className="flex-1 min-w-0">
                  {displayCategory && grouped[displayCategory] && (
                    <div className="space-y-8">
                      <div className="flex items-end justify-between flex-wrap gap-4">
                        <div>
                          <h2 className="font-display text-3xl sm:text-4xl font-light tracking-tight">{displayCategory}</h2>
                          <p className="text-muted-foreground mt-2 max-w-2xl">
                            {grouped[displayCategory][0]?.description || `Moments from ${displayCategory} at Northend Educational World.`}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                          {grouped[displayCategory].length} {grouped[displayCategory].length === 1 ? "item" : "items"}
                        </span>
                      </div>
                      <div className="h-px bg-border" />

                      {/* Editorial flow layout */}
                      <div className="space-y-10">
                        {grouped[displayCategory].map((item, idx) => (
                          <Reveal key={item.id} delay={idx * 0.05}>
                            <article className="gallery-item" data-testid={`gallery-${item.id}`}>
                              {item.media_type === "video" && item.media_url ? (
                                <div className="rounded-2xl overflow-hidden bg-muted/30 mb-5">
                                  <video
                                    controls
                                    className="w-full"
                                    style={{ maxHeight: "70vh" }}
                                  >
                                    <source src={item.media_url} />
                                  </video>
                                </div>
                              ) : item.media_type === "text" ? (
                                <div className="mb-5">
                                  <p className="text-base sm:text-lg text-foreground leading-relaxed whitespace-pre-wrap">
                                    {item.description || item.title}
                                  </p>
                                </div>
                              ) : (
                                <div className="rounded-2xl overflow-hidden bg-muted/30 mb-5">
                                  {item.media_url ? (
                                    <img
                                      src={item.media_url}
                                      alt={item.title}
                                      className="w-full"
                                      style={{ maxHeight: "70vh", objectFit: "cover" }}
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="aspect-video flex items-center justify-center">
                                      <ImageIcon size={48} className="text-muted-foreground/40" />
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                                <div>
                                  {item.title && (
                                    <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight">{item.title}</h3>
                                  )}
                                  {item.description && item.media_type !== "text" && (
                                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-3xl">{item.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                  {item.media_type === "video" ? <Play size={14} /> : item.media_type === "text" ? <FileText size={14} /> : <ImageIcon size={14} />}
                                  <span className="capitalize">{item.media_type}</span>
                                  {item.category && (
                                    <>
                                      <span className="text-border">·</span>
                                      <span>{item.category}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </article>
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
