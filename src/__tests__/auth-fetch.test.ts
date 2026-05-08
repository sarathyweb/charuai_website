import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getIdToken: vi.fn(),
  signOut: vi.fn(),
  currentUser: null as null | { getIdToken: () => Promise<string> },
}));

vi.mock("@/lib/firebase", () => ({
  auth: {
    get currentUser() {
      return mocks.currentUser;
    },
    signOut: mocks.signOut,
  },
}));

import { authFetch } from "@/lib/api";

beforeEach(() => {
  mocks.getIdToken.mockReset();
  mocks.signOut.mockReset();
  mocks.currentUser = { getIdToken: mocks.getIdToken };
  mocks.getIdToken.mockResolvedValue("jwt-token");
  vi.stubGlobal("fetch", vi.fn());
  window.history.pushState({}, "", "/login");
});

describe("authFetch", () => {
  test("attaches Firebase bearer token", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await authFetch("/api/profile", { method: "GET" });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.charuai.com/api/profile",
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Headers),
      }),
    );
    const headers = vi.mocked(fetch).mock.calls[0][1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer jwt-token");
  });

  test("signs out on backend 401", async () => {
    window.history.pushState({}, "", "/dashboard");
    vi.mocked(fetch).mockResolvedValueOnce(new Response("{}", { status: 401 }));

    const response = await authFetch("/api/profile");

    expect(response.status).toBe(401);
    expect(mocks.signOut).toHaveBeenCalledOnce();
  });

  test("still returns backend 401 when sign-out fails", async () => {
    window.history.pushState({}, "", "/dashboard");
    mocks.signOut.mockRejectedValueOnce(new Error("sign-out failed"));
    vi.mocked(fetch).mockResolvedValueOnce(new Response("{}", { status: 401 }));

    const response = await authFetch("/api/profile");

    expect(response.status).toBe(401);
    expect(mocks.signOut).toHaveBeenCalledOnce();
  });

  test("does not call fetch without a signed-in user", async () => {
    window.history.pushState({}, "", "/dashboard");
    mocks.currentUser = null;

    const response = await authFetch("/api/profile");

    expect(response.status).toBe(401);
    expect(fetch).not.toHaveBeenCalled();
  });
});
