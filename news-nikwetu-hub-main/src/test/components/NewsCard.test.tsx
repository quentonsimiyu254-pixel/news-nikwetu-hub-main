import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NewsCard from "@/components/NewsCard";
import * as FramerMotion from "framer-motion";

// Mock framer-motion to avoid animation complications in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const mockProps = {
  title: "Test Article",
  slug: "test-article",
  excerpt: "This is a test excerpt",
  featuredImage: "https://example.com/image.jpg",
  categoryName: "Politics",
  categorySlug: "politics",
  publishedAt: "2026-02-16",
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("NewsCard", () => {
  describe("default variant", () => {
    it("should render with title", () => {
      renderWithRouter(<NewsCard {...mockProps} />);
      expect(screen.getByText("Test Article")).toBeInTheDocument();
    });

    it("should render excerpt when provided", () => {
      renderWithRouter(<NewsCard {...mockProps} />);
      expect(screen.getByText("This is a test excerpt")).toBeInTheDocument();
    });

    it("should render category name when provided", () => {
      renderWithRouter(<NewsCard {...mockProps} />);
      expect(screen.getByText("Politics")).toBeInTheDocument();
    });

    it("should render featured image", () => {
      renderWithRouter(<NewsCard {...mockProps} />);
      const img = screen.getByAltText("Test Article");
      expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
    });

    it("should link to category-based URL when categorySlug provided", () => {
      renderWithRouter(<NewsCard {...mockProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/politics/test-article");
    });

    it("should link to post-based URL when categorySlug not provided", () => {
      const props = { ...mockProps, categorySlug: undefined };
      renderWithRouter(<NewsCard {...props} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/post/test-article");
    });

    it("should use placeholder image when featured image not provided", () => {
      const props = { ...mockProps, featuredImage: null };
      renderWithRouter(<NewsCard {...props} />);
      const img = screen.getByAltText("Test Article");
      expect(img).toHaveAttribute("src", "/placeholder.svg");
    });
  });

  describe("hero variant", () => {
    it("should render hero variant correctly", () => {
      renderWithRouter(<NewsCard {...mockProps} variant="hero" />);
      expect(screen.getByText("Test Article")).toBeInTheDocument();
    });

    it("should have correct link structure in hero variant", () => {
      renderWithRouter(<NewsCard {...mockProps} variant="hero" />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/politics/test-article");
    });
  });

  describe("compact variant", () => {
    it("should render compact variant correctly", () => {
      renderWithRouter(<NewsCard {...mockProps} variant="compact" />);
      expect(screen.getByText("Test Article")).toBeInTheDocument();
    });

    it("should display featured image in compact variant", () => {
      renderWithRouter(<NewsCard {...mockProps} variant="compact" />);
      const img = screen.getByAltText("Test Article");
      expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
    });
  });

  describe("image loading", () => {
    it("should have lazy loading enabled", () => {
      renderWithRouter(<NewsCard {...mockProps} />);
      const img = screen.getByAltText("Test Article");
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  describe("required fields", () => {
    it("should render with only title and slug", () => {
      const minimalProps = {
        title: "Minimal Article",
        slug: "minimal-article",
      };
      renderWithRouter(<NewsCard {...minimalProps} />);
      expect(screen.getByText("Minimal Article")).toBeInTheDocument();
    });
  });
});
