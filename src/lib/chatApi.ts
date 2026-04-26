import { authFetch } from "./api";

export interface ChatResponse {
  reply: string;
  session_id: string;
}

export interface ChatStreamHandlers {
  onSession?: (sessionId: string) => void;
  onDelta?: (text: string) => void;
  onDone?: (response: ChatResponse) => void;
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === "string") message = body.detail;
    } catch {
      // Keep the status fallback if the error body is not JSON.
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  return parseJson<ChatResponse>(
    await authFetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }),
  );
}

function parseSseEvent(raw: string): { event: string; data: unknown } | null {
  const lines = raw.split(/\r?\n/);
  let event = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.slice("event:".length).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice("data:".length).trimStart());
    }
  }

  if (dataLines.length === 0) return null;

  try {
    return { event, data: JSON.parse(dataLines.join("\n")) };
  } catch {
    return null;
  }
}

export async function streamChatMessage(
  message: string,
  handlers: ChatStreamHandlers = {},
): Promise<ChatResponse> {
  const response = await authFetch("/api/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    await parseJson(response);
  }

  if (!response.body) {
    const fallback = await sendChatMessage(message);
    handlers.onDone?.(fallback);
    return fallback;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sessionId = "";
  let reply = "";

  const consume = (chunk: string) => {
    const parsed = parseSseEvent(chunk);
    if (!parsed) return;

    if (parsed.event === "session") {
      const data = parsed.data as { session_id?: string };
      if (data.session_id) {
        sessionId = data.session_id;
        handlers.onSession?.(sessionId);
      }
      return;
    }

    if (parsed.event === "delta") {
      const data = parsed.data as { text?: string };
      if (data.text) {
        reply += data.text;
        handlers.onDelta?.(data.text);
      }
      return;
    }

    if (parsed.event === "done") {
      const data = parsed.data as { session_id?: string; reply?: string };
      sessionId = data.session_id || sessionId;
      reply = data.reply ?? reply;
      handlers.onDone?.({ session_id: sessionId, reply });
      return;
    }

    if (parsed.event === "error") {
      const data = parsed.data as { error?: string };
      throw new Error(data.error || "Chat stream failed.");
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split(/\n\n/);
    buffer = parts.pop() || "";
    for (const part of parts) consume(part);
  }

  buffer += decoder.decode();
  if (buffer.trim()) consume(buffer);

  return { session_id: sessionId, reply };
}
