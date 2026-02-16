import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "@/components/Header";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Header", () => {
  describe("Logo and branding", () => {
    it("should render logo with NN text", () => {
      renderWithRouter(<Header />);
      expect(screen.getByText("NN")).toBeInTheDocument();
    });

    it("should render News Nikwetu title", () => {
      renderWithRouter(<Header />);
      expect(screen.getByText("News Nikwetu")).toBeInTheDocument();
    });

    it("should have logo link to home page", () => {
      renderWithRouter(<Header />);
      const links = screen.getAllByRole("link");
      const homeLink = links.find(a => a.getAttribute("href") === "/");
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe("Category navigation", () => {
    it("should display all categories", () => {
      renderWithRouter(<Header />);
      const categories = ["Politics", "Education", "Business", "Sports", "Entertainment", "Local News"];
      
      categories.forEach(category => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });

    it("should have links to category pages", () => {
      renderWithRouter(<Header />);
      const links = screen.getAllByRole("link");
      const hasCategoryLinks = links.some(link => 
        link.getAttribute("href")?.includes("/category/")
      );
      
      expect(hasCategoryLinks).toBe(true);
    });

    it("should have correct href for politics category", () => {
      const { container } = renderWithRouter(<Header />);
      const politicsLink = container.querySelector('a[href="/category/politics"]');
      expect(politicsLink).toBeInTheDocument();
    });
  });

  describe("Header structure", () => {
    it("should render within a header element", () => {
      const { container } = renderWithRouter(<Header />);
      const headerElement = container.querySelector("header");
      expect(headerElement).toBeInTheDocument();
    });

    it("should have sticky positioning", () => {
      const { container } = renderWithRouter(<Header />);
      const headerElement = container.querySelector("header");
      expect(headerElement).toHaveClass("sticky");
    });
  });

  describe("Link structure", () => {
    it("should render multiple navigation links", () => {
      renderWithRouter(<Header />);
      const links = screen.getAllByRole("link");
      // Should have: 1 logo link + 6 category links + mobile menu category links
      expect(links.length).toBeGreaterThan(6);
    });
  });

  describe("Button elements", () => {
    it("should have button elements for interactions", () => {
      renderWithRouter(<Header />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
