import { authFetch } from "./api";

export type TaskStatus = "pending" | "completed" | "snoozed";
export type GoalStatus = "active" | "completed" | "abandoned";
export type WindowType = "morning" | "afternoon" | "evening";
export type IntegrationService = "google_calendar" | "gmail";

export interface DashboardData {
  streak: { current: number; best: number };
  week: {
    calls_completed: number;
    calls_total: number;
    prev_calls_completed: number;
  };
  goals: { completion_pct: number; prev_completion_pct: number };
  heatmap: { date: string; level: number }[];
  weekly_summary: string;
}

export interface Task {
  id: number;
  title: string;
  priority: number;
  status: TaskStatus;
  source: string;
  snoozed_until: string | null;
  created_at: string | null;
  completed_at: string | null;
}

export interface Goal {
  id: number;
  title: string;
  description: string | null;
  status: GoalStatus;
  target_date: string | null;
  completed_at: string | null;
  created_at: string | null;
}

export interface CallWindow {
  type: WindowType;
  start_time: string | null;
  end_time: string | null;
  timezone: string;
  is_active: boolean;
}

export interface Profile {
  name: string | null;
  phone: string;
  timezone: string | null;
  onboarding_complete: boolean;
  created_at: string | null;
  urgent_email_calls_enabled: boolean;
  auto_task_from_emails_enabled: boolean;
  email_automation_quiet_hours_start: string;
  email_automation_quiet_hours_end: string;
}

export interface CallHistoryItem {
  id: number;
  call_type: string;
  call_date: string;
  scheduled_time: string;
  actual_start_time: string | null;
  end_time: string | null;
  status: string;
  occurrence_kind: string;
  attempt_number: number;
  duration_seconds: number | null;
  goal: string | null;
  next_action: string | null;
  commitments: string[] | null;
  call_outcome_confidence: string | null;
  accomplishments: string | null;
  tomorrow_intention: string | null;
  reflection_confidence: string | null;
  recap_sent_at: string | null;
}

export interface CallHistoryFilters {
  status?: string;
  callType?: string;
  limit?: number;
}

export interface Integration {
  service: IntegrationService;
  connected: boolean;
  email?: string;
  connected_at?: string;
}

export interface TaskUpdatePayload {
  title?: string;
  priority?: number;
}

export interface GoalWritePayload {
  title: string;
  description?: string | null;
  target_date?: string | null;
}

export interface GoalUpdatePayload {
  title?: string;
  description?: string | null;
  target_date?: string | null;
}

export interface ProfileUpdatePayload {
  name?: string | null;
  timezone?: string | null;
  urgent_email_calls_enabled?: boolean;
  auto_task_from_emails_enabled?: boolean;
  email_automation_quiet_hours_start?: string;
  email_automation_quiet_hours_end?: string;
}

export interface CallWindowWritePayload {
  window_type: WindowType;
  start_time: string;
  end_time: string;
}

export interface CallWindowUpdatePayload {
  start_time?: string;
  end_time?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === "string") message = body.detail;
    } catch {
      // Keep the status-based fallback when the response is not JSON.
    }
    throw new ApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}

function jsonOptions(method: string, body?: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  };
}

export async function getProfile(): Promise<Profile> {
  return parseJson<Profile>(await authFetch("/api/user/profile"));
}

export async function updateProfile(
  payload: ProfileUpdatePayload,
): Promise<Profile> {
  return parseJson<Profile>(
    await authFetch("/api/user/profile", jsonOptions("PATCH", payload)),
  );
}

export async function getProgress(): Promise<DashboardData> {
  return parseJson<DashboardData>(await authFetch("/api/progress"));
}

export async function getTasks(status: TaskStatus): Promise<Task[]> {
  const data = await parseJson<{ tasks: Task[] }>(
    await authFetch(`/api/tasks?status=${status}`),
  );
  return data.tasks;
}

export async function updateTask(
  taskId: number,
  payload: TaskUpdatePayload,
): Promise<Task> {
  const data = await parseJson<{ task: Task }>(
    await authFetch(`/api/tasks/${taskId}`, jsonOptions("PATCH", payload)),
  );
  return data.task;
}

export async function completeTask(taskId: number): Promise<Task> {
  const data = await parseJson<{ task: Task }>(
    await authFetch(`/api/tasks/${taskId}/complete`, { method: "POST" }),
  );
  return data.task;
}

export async function snoozeTask(
  taskId: number,
  snoozeUntil: string,
): Promise<Task> {
  const data = await parseJson<{ task: Task }>(
    await authFetch(
      `/api/tasks/${taskId}/snooze`,
      jsonOptions("POST", { snooze_until: snoozeUntil }),
    ),
  );
  return data.task;
}

export async function unsnoozeTask(taskId: number): Promise<Task> {
  const data = await parseJson<{ task: Task }>(
    await authFetch(`/api/tasks/${taskId}/unsnooze`, { method: "POST" }),
  );
  return data.task;
}

export async function deleteTask(taskId: number): Promise<void> {
  await parseJson(await authFetch(`/api/tasks/${taskId}`, { method: "DELETE" }));
}

export async function getGoals(status: GoalStatus): Promise<Goal[]> {
  const data = await parseJson<{ goals: Goal[] }>(
    await authFetch(`/api/goals?status=${status}`),
  );
  return data.goals;
}

export async function createGoal(payload: GoalWritePayload): Promise<Goal> {
  const data = await parseJson<{ goal: Goal }>(
    await authFetch("/api/goals", jsonOptions("POST", payload)),
  );
  return data.goal;
}

export async function updateGoal(
  goalId: number,
  payload: GoalUpdatePayload,
): Promise<Goal> {
  const data = await parseJson<{ goal: Goal }>(
    await authFetch(`/api/goals/${goalId}`, jsonOptions("PATCH", payload)),
  );
  return data.goal;
}

export async function completeGoal(goalId: number): Promise<Goal> {
  const data = await parseJson<{ goal: Goal }>(
    await authFetch(`/api/goals/${goalId}/complete`, { method: "POST" }),
  );
  return data.goal;
}

export async function abandonGoal(goalId: number): Promise<Goal> {
  const data = await parseJson<{ goal: Goal }>(
    await authFetch(`/api/goals/${goalId}/abandon`, { method: "POST" }),
  );
  return data.goal;
}

export async function deleteGoal(goalId: number): Promise<void> {
  await parseJson(await authFetch(`/api/goals/${goalId}`, { method: "DELETE" }));
}

export async function getCallHistory(
  filters: CallHistoryFilters = {},
): Promise<CallHistoryItem[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.callType) params.set("call_type", filters.callType);
  params.set("limit", String(filters.limit ?? 25));
  const data = await parseJson<{ calls: CallHistoryItem[] }>(
    await authFetch(`/api/call-history?${params.toString()}`),
  );
  return data.calls;
}

export async function getCallWindows(): Promise<CallWindow[]> {
  const data = await parseJson<{ windows: CallWindow[] }>(
    await authFetch("/api/call-windows"),
  );
  return data.windows;
}

export async function createCallWindow(
  payload: CallWindowWritePayload,
): Promise<CallWindow> {
  const data = await parseJson<{ window: CallWindow }>(
    await authFetch("/api/call-windows", jsonOptions("POST", payload)),
  );
  return data.window;
}

export async function updateCallWindow(
  windowType: WindowType,
  payload: CallWindowUpdatePayload,
): Promise<CallWindow> {
  const data = await parseJson<{ window: CallWindow }>(
    await authFetch(
      `/api/call-windows/${windowType}`,
      jsonOptions("PATCH", payload),
    ),
  );
  return data.window;
}

export async function deleteCallWindow(windowType: WindowType): Promise<void> {
  await parseJson(
    await authFetch(`/api/call-windows/${windowType}`, { method: "DELETE" }),
  );
}

export async function getIntegrations(): Promise<Integration[]> {
  const data = await parseJson<{ integrations: Integration[] }>(
    await authFetch("/api/integrations"),
  );
  return data.integrations;
}

export async function connectIntegration(
  service: IntegrationService,
): Promise<string> {
  const data = await parseJson<{ url: string }>(
    await authFetch(`/api/integrations/${service}/connect?redirect=false`),
  );
  return data.url;
}

export async function disconnectIntegration(
  service: IntegrationService,
): Promise<void> {
  await parseJson(
    await authFetch(`/api/integrations/${service}/disconnect`, {
      method: "DELETE",
    }),
  );
}
