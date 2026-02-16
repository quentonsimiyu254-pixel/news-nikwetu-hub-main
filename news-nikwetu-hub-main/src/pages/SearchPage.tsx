import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { Helmet } from "react-helmet-async";

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, featured_image, published_at, categories(name, slug)")
        .eq("status", "published")
        .ilike("title", `%${query}%`)
        .order("published_at", { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !!query,
  });

  return (
    <>
      <Helmet><title>Search: {query} - News Nikwetu</title></Helmet>
      <Header />
      <main className="news-container py-8">
        <h1 className="font-serif font-bold text-2xl mb-6">
          Search results for "<span className="text-primary">{query}</span>"
        </h1>
        {isLoading ? (
          <p className="text-muted-foreground">Searching...</p>
        ) : results && results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post: any) => (
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
        ) : (
          <p className="text-muted-foreground">No results found.</p>
        )}
      </main>
      <Footer />
    </>
  );
};

export default SearchPage;
