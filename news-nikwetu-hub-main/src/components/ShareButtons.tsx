import { Facebook, Twitter, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm" className="h-8 w-8 p-0"><Facebook className="h-4 w-4" /></Button>
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm" className="h-8 w-8 p-0"><Twitter className="h-4 w-4" /></Button>
      </a>
      <a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm" className="h-8 w-8 p-0"><Share2 className="h-4 w-4" /></Button>
      </a>
    </div>
  );
};

export default ShareButtons;
