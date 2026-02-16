import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Plus, FileText, Eye, Trash2, Edit, LogOut } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Initialize the client with VITE environment variables
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSessionAndData() {
      // 1. Check for authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/admin/login");
        return;
      }

      setUser(user);
      document.title = "Dashboard - News Nikwetu Admin";

      // 2. Fetch posts for this author
      const { data: postsData } = await supabase
        .from("posts")
        .select("*, categories(name)")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      setPosts(postsData || []);
      setLoading(false);
    }

    getSessionAndData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (!error) {
        setPosts(posts.filter((p) => p.id !== postId));
      } else {
        alert("Error deleting post");
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Admin...</div>;
  }

  const publishedCount = posts?.filter((p) => p.status === "published").length ?? 0;
  const draftCount = posts?.filter((p) => p.status === "draft").length ?? 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="bg-[#E11D48] text-white font-black px-2 py-0.5 rounded">
              NN
            </div>
            <span className="font-bold text-sm">Admin</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <Eye size={16} />
              View Site
            </Link>

            <button 
              onClick={handleLogout}
              className="text-sm text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Posts" value={posts?.length ?? 0} />
          <StatCard title="Published" value={publishedCount} highlight />
          <StatCard title="Drafts" value={draftCount} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">All Posts</h2>
          <Link
            to="/admin/posts/new"
            className="bg-[#E11D48] hover:bg-red-700 px-4 py-2 rounded flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            New Post
          </Link>
        </div>

        {/* Table */}
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left hidden sm:table-cell">Category</th>
                <th className="p-3 text-left hidden md:table-cell">Status</th>
                <th className="p-3 text-left hidden md:table-cell">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {posts?.map((post) => (
                <tr
                  key={post.id}
                  className="border-t border-zinc-800 hover:bg-zinc-900/50"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-zinc-400" />
                      <span className="font-medium line-clamp-1">
                        {post.title}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 hidden sm:table-cell text-zinc-400">
                    {post.categories?.name ?? "—"}
                  </td>

                  <td className="p-3 hidden md:table-cell">
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        post.status === "published"
                          ? "bg-green-900 text-green-400"
                          : "bg-yellow-900 text-yellow-400"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>

                  <td className="p-3 hidden md:table-cell text-zinc-400">
                    {formatDate(post.created_at)}
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/posts/${post.id}`}>
                        <Edit
                          size={16}
                          className="text-zinc-400 hover:text-white"
                        />
                      </Link>

                      <button onClick={() => handleDelete(post.id)}>
                        <Trash2
                          size={16}
                          className="text-red-500 hover:text-red-400"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {(!posts || posts.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-zinc-500"
                  >
                    No posts yet. Create your first article.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="border border-zinc-800 rounded-lg p-5 bg-zinc-900">
      <p className="text-sm text-zinc-400">{title}</p>
      <p
        className={`text-3xl font-bold mt-1 ${
          highlight ? "text-[#E11D48]" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}