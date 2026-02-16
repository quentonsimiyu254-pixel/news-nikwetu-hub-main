import { supabase } from "@/integrations/supabase/client";

export const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

export const uploadImage = async (file: File): Promise<string | null> => {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  const { error } = await supabase.storage.from("post-images").upload(fileName, file);
  if (error) { console.error("Upload error:", error); return null; }
  const { data } = supabase.storage.from("post-images").getPublicUrl(fileName);
  return data.publicUrl;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
};
