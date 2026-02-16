import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

// Mock Supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Import after mocking
import * as supabaseModule from "@/integrations/supabase/client";
const mockSupabase = supabaseModule.supabase as any;

describe("useAuth hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AuthProvider", () => {
    it("should provide auth context to children", () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
      });
      mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty("user");
      expect(result.current).toHaveProperty("session");
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("signIn");
      expect(result.current).toHaveProperty("signOut");
    });

    it("should throw error when useAuth is used outside AuthProvider", () => {
      expect(() => renderHook(() => useAuth())).toThrow(
        "useAuth must be used within an AuthProvider"
      );
    });
  });

  describe("Session initialization", () => {
    it("should initialize with null session", async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
      });
      mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.session).toBeNull();
        expect(result.current.user).toBeNull();
      });
    });

    it("should set loading to false after initialization", async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
      });
      mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("Sign in functionality", () => {
    it("should have signIn method", async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
      });
      mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
        data: { subscription: { unsubscribe: vi.fn() } },
      });
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signIn).toBe("function");

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalled();
    });
  });

  describe("Sign out functionality", () => {
    it("should have signOut method", async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      mockSupabase.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
      });
      mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
        data: { subscription: { unsubscribe: vi.fn() } },
      });
      mockSupabase.auth.signOut.mockResolvedValueOnce({ error: null });

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signOut).toBe("function");

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    it("should handle session errors gracefully", async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      mockSupabase.auth.getSession.mockRejectedValueOnce(
        new Error("Network error")
      );
      mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.user).toBeNull();
      });
    });
  });
});

