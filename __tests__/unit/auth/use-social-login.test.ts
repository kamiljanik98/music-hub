// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useSocialLogin from "@/hooks/auth/use-social-login";

const mockSignInWithOAuth = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { signInWithOAuth: mockSignInWithOAuth },
  }),
}));

describe("useSocialLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts OAuth with a callback redirect", async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: "https://discord.com/oauth" },
      error: null,
    });

    const { result } = renderHook(() => useSocialLogin());

    let resolved: { error: Error | null };

    await act(async () => {
      resolved = await result.current.socialLogin("discord");
    });

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    expect(resolved!.error).toBeNull();
  });

  it("returns the OAuth error", async () => {
    const oauthError = new Error("OAuth provider error");
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: oauthError,
    });

    const { result } = renderHook(() => useSocialLogin());

    let resolved: { error: Error | null };

    await act(async () => {
      resolved = await result.current.socialLogin("discord");
    });

    expect(resolved!.error).toBe(oauthError);
    expect(result.current.isSocialLoading).toBe(false);
  });
});
