import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/RichTextEditor";
import { slugify, uploadImage } from "@/lib/supabase-helpers";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PostEditor = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data || [];
    },
  });

  const { data: existingPost } = useQuery({
    queryKey: ["edit-post", id],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("*").eq("id", id!).single();
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setExcerpt(existingPost.excerpt || "");
      setContent(existingPost.content);
      setCategoryId(existingPost.category_id || "");
      setFeaturedImage(existingPost.featured_image || "");
      setTags(existingPost.tags?.join(", ") || "");
    }
  }, [existingPost]);

  useEffect(() => {
    if (!isEditing && title) setSlug(slugify(title));
  }, [title, isEditing]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setFeaturedImage(url);
    else toast.error("Failed to upload image");
    setUploading(false);
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);

    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content,
      category_id: categoryId || null,
      featured_image: featuredImage || null,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      author_id: user!.id,
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase.from("posts").update(postData).eq("id", id!));
    } else {
      ({ error } = await supabase.from("posts").insert(postData));
    }

    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(status === "published" ? "Post published!" : "Draft saved!");
      navigate("/admin");
    }
  };

  return (
    <>
      <Helmet><title>{isEditing ? "Edit Post" : "New Post"} - News Nikwetu Admin</title></Helmet>
      <div className="min-h-screen bg-background">
        <header className="bg-secondary text-secondary-foreground border-b border-border">
          <div className="news-container flex items-center justify-between h-14">
            <Link to="/admin" className="flex items-center gap-2 text-sm">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleSave("draft")} disabled={saving}>
                Save Draft
              </Button>
              <Button size="sm" onClick={() => handleSave("published")} disabled={saving}>
                {saving ? "Saving..." : "Publish"}
              </Button>
            </div>
          </div>
        </header>

        <main className="news-container py-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title" className="text-lg font-serif" />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="article-slug" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="politics, breaking" />
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary..." rows={2} maxLength={300} />
            </div>

            {/* Featured image */}
            <div>
              <Label>Featured Image</Label>
              <div className="mt-1">
                {featuredImage ? (
                  <div className="relative">
                    <img src={featuredImage} alt="Featured" className="w-full max-h-64 object-cover rounded-lg" />
                    <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setFeaturedImage("")}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary transition-colors">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        {uploading ? "Uploading..." : "Click to upload featured image"}
                      </span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
              </div>
            </div>

            {/* Content editor */}
            <div>
              <Label>Content</Label>
              <div className="mt-1">
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PostEditor;
