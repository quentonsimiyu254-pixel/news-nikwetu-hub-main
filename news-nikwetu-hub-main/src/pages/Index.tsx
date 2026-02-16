import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import Sidebar from "@/components/Sidebar";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["published-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, featured_image, published_at, category_id, categories(name, slug)")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(20);
      return data || [];
    },
  });

  const heroPost = posts?.[0];
  const latestPosts = posts?.slice(1) || [];

  return (
    <>
      <Helmet>
        <title>News Nikwetu - Your Trusted News Source</title>
        <meta name="description" content="Breaking news, politics, business, sports, and entertainment coverage. Stay informed with News Nikwetu." />
      </Helmet>
      <Header />
      <main className="news-container py-6">
        {/* Top ad */}
        <div className="ad-placeholder h-24 mb-6">
          <span>Top Banner Ad</span>
        </div>

        {/* Hero */}
        {heroPost && (
          <section className="mb-8">
            <NewsCard
              title={(heroPost as any).title}
              excerpt={(heroPost as any).excerpt}
              featuredImage={(heroPost as any).featured_image}
              categoryName={(heroPost as any).categories?.name}
              categorySlug={(heroPost as any).categories?.slug}
              slug={(heroPost as any).slug}
              publishedAt={(heroPost as any).published_at}
              variant="hero"
            />
          </section>
        )}

        {/* Main content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="news-divider" />
              <h2 className="font-serif font-bold text-xl">Latest News</h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="news-card animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-20" />
                      <div className="h-5 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : latestPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestPosts.map((post: any) => (
                  <NewsCard
                    key={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    featuredImage={post.featured_image}
                    categoryName={post.categories?.name}
                    categorySlug={post.categories?.slug}
                    slug={post.slug}
                    publishedAt={post.published_at}
                  />
                ))}
              </div>
            ) : !heroPost ? (
              <div className="text-center py-16">
                <h2 className="font-serif text-2xl font-bold mb-2">Welcome to News Nikwetu</h2>
                <p className="text-muted-foreground">No articles published yet. Admin can start publishing from the dashboard.</p>
              </div>
            ) : null}

            {/* In-article ad */}
            <div className="ad-placeholder h-24 my-8">
              <span>In-Feed Ad</span>
            </div>
          </div>

          <Sidebar />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Index;
