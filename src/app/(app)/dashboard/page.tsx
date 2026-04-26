"use client";

import { useCallback, useEffect, useState } from "react";
import SectionNav from "@/components/dashboard/SectionNav";
import ProgressStats from "@/components/dashboard/ProgressStats";
import Heatmap from "@/components/dashboard/Heatmap";
import WeeklySummary from "@/components/dashboard/WeeklySummary";
import TaskList from "@/components/dashboard/TaskList";
import CallSchedule from "@/components/dashboard/CallSchedule";
import ProfileCard from "@/components/dashboard/ProfileCard";
import GoalsPanel from "@/components/dashboard/GoalsPanel";
import CallHistoryPanel from "@/components/dashboard/CallHistoryPanel";
import WhatsAppCta from "@/components/WhatsAppCta";
import {
  abandonGoal,
  ApiError,
  completeGoal,
  completeTask,
  createCallWindow,
  createGoal,
  deleteCallWindow,
  deleteGoal,
  deleteTask,
  getCallHistory,
  getCallWindows,
  getGoals,
  getProfile,
  getProgress,
  getTasks,
  snoozeTask,
  unsnoozeTask,
  updateCallWindow,
  updateGoal,
  updateProfile,
  updateTask,
  type CallHistoryFilters,
  type CallHistoryItem,
  type CallWindow,
  type CallWindowUpdatePayload,
  type CallWindowWritePayload,
  type DashboardData,
  type Goal,
  type GoalStatus,
  type GoalUpdatePayload,
  type GoalWritePayload,
  type Profile,
  type ProfileUpdatePayload,
  type Task,
  type TaskStatus,
  type TaskUpdatePayload,
  type WindowType,
} from "@/lib/dashboardApi";

type TaskBuckets = Record<TaskStatus, Task[]>;
type GoalBuckets = Record<GoalStatus, Goal[]>;

const EMPTY_TASKS: TaskBuckets = {
  pending: [],
  completed: [],
  snoozed: [],
};

const EMPTY_GOALS: GoalBuckets = {
  active: [],
  completed: [],
  abandoned: [],
};

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [tasks, setTasks] = useState<TaskBuckets>(EMPTY_TASKS);
  const [goals, setGoals] = useState<GoalBuckets>(EMPTY_GOALS);
  const [windows, setWindows] = useState<CallWindow[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [calls, setCalls] = useState<CallHistoryItem[]>([]);
  const [callFilters, setCallFilters] = useState<CallHistoryFilters>({
    limit: 25,
  });

  const loadDashboard = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const loadedProfile = await getProfile();
      setNeedsOnboarding(false);
      const [
        loadedProgress,
        pendingTasks,
        completedTasks,
        snoozedTasks,
        activeGoals,
        completedGoals,
        abandonedGoals,
        loadedWindows,
        loadedCalls,
      ] = await Promise.all([
        getProgress(),
        getTasks("pending"),
        getTasks("completed"),
        getTasks("snoozed"),
        getGoals("active"),
        getGoals("completed"),
        getGoals("abandoned"),
        getCallWindows(),
        getCallHistory(callFilters),
      ]);

      setProfile(loadedProfile);
      setData(loadedProgress);
      setTasks({
        pending: pendingTasks,
        completed: completedTasks,
        snoozed: snoozedTasks,
      });
      setGoals({
        active: activeGoals,
        completed: completedGoals,
        abandoned: abandonedGoals,
      });
      setWindows(loadedWindows);
      setCalls(loadedCalls);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNeedsOnboarding(true);
        return;
      }
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [callFilters]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const runMutation = async (label: string, action: () => Promise<unknown>) => {
    setBusyAction(label);
    setError("");
    setNotice("");
    try {
      await action();
      await loadDashboard();
      setNotice(`${label} saved.`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyAction(null);
    }
  };

  const handleTaskUpdate = (taskId: number, payload: TaskUpdatePayload) =>
    runMutation("Task update", () => updateTask(taskId, payload));

  const handleTaskComplete = (taskId: number) =>
    runMutation("Task completion", () => completeTask(taskId));

  const handleTaskSnooze = (taskId: number, snoozeUntil: string) =>
    runMutation("Task snooze", () => snoozeTask(taskId, snoozeUntil));

  const handleTaskUnsnooze = (taskId: number) =>
    runMutation("Task unsnooze", () => unsnoozeTask(taskId));

  const handleTaskDelete = (taskId: number) =>
    runMutation("Task delete", () => deleteTask(taskId));

  const handleGoalCreate = (payload: GoalWritePayload) =>
    runMutation("Goal create", () => createGoal(payload));

  const handleGoalUpdate = (goalId: number, payload: GoalUpdatePayload) =>
    runMutation("Goal update", () => updateGoal(goalId, payload));

  const handleGoalComplete = (goalId: number) =>
    runMutation("Goal completion", () => completeGoal(goalId));

  const handleGoalAbandon = (goalId: number) =>
    runMutation("Goal abandon", () => abandonGoal(goalId));

  const handleGoalDelete = (goalId: number) =>
    runMutation("Goal delete", () => deleteGoal(goalId));

  const handleProfileUpdate = (payload: ProfileUpdatePayload) =>
    runMutation("Settings update", () => updateProfile(payload));

  const handleWindowCreate = (payload: CallWindowWritePayload) =>
    runMutation("Call window create", () => createCallWindow(payload));

  const handleWindowUpdate = (
    windowType: WindowType,
    payload: CallWindowUpdatePayload,
  ) => runMutation("Call window update", () => updateCallWindow(windowType, payload));

  const handleWindowDelete = (windowType: WindowType) =>
    runMutation("Call window delete", () => deleteCallWindow(windowType));

  if (needsOnboarding) {
    return (
      <div className="max-w-md mx-auto px-8 py-20 text-center">
        <h1 className="text-2xl font-semibold text-dark mb-3">
          Welcome to Charu
        </h1>
        <p className="text-muted mb-8">
          To get started, message Charu on WhatsApp. She&apos;ll walk you through
          a quick onboarding to set up your accountability calls.
        </p>
        <WhatsAppCta />
      </div>
    );
  }

  return (
    <>
      <SectionNav />
      <div className="max-w-[1040px] mx-auto px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {notice && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-sm text-green-700">
            {notice}
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-warm-gray/20 bg-surface p-6 shadow-card">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Dashboard
              </p>
              <h1 className="mt-2 font-sans text-2xl font-bold text-dark">
                Today with {profile?.name || "Charu"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Calls, tasks, goals, and settings are now managed from one place.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
              {[
                ["Pending", tasks.pending.length],
                ["Goals", goals.active.length],
                ["Calls", calls.length],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-warm-gray/25 bg-background px-4 py-3"
                >
                  <div className="text-xl font-bold text-dark">{value}</div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-muted">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="progress" className="mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">Progress</h2>
          {data ? (
            <div className="space-y-3">
              <ProgressStats
                stats={{
                  streak: data.streak,
                  week: data.week,
                  goals: data.goals,
                }}
              />
              <Heatmap data={data.heatmap} />
              <WeeklySummary summary={data.weekly_summary} />
            </div>
          ) : loading ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-surface border border-warm-gray/20 rounded-xl p-5 shadow-card animate-pulse"
                  >
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

        <section id="tasks" className="mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">Tasks</h2>
          <TaskList
            pending={tasks.pending}
            completed={tasks.completed}
            snoozed={tasks.snoozed}
            busy={busyAction !== null}
            onUpdate={handleTaskUpdate}
            onComplete={handleTaskComplete}
            onSnooze={handleTaskSnooze}
            onUnsnooze={handleTaskUnsnooze}
            onDelete={handleTaskDelete}
          />
        </section>

        <section id="goals" className="mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">Goals</h2>
          <GoalsPanel
            active={goals.active}
            completed={goals.completed}
            abandoned={goals.abandoned}
            busy={busyAction !== null}
            onCreate={handleGoalCreate}
            onUpdate={handleGoalUpdate}
            onComplete={handleGoalComplete}
            onAbandon={handleGoalAbandon}
            onDelete={handleGoalDelete}
          />
        </section>

        <section id="schedule" className="mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">Call Schedule</h2>
          <CallSchedule
            windows={windows}
            busy={busyAction !== null}
            onCreate={handleWindowCreate}
            onUpdate={handleWindowUpdate}
            onDelete={handleWindowDelete}
          />
        </section>

        <section id="call-history" className="mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">Call History</h2>
          <CallHistoryPanel
            calls={calls}
            filters={callFilters}
            onFiltersChange={setCallFilters}
          />
        </section>

        <section id="settings" className="mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">Settings</h2>
          {profile ? (
            <ProfileCard
              profile={profile}
              busy={busyAction !== null}
              onUpdate={handleProfileUpdate}
            />
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
