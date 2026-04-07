"use client";

import { useState } from "react";

interface Task {
  id: number;
  title: string;
  priority: number;
  status: string;
  source: string;
  created_at: string;
  completed_at: string | null;
}

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-warm-gray",
};

function priorityLabel(p: number): string {
  if (p >= 70) return "high";
  if (p >= 40) return "medium";
  return "low";
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  return `${Math.floor(days / 7)} weeks ago`;
}

export default function TaskList({
  pending,
  completed,
}: {
  pending: Task[];
  completed: Task[];
}) {
  const [tab, setTab] = useState<"pending" | "completed">("pending");
  const tasks = tab === "pending" ? pending : completed;

  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card overflow-hidden">
      <div className="flex border-b border-warm-gray/20 px-5">
        <button
          onClick={() => setTab("pending")}
          className={`py-3 px-4 text-[13px] font-medium border-b-2 transition-colors ${
            tab === "pending"
              ? "text-primary border-primary"
              : "text-muted border-transparent"
          }`}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setTab("completed")}
          className={`py-3 px-4 text-[13px] font-medium border-b-2 transition-colors ${
            tab === "completed"
              ? "text-primary border-primary"
              : "text-muted border-transparent"
          }`}
        >
          Completed ({completed.length})
        </button>
      </div>
      {tasks.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-muted">
          {tab === "pending"
            ? "No tasks yet. Charu will track tasks from your daily calls."
            : "No completed tasks yet."}
        </div>
      ) : (
        <div>
          {tasks.map((task) => {
            const level = priorityLabel(task.priority);
            return (
              <div key={task.id} className="flex items-center px-5 py-3.5 border-b border-warm-gray/10 last:border-b-0">
                <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[level]} mr-3.5 flex-shrink-0`} />
                <div>
                  <div className="text-sm text-dark">{task.title}</div>
                  <div className="text-[11px] text-muted mt-0.5">
                    Added {timeAgo(task.created_at)} &middot; Priority: {level.charAt(0).toUpperCase() + level.slice(1)}
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
