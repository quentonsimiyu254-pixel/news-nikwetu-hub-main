import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NewsCard from "@/components/NewsCard";

const Sidebar = () => {
  const { data: trending } = useQuery({
    queryKey: ["trending-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, title, slug, featured_image, published_at, views, category_id, categories(name, slug)")
        .eq("status", "published")
        .order("views", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  return (
    <aside className="space-y-8">
      {/* Ad placeholder */}
      <div className="ad-placeholder h-60">
        <span>Ad Space</span>
      </div>

      {/* Trending */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="news-divider" />
          <h3 className="font-serif font-bold text-lg">Trending</h3>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          {trending?.map((post: any) => (
            <NewsCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              featuredImage={post.featured_image}
              categorySlug={post.categories?.slug}
              publishedAt={post.published_at}
              variant="compact"
            />
          ))}
          {(!trending || trending.length === 0) && (
            <p className="text-muted-foreground text-sm py-4 text-center">No trending posts yet</p>
          )}
        </div>
      </div>

      {/* Ad placeholder */}
      <div className="ad-placeholder h-60">
        <span>Ad Space</span>
      </div>
    </aside>
  );
};

export default Sidebar;
