import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Eyebrow, Reveal } from "@/components/Cinematic";
import { galleryAPI } from "@/lib/api";
import PageHero from "@/components/PageHero";
import GlassPanel from "@/components/GlassPanel";
import { Play, FileText, Image as ImageIcon, ArrowUpRight } from "@phosphor-icons/react";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const CARD_SIZES = [
  "tall",
  "wide",
  "standard",
  "standard",
  "tall",
  "wide",
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    galleryAPI.list()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(x => x.category).filter(Boolean)));
    return ["All", ...cats];
  }, [items]);

  const visible = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter(x => x.category === activeCategory || !x.category);
  }, [items, activeCategory]);

  const hero = visible[0];
  const rest = visible.slice(1);

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-72 bg-muted/50 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="text-center py-24 glass border border-border rounded-3xl text-muted-foreground">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm">The gallery is being curated. Check back soon.</p>
              </div>
            ) : (
              <>
                {/* Category filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "glass border border-border text-foreground hover:border-primary/30"
                      }`}
                      data-testid={`gallery-cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Masonry-style grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]">
                  {/* Hero card */}
                  {hero && (
                    <div className="md:col-span-2 md:row-span-2" data-testid={`gallery-${hero.id}`}>
                      <GalleryCard item={hero} size="hero" onClick={() => setSelectedItem(hero)} />
                    </div>
                  )}

                  {/* Rest of the grid */}
                  {rest.map((item, idx) => {
                    const size = CARD_SIZES[idx % CARD_SIZES.length];
                    return (
                      <div key={item.id} data-testid={`gallery-${item.id}`}>
                        <GalleryCard item={item} size={size} onClick={() => setSelectedItem(item)} />
                      </div>
                    );
                  })}
                </div>

                {/* View all categories */}
                <div className="mt-10 flex justify-center">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 border border-border text-sm font-bold text-foreground hover:bg-muted transition">
                    View All Categories
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Full-size viewer */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-semibold text-foreground">
              {selectedItem?.title}
            </DialogTitle>
            {selectedItem?.description && (
              <DialogDescription className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {selectedItem.description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="mt-4">
            {selectedItem?.media_type === "video" && selectedItem?.media_url && (
              <div className="rounded-2xl overflow-hidden bg-black/5">
                <video controls className="w-full" style={{ maxHeight: "70vh" }}>
                  <source src={selectedItem.media_url} />
                </video>
              </div>
            )}

            {selectedItem?.media_type === "text" && (
              <div className="rounded-2xl border border-border bg-background/40 p-6">
                <p className="text-base sm:text-lg text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedItem.description || selectedItem.title}
                </p>
              </div>
            )}

            {selectedItem?.media_type === "image" && selectedItem?.media_url && (
              <div className="rounded-2xl overflow-hidden bg-muted/30">
                <img
                  src={selectedItem.media_url}
                  alt={selectedItem.title}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "70vh" }}
                />
              </div>
            )}

            {selectedItem?.category && (
              <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                <span className="capitalize">{selectedItem.media_type}</span>
                <span className="text-border">·</span>
                <span>{selectedItem.category}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function GalleryCard({ item, size, onClick }) {
  const isHero = size === "hero";

  const media = (
    <div
      className={`relative w-full h-full rounded-3xl overflow-hidden bg-muted/30 ${
        isHero ? "md:h-full" : "h-full"
      }`}
    >
      {item.media_type === "video" && item.media_url ? (
        <video
          controls
          className="w-full h-full object-cover"
          poster={item.media_url?.startsWith("/api/files/") ? undefined : item.media_url}
        >
          <source src={item.media_url} />
        </video>
      ) : item.media_type === "text" ? (
        <div className="h-full overflow-y-auto p-6 bg-background/40">
          <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap line-clamp-6">
            {item.description || item.title}
          </p>
        </div>
      ) : (
        item.media_url && (
          <img
            src={item.media_url}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )
      )}

      {/* Overlay for non-text items */}
      {item.media_type !== "text" && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      )}

      {/* Expand icon */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90">
          <Maximize2 size={16} className="text-black" />
        </span>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          {item.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-black text-[10px] font-bold uppercase tracking-wider">
              {item.category}
            </span>
          )}
          {item.media_type === "video" && (
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90">
              <Play weight="fill" size={16} className="text-black" />
            </span>
          )}
        </div>

        <div>
          {item.title && (
            <h3 className={`font-display font-semibold text-white leading-tight ${isHero ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl"}`}>
              {item.title}
            </h3>
          )}
          {item.description && item.media_type !== "text" && (
            <p className="text-white/80 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Text-only card style
  if (item.media_type === "text") {
    return (
      <button
        onClick={onClick}
        className="h-full rounded-3xl border border-border bg-background/40 p-5 flex flex-col justify-between text-left cursor-pointer hover:border-primary/30 transition"
      >
        <div>
          {item.category && (
            <span className="inline-block px-2.5 py-1 rounded-full bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
              {item.category}
            </span>
          )}
          <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap line-clamp-6">
            {item.description || item.title}
          </p>
        </div>
        {item.title && item.description && (
          <div className="mt-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {item.title}
          </div>
        )}
      </button>
    );
  }

  // Standard card with image/video
  return (
    <button
      onClick={onClick}
      className={`group relative h-full w-full text-left cursor-pointer ${isHero ? "md:row-span-2" : ""}`}
    >
      {media}
    </button>
  );
}
