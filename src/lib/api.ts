import { auth } from "./firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.charuai.com";

function redirectToLogin(): void {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

export async function authFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE}${path}`;

  if (!auth.currentUser) {
    redirectToLogin();
    return new Response(JSON.stringify({ detail: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = await auth.currentUser.getIdToken();
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    try {
      await auth.signOut();
    } catch {
      // Redirect even if Firebase cannot clear the local session immediately.
    }
    redirectToLogin();
  }

  return response;
}
