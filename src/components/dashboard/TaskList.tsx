"use client";

import { useState } from "react";
import type { Task, TaskStatus, TaskUpdatePayload } from "@/lib/dashboardApi";

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-warm-gray",
};

const TABS: { id: TaskStatus; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "snoozed", label: "Snoozed" },
  { id: "completed", label: "Completed" },
];

function priorityLabel(p: number): string {
  if (p >= 70) return "high";
  if (p >= 40) return "medium";
  return "low";
}

function timeAgo(date: string | null): string {
  if (!date) return "unknown";
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  return `${Math.floor(days / 7)} weeks ago`;
}

function formatDateTime(date: string | null): string {
  if (!date) return "unknown";
  return new Date(date).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function defaultSnoozeValue(): string {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  return date.toISOString().slice(0, 16);
}

interface TaskListProps {
  pending: Task[];
  completed: Task[];
  snoozed: Task[];
  busy: boolean;
  onUpdate: (taskId: number, payload: TaskUpdatePayload) => Promise<void>;
  onComplete: (taskId: number) => Promise<void>;
  onSnooze: (taskId: number, snoozeUntil: string) => Promise<void>;
  onUnsnooze: (taskId: number) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

export default function TaskList({
  pending,
  completed,
  snoozed,
  busy,
  onUpdate,
  onComplete,
  onSnooze,
  onUnsnooze,
  onDelete,
}: TaskListProps) {
  const [tab, setTab] = useState<TaskStatus>("pending");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState(50);
  const [snoozingId, setSnoozingId] = useState<number | null>(null);
  const [snoozeUntil, setSnoozeUntil] = useState(defaultSnoozeValue);

  const tasksByStatus = { pending, completed, snoozed };
  const tasks = tasksByStatus[tab];

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setSnoozingId(null);
  };

  const saveEdit = async (taskId: number) => {
    await onUpdate(taskId, {
      title: editTitle.trim(),
      priority: editPriority,
    });
    setEditingId(null);
  };

  const startSnooze = (taskId: number) => {
    setSnoozingId(taskId);
    setSnoozeUntil(defaultSnoozeValue());
    setEditingId(null);
  };

  const saveSnooze = async (taskId: number) => {
    if (!snoozeUntil) return;
    await onSnooze(taskId, new Date(snoozeUntil).toISOString());
    setSnoozingId(null);
  };

  const confirmDelete = async (task: Task) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Delete task "${task.title}"?`)
    ) {
      return;
    }
    await onDelete(task.id);
  };

  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card overflow-hidden">
      <div className="flex border-b border-warm-gray/20 px-5 overflow-x-auto">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`py-3 px-4 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === item.id
                ? "text-primary border-primary"
                : "text-muted border-transparent"
            }`}
          >
            {item.label} ({tasksByStatus[item.id].length})
          </button>
        ))}
      </div>
      {tasks.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-muted">
          {tab === "pending" && "No pending tasks yet."}
          {tab === "snoozed" && "No snoozed tasks."}
          {tab === "completed" && "No completed tasks yet."}
        </div>
      ) : (
        <div>
          {tasks.map((task) => {
            const level = priorityLabel(task.priority);
            const isEditing = editingId === task.id;
            const isSnoozing = snoozingId === task.id;
            return (
              <div
                key={task.id}
                className="px-5 py-4 border-b border-warm-gray/10 last:border-b-0"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-2 h-2 rounded-full ${PRIORITY_DOT[level]} mt-2 flex-shrink-0`}
                  />
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_120px_auto]">
                        <label className="sr-only" htmlFor={`task-title-${task.id}`}>
                          Task title
                        </label>
                        <input
                          id={`task-title-${task.id}`}
                          value={editTitle}
                          onChange={(event) => setEditTitle(event.target.value)}
                          className="w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
                        />
                        <label
                          className="sr-only"
                          htmlFor={`task-priority-${task.id}`}
                        >
                          Task priority
                        </label>
                        <input
                          id={`task-priority-${task.id}`}
                          type="number"
                          min={0}
                          max={100}
                          value={editPriority}
                          onChange={(event) =>
                            setEditPriority(Number(event.target.value))
                          }
                          className="w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => saveEdit(task.id)}
                            aria-label={`Save ${task.title}`}
                            className="rounded-lg bg-primary px-3 py-2 text-[12px] font-medium text-white disabled:opacity-60"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-warm-gray/40 px-3 py-2 text-[12px] font-medium text-muted"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-dark break-words">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-muted mt-0.5">
                          Added {timeAgo(task.created_at)} &middot; Priority:{" "}
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                          {task.snoozed_until &&
                            ` - Snoozed until ${formatDateTime(task.snoozed_until)}`}
                          {task.completed_at &&
                            ` - Completed ${formatDateTime(task.completed_at)}`}
                        </div>
                      </>
                    )}
                    {isSnoozing && (
                      <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-center">
                        <label
                          className="text-[12px] font-medium text-muted"
                          htmlFor={`snooze-until-${task.id}`}
                        >
                          Snooze until
                        </label>
                        <input
                          id={`snooze-until-${task.id}`}
                          type="datetime-local"
                          required
                          value={snoozeUntil}
                          onChange={(event) => setSnoozeUntil(event.target.value)}
                          className="rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
                        />
                        <button
                          type="button"
                          disabled={busy || !snoozeUntil}
                          onClick={() => saveSnooze(task.id)}
                          aria-label={`Save snooze ${task.title}`}
                          className="rounded-lg bg-primary px-3 py-2 text-[12px] font-medium text-white disabled:opacity-60"
                        >
                          Save snooze
                        </button>
                        <button
                          type="button"
                          onClick={() => setSnoozingId(null)}
                          className="rounded-lg border border-warm-gray/40 px-3 py-2 text-[12px] font-medium text-muted"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => startEdit(task)}
                      aria-label={`Edit ${task.title}`}
                      className="rounded-lg border border-warm-gray/40 px-3 py-1.5 text-[12px] font-medium text-muted hover:text-dark disabled:opacity-60"
                    >
                      Edit
                    </button>
                    {tab !== "completed" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onComplete(task.id)}
                        aria-label={`Complete ${task.title}`}
                        className="rounded-lg border border-green-200 px-3 py-1.5 text-[12px] font-medium text-green-700 hover:bg-green-50 disabled:opacity-60"
                      >
                        Complete
                      </button>
                    )}
                    {tab === "snoozed" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onUnsnooze(task.id)}
                        aria-label={`Unsnooze ${task.title}`}
                        className="rounded-lg border border-primary/30 px-3 py-1.5 text-[12px] font-medium text-primary hover:bg-accent-surface disabled:opacity-60"
                      >
                        Unsnooze
                      </button>
                    ) : tab === "pending" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => startSnooze(task.id)}
                        aria-label={`Snooze ${task.title}`}
                        className="rounded-lg border border-warm-gray/40 px-3 py-1.5 text-[12px] font-medium text-muted hover:text-dark disabled:opacity-60"
                      >
                        Snooze
                      </button>
                    ) : null}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => confirmDelete(task)}
                      aria-label={`Delete ${task.title}`}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
