"use client";

interface Stats {
  streak: { current: number; best: number };
  week: { calls_completed: number; calls_total: number; prev_calls_completed: number };
  goals: { completion_pct: number; prev_completion_pct: number };
}

function TrendIndicator({ current, previous }: { current: number; previous: number }) {
  if (current > previous) return <span className="text-[12px] text-green-600">&uarr; from {previous}</span>;
  if (current < previous) return <span className="text-[12px] text-muted">&darr; from {previous}</span>;
  return <span className="text-[12px] text-muted">same as last week</span>;
}

export default function ProgressStats({ stats }: { stats: Stats }) {
  const goalDiff = stats.goals.completion_pct - stats.goals.prev_completion_pct;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-surface border border-warm-gray/20 rounded-xl p-5 shadow-card">
        <div className="text-[11px] uppercase tracking-wider text-muted font-medium">Current Streak</div>
        <div className="text-[32px] font-bold text-dark mt-1">{stats.streak.current}</div>
        <div className="text-[12px] text-green-600">days</div>
      </div>
      <div className="bg-surface border border-warm-gray/20 rounded-xl p-5 shadow-card">
        <div className="text-[11px] uppercase tracking-wider text-muted font-medium">Best Streak</div>
        <div className="text-[32px] font-bold text-dark mt-1">{stats.streak.best}</div>
        <div className="text-[12px] text-muted">days</div>
      </div>
      <div className="bg-surface border border-warm-gray/20 rounded-xl p-5 shadow-card">
        <div className="text-[11px] uppercase tracking-wider text-muted font-medium">This Week</div>
        <div className="text-[32px] font-bold text-dark mt-1">{stats.week.calls_completed}/{stats.week.calls_total}</div>
        <TrendIndicator current={stats.week.calls_completed} previous={stats.week.prev_calls_completed} />
      </div>
      <div className="bg-surface border border-warm-gray/20 rounded-xl p-5 shadow-card">
        <div className="text-[11px] uppercase tracking-wider text-muted font-medium">Goals Completed</div>
        <div className="text-[32px] font-bold text-dark mt-1">{stats.goals.completion_pct}%</div>
        <span className={`text-[12px] ${goalDiff >= 0 ? "text-green-600" : "text-muted"}`}>
          {goalDiff >= 0 ? "\u2191" : "\u2193"} {Math.abs(goalDiff)}% vs last week
        </span>
      </div>
    </div>
  );
}
