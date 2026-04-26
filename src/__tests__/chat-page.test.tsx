import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import ChatPage from "@/app/(app)/chat/page";
import { streamChatMessage } from "@/lib/chatApi";

vi.mock("@/lib/chatApi", () => ({
  streamChatMessage: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(streamChatMessage).mockReset();
});

describe("ChatPage", () => {
  test("streams a user message into the conversation", async () => {
    vi.mocked(streamChatMessage).mockImplementation(async (_message, handlers) => {
      handlers.onSession?.("session-123456");
      handlers.onDelta?.("Let's pick one tiny first step.");
      handlers.onDone?.({
        session_id: "session-123456",
        reply: "Let's pick one tiny first step.",
      });
      return {
        session_id: "session-123456",
        reply: "Let's pick one tiny first step.",
      };
    });

    render(<ChatPage />);

    fireEvent.change(screen.getByLabelText("Message Charu"), {
      target: { value: "I feel stuck on taxes" },
    });
    fireEvent.click(screen.getByLabelText("Send message"));

    expect(await screen.findByText("I feel stuck on taxes")).toBeDefined();
    expect(await screen.findByText("Let's pick one tiny first step.")).toBeDefined();
    expect(screen.getByText("Session session-")).toBeDefined();
    expect(streamChatMessage).toHaveBeenCalledWith(
      "I feel stuck on taxes",
      expect.any(Object),
    );
  });

  test("shows a recoverable error when the stream fails", async () => {
    vi.mocked(streamChatMessage).mockRejectedValueOnce(new Error("Network down"));

    render(<ChatPage />);

    fireEvent.change(screen.getByLabelText("Message Charu"), {
      target: { value: "Can you hear me?" },
    });
    fireEvent.click(screen.getByLabelText("Send message"));

    expect(await screen.findByText("Network down")).toBeDefined();
    fireEvent.change(screen.getByLabelText("Message Charu"), {
      target: { value: "Trying again" },
    });
    await waitFor(() =>
      expect(
        (screen.getByLabelText("Send message") as HTMLButtonElement).disabled,
      ).toBe(false),
    );
  });
});
