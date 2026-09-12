import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Eyebrow, Reveal } from "@/components/Cinematic";
import { postsAPI } from "@/lib/api";
import PageHero from "@/components/PageHero";
import GlassPanel from "@/components/GlassPanel";
import { Calendar, User, ArrowRight, FileText } from "@phosphor-icons/react";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postsAPI.list()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog | Northend Educational World</title>
        <link rel="canonical" href="https://northendedu.com/blog" />
      </Helmet>

      <div data-testid="blog-page">
        <PageHero
          eyebrow="Insights"
          title="The Northend Blog"
          accent="stories & guides."
          subtitle="Exam strategies, student success stories, coaching tips, and updates from our Kashmir centres."
        />

        <section className="relative section-padding">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-muted/50 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-24 glass border border-border rounded-3xl text-muted-foreground">
                <FileText size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm">No posts published yet. Check back soon.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, idx) => (
                  <Reveal key={post.id} delay={idx * 0.04}>
                    <Link to={`/blog/${post.slug}`} className="block h-full" data-testid={`blog-post-${post.id}`}>
                      <GlassPanel elevated className="h-full flex flex-col hover:-translate-y-1 transition-transform">
                        {post.featured_image_url && (
                          <div className="rounded-t-3xl overflow-hidden bg-muted/30 aspect-video">
                            <img
                              src={post.featured_image_url}
                              alt={post.image_alt || post.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-1">
                          {post.category && (
                            <span className="text-[10px] uppercase tracking-widest text-accent font-bold mb-2">
                              {post.category}
                            </span>
                          )}
                          <h3 className="font-display text-xl font-semibold tracking-tight mb-2 leading-snug">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="mt-auto flex items-center gap-4 text-[11px] text-muted-foreground font-medium">
                            {post.author && (
                              <span className="inline-flex items-center gap-1.5">
                                <User size={13} /> {post.author}
                              </span>
                            )}
                            {post.published_at && (
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar size={13} /> {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            )}
                          </div>
                          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                            Read article <ArrowRight size={14} />
                          </div>
                        </div>
                      </GlassPanel>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
