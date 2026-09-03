import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Eyebrow, Reveal } from "@/components/Cinematic";
import { galleryAPI } from "@/lib/api";
import PageHero from "@/components/PageHero";
import GlassPanel from "@/components/GlassPanel";
import { Play, FileText, Image as ImageIcon } from "@phosphor-icons/react";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryAPI.list()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const grouped = items.reduce((acc, item) => {
    const key = item.category || "All";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-muted/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-24 glass border border-border rounded-2xl text-muted-foreground">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm">The gallery is being curated. Check back soon.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {categories.map((cat) => (
                  <div key={cat}>
                    <div className="mb-6">
                      <h2 className="font-display text-2xl sm:text-3xl font-light tracking-tight">{cat}</h2>
                      <div className="h-px bg-border mt-3" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {grouped[cat].map((item, idx) => (
                        <Reveal key={item.id} delay={idx * 0.04}>
                          <GlassPanel elevated className="p-4 sm:p-5 h-full" data-testid={`gallery-${item.id}`}>
                            {item.media_type === "video" && item.media_url ? (
                              <div className="rounded-xl overflow-hidden bg-black/5 mb-4 aspect-video flex items-center justify-center">
                                <video
                                  controls
                                  className="w-full h-full object-cover"
                                  poster={item.media_url?.startsWith("/api/files/") ? undefined : item.media_url}
                                >
                                  <source src={item.media_url} />
                                </video>
                              </div>
                            ) : item.media_type === "text" ? (
                              <div className="rounded-xl border border-border bg-background/40 p-5 mb-4 min-h-[120px] flex items-center">
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{item.description || item.title}</p>
                              </div>
                            ) : (
                              <div className="rounded-xl overflow-hidden bg-muted/30 mb-4 aspect-[4/3] flex items-center justify-center">
                                {item.media_url ? (
                                  <img
                                    src={item.media_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <ImageIcon size={32} className="text-muted-foreground/40" />
                                )}
                              </div>
                            )}

                            <div>
                              <div className="font-display font-medium text-foreground leading-snug">{item.title}</div>
                              {item.description && item.media_type !== "text" && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-3 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                {item.media_type === "video" ? <Play size={12} /> : <FileText size={12} />}
                                {item.media_type}
                              </div>
                            </div>
                          </GlassPanel>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
