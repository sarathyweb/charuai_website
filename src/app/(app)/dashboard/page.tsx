"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import SectionNav from "@/components/dashboard/SectionNav";
import ProgressStats from "@/components/dashboard/ProgressStats";
import Heatmap from "@/components/dashboard/Heatmap";
import WeeklySummary from "@/components/dashboard/WeeklySummary";
import TaskList from "@/components/dashboard/TaskList";
import CallSchedule from "@/components/dashboard/CallSchedule";
import ProfileCard from "@/components/dashboard/ProfileCard";

interface DashboardData {
  streak: { current: number; best: number };
  week: { calls_completed: number; calls_total: number; prev_calls_completed: number };
  goals: { completion_pct: number; prev_completion_pct: number };
  heatmap: { date: string; level: number }[];
  weekly_summary: string;
}

interface Task {
  id: number;
  title: string;
  priority: number;
  status: string;
  source: string;
  created_at: string;
  completed_at: string | null;
}

interface CallWindow {
  type: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
}

interface Profile {
  name: string;
  phone: string;
  created_at: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [windows, setWindows] = useState<CallWindow[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    authFetch("/api/progress")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Something went wrong. Please try again."));

    authFetch("/api/tasks?status=pending")
      .then((r) => r.ok ? r.json() : { tasks: [] })
      .then((d) => setPendingTasks(d.tasks || []));

    authFetch("/api/tasks?status=completed")
      .then((r) => r.ok ? r.json() : { tasks: [] })
      .then((d) => setCompletedTasks(d.tasks || []));

    authFetch("/api/call-windows")
      .then((r) => r.ok ? r.json() : { windows: [] })
      .then((d) => setWindows(d.windows || []));

    authFetch("/api/user/profile")
      .then((r) => r.ok ? r.json() : null)
      .then(setProfile);
  }, []);

  return (
    <>
      <SectionNav />
      <div className="max-w-[960px] mx-auto px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Progress Section */}
        <section id="progress" className="mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">Progress</h2>
          {data ? (
            <div className="space-y-3">
              <ProgressStats stats={{ streak: data.streak, week: data.week, goals: data.goals }} />
              <Heatmap data={data.heatmap} />
              <WeeklySummary summary={data.weekly_summary} />
            </div>
          ) : !error ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-surface border border-warm-gray/20 rounded-xl p-5 shadow-card animate-pulse">
                    <div className="h-3 w-20 bg-warm-gray/30 rounded mb-3" />
                    <div className="h-8 w-16 bg-warm-gray/30 rounded mb-2" />
                    <div className="h-3 w-12 bg-warm-gray/30 rounded" />
                  </div>
                ))}
              </div>
              <div className="h-32 bg-surface border border-warm-gray/20 rounded-xl shadow-card animate-pulse" />
              <div className="h-20 bg-surface border border-warm-gray/20 rounded-xl shadow-card animate-pulse" />
            </div>
          ) : null}
        </section>

        {/* Tasks Section */}
        <section id="tasks" className="mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">Tasks</h2>
          <TaskList pending={pendingTasks} completed={completedTasks} />
        </section>

        {/* Schedule Section */}
        <section id="schedule" className="mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">Call Schedule</h2>
          {windows.length > 0 ? (
            <CallSchedule windows={windows} />
          ) : (
            <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-8 text-center text-sm text-muted">
              No call windows configured yet. Tell Charu your preferred schedule during your next call.
            </div>
          )}
        </section>

        {/* Profile Section */}
        <section id="profile" className="mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">Profile</h2>
          {profile ? (
            <ProfileCard profile={profile} />
          ) : (
            <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-6 animate-pulse">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-warm-gray/30" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-warm-gray/30 rounded" />
                  <div className="h-3 w-24 bg-warm-gray/30 rounded" />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
