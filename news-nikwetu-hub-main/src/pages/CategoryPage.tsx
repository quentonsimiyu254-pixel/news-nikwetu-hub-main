import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import Sidebar from "@/components/Sidebar";

// Ensure your .env uses VITE_ prefix
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function CategoryPage() {
  const { category: slug } = useParams(); // Get slug from URL
  const navigate = useNavigate();
  
  const [category, setCategory] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // 1. Fetch Category Details
      const { data: categoryData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (catError || !categoryData) {
        // Instead of notFound(), we redirect or show an error
        console.error("Category not found");
        setLoading(false);
        return;
      }

      setCategory(categoryData);

      // 2. Update Document Title (Metadata replacement)
      document.title = `${categoryData.name} - News Nikwetu`;

      // 3. Fetch Posts
      const { data: postsData } = await supabase
        .from("posts")
        .select(
          "id, title, slug, excerpt, featured_image, published_at, categories(name, slug)"
        )
        .eq("status", "published")
        .eq("category_id", categoryData.id)
        .order("published_at", { ascending: false });

      setPosts(postsData || []);
      setLoading(false);
    }

    if (slug) fetchData();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Link to="/" className="text-blue-500 underline">Go back home</Link>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-[#E11D48]">
            Home
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="font-semibold text-black">
            {category.name}
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-[#E11D48]" />
          <h1 className="font-bold text-2xl md:text-3xl text-black">
            {category.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts */}
          <div className="lg:col-span-2">
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {posts.map((post: any) => (
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
              <p className="text-gray-500 text-center py-12">
                No articles in this category yet.
              </p>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </main>

      <Footer />
    </>
  );
}