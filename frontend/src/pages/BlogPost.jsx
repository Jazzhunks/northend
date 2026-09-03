import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { postsAPI } from "@/lib/api";
import { Eyebrow, Reveal } from "@/components/Cinematic";
import GlassPanel from "@/components/GlassPanel";
import { Calendar, User, ArrowLeft, FileText } from "@phosphor-icons/react";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    postsAPI.get(slug)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-muted-foreground text-sm">Loading article…</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-4 text-muted-foreground/40" />
          <h1 className="font-display text-3xl font-light mb-2">Post not found</h1>
          <p className="text-muted-foreground mb-6">The article you’re looking for doesn’t exist or has been unpublished.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-bold">
            <ArrowLeft size={16} /> Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.meta_title || post.title || "Untitled Post"} | Northend Blog`}</title>
        <meta name="description" content={post.meta_description || post.excerpt || ""} />
        {post.og_image_url ? <meta property="og:image" content={post.og_image_url} /> : null}
        <link rel="canonical" href={`https://northendedu.com/blog/${post.slug}`} />
      </Helmet>

      <div data-testid="blog-post-page">
        <article className="min-h-screen bg-background">
          {post.featured_image_url && (
            <div className="w-full bg-muted/30">
              <div className="max-w-5xl mx-auto">
                <img
                  src={post.featured_image_url}
                  alt={post.image_alt || post.title}
                  className="w-full max-h-[50vh] object-cover"
                />
              </div>
            </div>
          )}

          <section className="relative section-padding">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft size={16} /> All articles
              </Link>

              <Reveal>
                <div className="mb-6">
                  {post.category && (
                    <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                      {post.category}
                    </span>
                  )}
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.02em] leading-[1.05] mt-3">
                    {post.title}
                  </h1>
                  {post.excerpt && (
                    <p className="text-lg text-muted-foreground mt-4 leading-relaxed">{post.excerpt}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-muted-foreground font-medium">
                    {post.author && (
                      <span className="inline-flex items-center gap-1.5">
                        <User size={14} /> {post.author}
                      </span>
                    )}
                    {post.published_at && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} /> {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>

              <div className="h-px bg-border mb-8" />

              <Reveal>
                <div
                  className="prose prose-lg max-w-none text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </Reveal>

              {(post.tags || []).length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-muted/50 border border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-12">
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                  <ArrowLeft size={16} /> Back to all articles
                </Link>
              </div>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
