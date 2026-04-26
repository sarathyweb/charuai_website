"use client";

import type {
  CallHistoryFilters,
  CallHistoryItem,
} from "@/lib/dashboardApi";

const STATUS_OPTIONS = [
  "scheduled",
  "dispatching",
  "ringing",
  "in_progress",
  "completed",
  "missed",
  "deferred",
  "cancelled",
  "skipped",
];

const TYPE_OPTIONS = ["morning", "afternoon", "evening", "on_demand"];

function titleize(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDateTime(value: string | null): string {
  if (!value) return "Not recorded";
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "No duration";
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes === 0) return `${remaining}s`;
  return `${minutes}m ${remaining}s`;
}

function confidenceLabel(value: string | null): string | null {
  if (!value) return null;
  return titleize(value);
}

interface CallHistoryPanelProps {
  calls: CallHistoryItem[];
  filters: CallHistoryFilters;
  onFiltersChange: (filters: CallHistoryFilters) => void;
}

export default function CallHistoryPanel({
  calls,
  filters,
  onFiltersChange,
}: CallHistoryPanelProps) {
  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card overflow-hidden">
      <div className="grid gap-3 border-b border-warm-gray/20 p-5 sm:grid-cols-[1fr_1fr_120px]">
        <label className="text-[12px] font-medium text-muted">
          Status
          <select
            value={filters.status || ""}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                status: event.target.value || undefined,
              })
            }
            className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {titleize(status)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[12px] font-medium text-muted">
          Type
          <select
            value={filters.callType || ""}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                callType: event.target.value || undefined,
              })
            }
            className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
          >
            <option value="">All call types</option>
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {titleize(type)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[12px] font-medium text-muted">
          Limit
          <select
            value={filters.limit ?? 25}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                limit: Number(event.target.value),
              })
            }
            className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
          >
            {[10, 25, 50, 100].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </label>
      </div>

      {calls.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-muted">
          No calls match these filters.
        </div>
      ) : (
        <div>
          {calls.map((call) => (
            <div
              key={call.id}
              className="px-5 py-4 border-b border-warm-gray/10 last:border-b-0"
            >
              <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-dark">
                      {titleize(call.call_type)}
                    </span>
                    <span className="rounded bg-accent-surface px-2 py-0.5 text-[11px] font-medium text-primary">
                      {titleize(call.status)}
                    </span>
                    <span className="text-[11px] text-muted">
                      {titleize(call.occurrence_kind)} #{call.attempt_number}
                    </span>
                  </div>
                  <div className="mt-1 text-[12px] text-muted">
                    Scheduled {formatDateTime(call.scheduled_time)} &middot;{" "}
                    {formatDuration(call.duration_seconds)}
                  </div>
                  {(call.goal ||
                    call.next_action ||
                    call.accomplishments ||
                    call.tomorrow_intention) && (
                    <div className="mt-2 grid gap-1 text-[13px] text-dark">
                      {call.goal && <div>Goal: {call.goal}</div>}
                      {call.next_action && (
                        <div>Next action: {call.next_action}</div>
                      )}
                      {call.accomplishments && (
                        <div>Accomplishments: {call.accomplishments}</div>
                      )}
                      {call.tomorrow_intention && (
                        <div>Tomorrow: {call.tomorrow_intention}</div>
                      )}
                    </div>
                  )}
                  {(call.call_outcome_confidence ||
                    call.reflection_confidence ||
                    call.recap_sent_at) && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {confidenceLabel(call.call_outcome_confidence) && (
                        <span className="rounded bg-background px-2 py-1 text-[11px] text-muted">
                          Outcome: {confidenceLabel(call.call_outcome_confidence)}
                        </span>
                      )}
                      {confidenceLabel(call.reflection_confidence) && (
                        <span className="rounded bg-background px-2 py-1 text-[11px] text-muted">
                          Reflection: {confidenceLabel(call.reflection_confidence)}
                        </span>
                      )}
                      {call.recap_sent_at && (
                        <span className="rounded bg-background px-2 py-1 text-[11px] text-muted">
                          Recap sent {formatDateTime(call.recap_sent_at)}
                        </span>
                      )}
                    </div>
                  )}
                  {call.commitments && call.commitments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {call.commitments.map((commitment) => (
                        <span
                          key={commitment}
                          className="rounded bg-background px-2 py-1 text-[11px] text-muted"
                        >
                          {commitment}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-[12px] text-muted lg:text-right">
                  Started {formatDateTime(call.actual_start_time)}
                  <br />
                  Ended {formatDateTime(call.end_time)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
