"use client";

import { useMemo, useState } from "react";
import type {
  CallWindow,
  CallWindowUpdatePayload,
  CallWindowWritePayload,
  WindowType,
} from "@/lib/dashboardApi";

const WINDOW_TYPES: WindowType[] = ["morning", "afternoon", "evening"];

const ICONS: Record<WindowType, string> = {
  morning: "\u{1F305}",
  afternoon: "\u{2600}\u{FE0F}",
  evening: "\u{1F319}",
};

const LABELS: Record<WindowType, string> = {
  morning: "Morning Call",
  afternoon: "Afternoon Check-in",
  evening: "Evening Reflection",
};

function toInputTime(value: string | null): string {
  if (!value) return "";
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let hour = Number(match[1]);
  const minute = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

interface CallScheduleProps {
  windows: CallWindow[];
  busy: boolean;
  onCreate: (payload: CallWindowWritePayload) => Promise<void>;
  onUpdate: (
    windowType: WindowType,
    payload: CallWindowUpdatePayload,
  ) => Promise<void>;
  onDelete: (windowType: WindowType) => Promise<void>;
}

export default function CallSchedule({
  windows,
  busy,
  onCreate,
  onUpdate,
  onDelete,
}: CallScheduleProps) {
  const missingTypes = useMemo(
    () => WINDOW_TYPES.filter((type) => !windows.some((w) => w.type === type)),
    [windows],
  );
  const [newType, setNewType] = useState<WindowType>("morning");
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("09:30");
  const [editingType, setEditingType] = useState<WindowType | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  const createType = missingTypes.includes(newType)
    ? newType
    : missingTypes[0] ?? newType;

  const startEdit = (window: CallWindow) => {
    setEditingType(window.type);
    setEditStart(toInputTime(window.start_time));
    setEditEnd(toInputTime(window.end_time));
  };

  const saveEdit = async (windowType: WindowType) => {
    if (!editStart || !editEnd) return;
    await onUpdate(windowType, {
      start_time: editStart,
      end_time: editEnd,
    });
    setEditingType(null);
  };

  const confirmDelete = async (windowType: WindowType) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Remove ${LABELS[windowType]}?`)
    ) {
      return;
    }
    await onDelete(windowType);
  };

  return (
    <div className="space-y-3">
      {windows.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {windows.map((w) => {
            const isEditing = editingType === w.type;
            return (
              <div
                key={w.type}
                className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-5"
              >
                <div className="flex items-center gap-2.5 mb-3.5">
                  <span className="text-[22px]">{ICONS[w.type]}</span>
                  <span className="text-sm font-semibold text-dark">
                    {LABELS[w.type]}
                  </span>
                  <span
                    className={`ml-auto text-[11px] font-medium px-2.5 py-0.5 rounded ${
                      w.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-warm-gray/20 text-muted"
                    }`}
                  >
                    {w.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-[12px] font-medium text-muted">
                        Start
                        <input
                          type="time"
                          required
                          value={editStart}
                          onChange={(event) => setEditStart(event.target.value)}
                          className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
                        />
                      </label>
                      <label className="text-[12px] font-medium text-muted">
                        End
                        <input
                          type="time"
                          required
                          value={editEnd}
                          onChange={(event) => setEditEnd(event.target.value)}
                          className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
                        />
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={busy || !editStart || !editEnd}
                        onClick={() => saveEdit(w.type)}
                        aria-label={`Save ${w.type} window`}
                        className="rounded-lg bg-primary px-3 py-2 text-[12px] font-medium text-white disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingType(null)}
                        className="rounded-lg border border-warm-gray/40 px-3 py-2 text-[12px] font-medium text-muted"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-[24px] font-bold text-dark">
                      {w.start_time || "Not set"} &ndash; {w.end_time || "Not set"}
                    </div>
                    <div className="text-[12px] text-muted mt-1">
                      {w.timezone}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => startEdit(w)}
                        aria-label={`Edit ${w.type} window`}
                        className="rounded-lg border border-warm-gray/40 px-3 py-1.5 text-[12px] font-medium text-muted hover:text-dark disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => confirmDelete(w.type)}
                        aria-label={`Remove ${w.type} window`}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-8 text-center text-sm text-muted">
          No call windows configured yet.
        </div>
      )}

      {missingTypes.length > 0 && (
        <form
          className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-5"
          onSubmit={(event) => {
            event.preventDefault();
            void onCreate({
              window_type: createType,
              start_time: newStart,
              end_time: newEnd,
            });
          }}
        >
          <div className="grid gap-3 sm:grid-cols-[180px_1fr_1fr_auto] sm:items-end">
            <label className="text-[12px] font-medium text-muted">
              Window
              <select
                value={createType}
                onChange={(event) => setNewType(event.target.value as WindowType)}
                className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
              >
                {missingTypes.map((type) => (
                  <option key={type} value={type}>
                    {LABELS[type]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[12px] font-medium text-muted">
              Start
              <input
                type="time"
                required
                value={newStart}
                onChange={(event) => setNewStart(event.target.value)}
                className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
              />
            </label>
            <label className="text-[12px] font-medium text-muted">
              End
              <input
                type="time"
                required
                value={newEnd}
                onChange={(event) => setNewEnd(event.target.value)}
                className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
              />
            </label>
            <button
              type="submit"
              disabled={busy || !newStart || !newEnd}
              className="rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-white disabled:opacity-60"
            >
              Add Window
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
