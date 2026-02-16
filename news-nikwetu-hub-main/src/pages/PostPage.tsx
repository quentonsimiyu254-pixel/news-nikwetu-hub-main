import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import ShareButtons from "@/components/ShareButtons";
import Sidebar from "@/components/Sidebar";
import { formatDate } from "@/lib/supabase-helpers";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";

const PostPage = () => {
  const { slug, categorySlug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("*, categories(name, slug), profiles:author_id(display_name)")
        .eq("slug", slug!)
        .single();
      // Increment views
      if (data) {
        supabase.from("posts").update({ views: (data.views || 0) + 1 }).eq("id", data.id).then();
      }
      return data;
    },
    enabled: !!slug,
  });

  const { data: related } = useQuery({
    queryKey: ["related-posts", post?.category_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, title, slug, featured_image, published_at, categories(name, slug)")
        .eq("status", "published")
        .eq("category_id", post!.category_id!)
        .neq("id", post!.id)
        .limit(4);
      return data || [];
    },
    enabled: !!post?.category_id,
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="news-container py-8">
          <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="aspect-video bg-muted rounded-xl" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-muted rounded" />)}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="news-container py-16 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Article Not Found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </main>
        <Footer />
      </>
    );
  }

  const postUrl = typeof window !== "undefined" ? window.location.href : "";
  const authorName = (post as any).profiles?.display_name || "Staff Writer";

  return (
    <>
      <Helmet>
        <title>{post.title} - News Nikwetu</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
      </Helmet>
      <Header />
      <main className="news-container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>

            {(post as any).categories?.name && (
              <span className="news-badge mb-3">{(post as any).categories.name}</span>
            )}

            <h1 className="font-serif font-bold text-2xl md:text-4xl leading-tight mt-2 mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span>By <strong className="text-foreground">{authorName}</strong></span>
              {post.published_at && <span>{formatDate(post.published_at)}</span>}
              <ShareButtons url={postUrl} title={post.title} />
            </div>

            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full rounded-xl mb-6 aspect-video object-cover"
              />
            )}

            {/* Ad */}
            <div className="ad-placeholder h-20 mb-6"><span>In-Article Ad</span></div>

            <div
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="border-t border-border pt-6">
              <ShareButtons url={postUrl} title={post.title} />
            </div>
          </article>

          <Sidebar />
        </div>

        {/* Related posts */}
        {related && related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="news-divider" />
              <h2 className="font-serif font-bold text-xl">Related Stories</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p: any) => (
                <NewsCard
                  key={p.id}
                  title={p.title}
                  slug={p.slug}
                  featuredImage={p.featured_image}
                  categorySlug={p.categories?.slug}
                  publishedAt={p.published_at}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default PostPage;
