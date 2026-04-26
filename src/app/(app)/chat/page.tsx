"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { streamChatMessage } from "@/lib/chatApi";

type MessageRole = "assistant" | "user";
type MessageStatus = "ready" | "sending" | "error";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
}

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hey, I am here. What should we move forward?",
    status: "ready",
  },
];

function messageId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [input]);

  const updateAssistant = (
    id: string,
    updater: (message: ChatMessage) => ChatMessage,
  ) => {
    setMessages((current) =>
      current.map((message) => (message.id === id ? updater(message) : message)),
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMessage: ChatMessage = {
      id: messageId("user"),
      role: "user",
      content: text,
      status: "ready",
    };
    const assistantId = messageId("assistant");
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      status: "sending",
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput("");
    setSending(true);

    try {
      await streamChatMessage(text, {
        onSession: setSessionId,
        onDelta: (delta) => {
          updateAssistant(assistantId, (message) => ({
            ...message,
            content: `${message.content}${delta}`,
          }));
        },
        onDone: (response) => {
          setSessionId(response.session_id);
          updateAssistant(assistantId, (message) => ({
            ...message,
            content: response.reply || message.content,
            status: "ready",
          }));
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Charu could not reply.";
      updateAssistant(assistantId, (current) => ({
        ...current,
        content: message,
        status: "error",
      }));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-57px)] bg-background">
      <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-[1080px] flex-col px-4 py-5 sm:px-8">
        <header className="mb-4 grid gap-4 rounded-xl border border-warm-gray/25 bg-surface px-5 py-4 shadow-card sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden />
              Chat
            </div>
            <h1 className="mt-2 font-sans text-2xl font-bold text-dark">
              Charu
            </h1>
          </div>
          {sessionId && (
            <div className="rounded-lg border border-warm-gray/25 bg-background px-3 py-2 text-[12px] text-muted">
              Session {sessionId.slice(0, 8)}
            </div>
          )}
        </header>

        <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-warm-gray/25 bg-surface shadow-card">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="mx-auto flex max-w-[760px] flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-xl px-4 py-3 text-sm leading-6 shadow-sm ${
                      message.role === "user"
                        ? "bg-primary text-white"
                        : message.status === "error"
                          ? "border border-red-200 bg-red-50 text-red-700"
                          : "border border-warm-gray/25 bg-background text-text"
                    }`}
                  >
                    {message.status === "sending" && !message.content ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </span>
                    ) : (
                      <span className="whitespace-pre-wrap break-words">
                        {message.content}
                      </span>
                    )}
                    {message.status === "error" && (
                      <ExclamationTriangleIcon
                        className="mt-2 h-4 w-4"
                        aria-hidden
                      />
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-warm-gray/25 bg-surface px-4 py-4 sm:px-6"
          >
            <div className="mx-auto flex max-w-[760px] items-end gap-3 rounded-xl border border-warm-gray/30 bg-background p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <SparklesIcon className="mb-2.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden />
              <textarea
                ref={textareaRef}
                aria-label="Message Charu"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                className="max-h-40 min-h-10 flex-1 resize-none bg-transparent py-2 text-[15px] leading-6 text-text outline-none placeholder:text-muted"
                placeholder="Tell Charu what is on your mind"
              />
              <button
                type="submit"
                aria-label="Send message"
                title="Send message"
                disabled={!input.trim() || sending}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-accent-warm disabled:cursor-not-allowed disabled:opacity-45"
              >
                <PaperAirplaneIcon className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
