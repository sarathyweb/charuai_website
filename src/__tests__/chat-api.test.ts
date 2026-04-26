import { describe, expect, test, vi, beforeEach } from "vitest";
import { authFetch } from "@/lib/api";
import { sendChatMessage, streamChatMessage } from "@/lib/chatApi";

vi.mock("@/lib/api", () => ({
  authFetch: vi.fn(),
}));

function streamResponse(body: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(body));
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

beforeEach(() => {
  vi.mocked(authFetch).mockReset();
});

describe("chatApi", () => {
  test("sendChatMessage posts to the authenticated chat endpoint", async () => {
    vi.mocked(authFetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ reply: "Done", session_id: "session-a" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const result = await sendChatMessage("hello");

    expect(result).toEqual({ reply: "Done", session_id: "session-a" });
    expect(authFetch).toHaveBeenCalledWith("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "hello" }),
    });
  });

  test("streamChatMessage parses session, delta, and done events", async () => {
    vi.mocked(authFetch).mockResolvedValueOnce(
      streamResponse(
        [
          'event: session\ndata: {"session_id":"session-b"}',
          'event: delta\ndata: {"text":"One "}',
          'event: delta\ndata: {"text":"step"}',
          'event: done\ndata: {"session_id":"session-b","reply":"One step"}',
          "",
        ].join("\n\n"),
      ),
    );
    const onSession = vi.fn();
    const onDelta = vi.fn();
    const onDone = vi.fn();

    const result = await streamChatMessage("start", {
      onSession,
      onDelta,
      onDone,
    });

    expect(result).toEqual({ session_id: "session-b", reply: "One step" });
    expect(onSession).toHaveBeenCalledWith("session-b");
    expect(onDelta).toHaveBeenNthCalledWith(1, "One ");
    expect(onDelta).toHaveBeenNthCalledWith(2, "step");
    expect(onDone).toHaveBeenCalledWith({
      session_id: "session-b",
      reply: "One step",
    });
    expect(authFetch).toHaveBeenCalledWith("/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "start" }),
    });
  });
});
