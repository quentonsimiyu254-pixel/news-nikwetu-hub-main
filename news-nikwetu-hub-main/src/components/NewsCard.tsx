import { Link } from "react-router-dom";
import { formatDate } from "@/lib/supabase-helpers";
import { motion } from "framer-motion";

interface NewsCardProps {
  title: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  categoryName?: string;
  categorySlug?: string;
  slug: string;
  publishedAt?: string | null;
  variant?: "default" | "hero" | "compact";
}

const NewsCard = ({
  title, excerpt, featuredImage, categoryName, categorySlug, slug, publishedAt, variant = "default",
}: NewsCardProps) => {
  const postUrl = categorySlug ? `/${categorySlug}/${slug}` : `/post/${slug}`;

  if (variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to={postUrl} className="group block relative rounded-xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
          <img
            src={featuredImage || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            {categoryName && <span className="news-badge mb-3">{categoryName}</span>}
            <h2 className="font-serif font-bold text-xl md:text-3xl lg:text-4xl text-secondary-foreground mt-2 leading-tight">
              {title}
            </h2>
            {excerpt && (
              <p className="text-secondary-foreground/80 mt-2 text-sm md:text-base line-clamp-2 max-w-2xl">
                {excerpt}
              </p>
            )}
            {publishedAt && (
              <p className="text-secondary-foreground/60 text-xs mt-3">{formatDate(publishedAt)}</p>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={postUrl} className="group flex gap-3 py-3 border-b border-border last:border-0">
        {featuredImage && (
          <img
            src={featuredImage}
            alt={title}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h4>
          {publishedAt && (
            <p className="text-muted-foreground text-xs mt-1">{formatDate(publishedAt)}</p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={postUrl} className="news-card group block h-full">
        <div className="aspect-video overflow-hidden">
          <img
            src={featuredImage || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          {categoryName && <span className="news-badge mb-2">{categoryName}</span>}
          <h3 className="font-serif font-bold text-base md:text-lg leading-tight mt-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          {excerpt && (
            <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{excerpt}</p>
          )}
          {publishedAt && (
            <p className="text-muted-foreground text-xs mt-3">{formatDate(publishedAt)}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default NewsCard;
