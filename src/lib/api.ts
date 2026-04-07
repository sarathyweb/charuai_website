import { auth } from "./firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.charuai.com";

export async function authFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE}${path}`;
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return fetch(url, options);
}
