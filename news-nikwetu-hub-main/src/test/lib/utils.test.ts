import { describe, it, expect } from "vitest";
import { cn, formatDate } from "@/lib/utils";

describe("utils", () => {
  describe("cn function", () => {
    it("should merge simple class names", () => {
      expect(cn("px-2", "py-1")).toBe("px-2 py-1");
    });

    it("should handle conditional classes with objects", () => {
      expect(cn("px-2", { "py-1": true, "py-2": false })).toBe("px-2 py-1");
    });

    it("should remove falsy values", () => {
      expect(cn("px-2", false, undefined, null, "py-1")).toBe("px-2 py-1");
    });

    it("should handle tailwind conflicting classes correctly", () => {
      const result = cn("px-2 py-1", "py-2");
      expect(result).toContain("px-2");
      expect(result).toContain("py-2");
      expect(result).not.toContain("py-1");
    });

    it("should handle arrays of classes", () => {
      expect(cn(["px-2", "py-1"], ["mx-2"])).toContain("px-2");
      expect(cn(["px-2", "py-1"], ["mx-2"])).toContain("py-1");
      expect(cn(["px-2", "py-1"], ["mx-2"])).toContain("mx-2");
    });

    it("should merge complex class combinations", () => {
      const result = cn(
        "flex items-center",
        { "justify-center": true },
        "gap-2",
        undefined,
        false && "hidden",
        "text-white"
      );
      expect(result).toContain("flex");
      expect(result).toContain("items-center");
      expect(result).toContain("justify-center");
      expect(result).toContain("gap-2");
      expect(result).toContain("text-white");
    });

    it("should return empty string when no classes provided", () => {
      expect(cn()).toBe("");
    });

    it("should handle with empty strings", () => {
      expect(cn("", "px-2", "")).toBe("px-2");
    });
  });

  describe("formatDate function", () => {
    it("should format date string correctly", () => {
      const date = "2026-02-16";
      const result = formatDate(date);
      expect(result).toMatch(/Feb.*16.*2026/);
    });

    it("should format Date object correctly", () => {
      const date = new Date("2026-02-16");
      const result = formatDate(date);
      expect(result).toMatch(/Feb.*16.*2026/);
    });

    it("should format different dates correctly", () => {
      const date1 = formatDate("2025-01-01");
      const date2 = formatDate("2025-12-31");
      expect(date1).toMatch(/Jan/);
      expect(date2).toMatch(/Dec/);
    });

    it("should handle ISO date format", () => {
      const result = formatDate("2026-02-16T10:30:00Z");
      expect(result).toMatch(/Feb.*16.*2026/);
    });

    it("should return a string with month, day, and year", () => {
      const result = formatDate("2026-06-15");
      expect(result).toMatch(/\d{1,2}.*\d{4}/);
    });

    it("should format numeric months correctly", () => {
      const date1 = formatDate("2026-01-15"); // January
      const date2 = formatDate("2026-06-15"); // June
      const date3 = formatDate("2026-12-15"); // December
      
      expect(date1).toContain("Jan");
      expect(date2).toContain("Jun");
      expect(date3).toContain("Dec");
    });
  });
});
