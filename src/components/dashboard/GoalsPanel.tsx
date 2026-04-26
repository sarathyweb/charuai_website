"use client";

import { useState } from "react";
import type {
  Goal,
  GoalStatus,
  GoalUpdatePayload,
  GoalWritePayload,
} from "@/lib/dashboardApi";

const TABS: { id: GoalStatus; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "abandoned", label: "Abandoned" },
];

function formatDate(date: string | null): string {
  if (!date) return "No target date";
  return new Date(`${date}T00:00:00`).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface GoalsPanelProps {
  active: Goal[];
  completed: Goal[];
  abandoned: Goal[];
  busy: boolean;
  onCreate: (payload: GoalWritePayload) => Promise<void>;
  onUpdate: (goalId: number, payload: GoalUpdatePayload) => Promise<void>;
  onComplete: (goalId: number) => Promise<void>;
  onAbandon: (goalId: number) => Promise<void>;
  onDelete: (goalId: number) => Promise<void>;
}

export default function GoalsPanel({
  active,
  completed,
  abandoned,
  busy,
  onCreate,
  onUpdate,
  onComplete,
  onAbandon,
  onDelete,
}: GoalsPanelProps) {
  const [tab, setTab] = useState<GoalStatus>("active");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTargetDate, setEditTargetDate] = useState("");

  const goalsByStatus = { active, completed, abandoned };
  const goals = goalsByStatus[tab];

  const createGoal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreate({
      title: title.trim(),
      description: description.trim() || null,
      target_date: targetDate || undefined,
    });
    setTitle("");
    setDescription("");
    setTargetDate("");
  };

  const startEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setEditTitle(goal.title);
    setEditDescription(goal.description || "");
    setEditTargetDate(goal.target_date || "");
  };

  const saveEdit = async (goalId: number) => {
    await onUpdate(goalId, {
      title: editTitle.trim(),
      description: editDescription.trim() || null,
      target_date: editTargetDate || null,
    });
    setEditingId(null);
  };

  const confirmDelete = async (goal: Goal) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Delete goal "${goal.title}"?`)
    ) {
      return;
    }
    await onDelete(goal.id);
  };

  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card overflow-hidden">
      <form
        onSubmit={createGoal}
        className="grid gap-3 border-b border-warm-gray/20 p-5 lg:grid-cols-[1fr_1fr_160px_auto] lg:items-end"
      >
        <label className="text-[12px] font-medium text-muted">
          Goal
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ship the launch checklist"
            className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
          />
        </label>
        <label className="text-[12px] font-medium text-muted">
          Description
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional context"
            className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
          />
        </label>
        <label className="text-[12px] font-medium text-muted">
          Target
          <input
            type="date"
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
            className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-white disabled:opacity-60"
        >
          Add Goal
        </button>
      </form>

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
            {item.label} ({goalsByStatus[item.id].length})
          </button>
        ))}
      </div>

      {goals.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-muted">
          {tab === "active" && "No active goals yet."}
          {tab === "completed" && "No completed goals yet."}
          {tab === "abandoned" && "No abandoned goals."}
        </div>
      ) : (
        <div>
          {goals.map((goal) => {
            const isEditing = editingId === goal.id;
            return (
              <div
                key={goal.id}
                className="px-5 py-4 border-b border-warm-gray/10 last:border-b-0"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="grid gap-2 lg:grid-cols-[1fr_1fr_150px_auto]">
                        <label className="sr-only" htmlFor={`goal-title-${goal.id}`}>
                          Goal title
                        </label>
                        <input
                          id={`goal-title-${goal.id}`}
                          value={editTitle}
                          onChange={(event) => setEditTitle(event.target.value)}
                          className="w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
                        />
                        <label
                          className="sr-only"
                          htmlFor={`goal-description-${goal.id}`}
                        >
                          Goal description
                        </label>
                        <input
                          id={`goal-description-${goal.id}`}
                          value={editDescription}
                          onChange={(event) =>
                            setEditDescription(event.target.value)
                          }
                          className="w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
                        />
                        <label
                          className="sr-only"
                          htmlFor={`goal-target-${goal.id}`}
                        >
                          Goal target date
                        </label>
                        <input
                          id={`goal-target-${goal.id}`}
                          type="date"
                          value={editTargetDate}
                          onChange={(event) =>
                            setEditTargetDate(event.target.value)
                          }
                          className="w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => saveEdit(goal.id)}
                            aria-label={`Save ${goal.title}`}
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
                        <div className="text-sm font-semibold text-dark break-words">
                          {goal.title}
                        </div>
                        {goal.description && (
                          <div className="mt-1 text-[13px] text-muted break-words">
                            {goal.description}
                          </div>
                        )}
                        <div className="mt-1 text-[11px] text-muted">
                          {formatDate(goal.target_date)}
                          {goal.completed_at &&
                            ` - Completed ${formatDate(goal.completed_at.slice(0, 10))}`}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => startEdit(goal)}
                      aria-label={`Edit ${goal.title}`}
                      className="rounded-lg border border-warm-gray/40 px-3 py-1.5 text-[12px] font-medium text-muted hover:text-dark disabled:opacity-60"
                    >
                      Edit
                    </button>
                    {tab === "active" && (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onComplete(goal.id)}
                          aria-label={`Complete ${goal.title}`}
                          className="rounded-lg border border-green-200 px-3 py-1.5 text-[12px] font-medium text-green-700 hover:bg-green-50 disabled:opacity-60"
                        >
                          Complete
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onAbandon(goal.id)}
                          aria-label={`Abandon ${goal.title}`}
                          className="rounded-lg border border-warm-gray/40 px-3 py-1.5 text-[12px] font-medium text-muted hover:text-dark disabled:opacity-60"
                        >
                          Abandon
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => confirmDelete(goal)}
                      aria-label={`Delete ${goal.title}`}
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
