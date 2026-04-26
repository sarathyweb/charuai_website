import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import DashboardPage from "@/app/(app)/dashboard/page";
import { authFetch } from "@/lib/api";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  logout: vi.fn(),
  navigateExternal: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  authFetch: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  useAuth: () => ({
    logout: mocks.logout,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mocks.push,
    replace: vi.fn(),
  }),
  usePathname: () => "/dashboard",
}));

vi.mock("@/lib/navigation", () => ({
  navigateExternal: mocks.navigateExternal,
}));

type RequestRecord = {
  path: string;
  options?: RequestInit;
};

const profile = {
  name: "Asha",
  phone: "+15551234567",
  timezone: "America/New_York",
  onboarding_complete: true,
  created_at: "2026-04-01T12:00:00Z",
  urgent_email_calls_enabled: false,
  auto_task_from_emails_enabled: false,
  email_automation_quiet_hours_start: "21:00",
  email_automation_quiet_hours_end: "08:00",
};

const progress = {
  streak: { current: 3, best: 9 },
  week: { calls_completed: 4, calls_total: 6, prev_calls_completed: 3 },
  goals: { completion_pct: 67, prev_completion_pct: 50 },
  heatmap: [{ date: "2026-04-26", level: 2 }],
  weekly_summary: "You kept the week moving.",
};

const pendingTask = {
  id: 1,
  title: "Send invoice",
  priority: 80,
  status: "pending",
  source: "gmail",
  snoozed_until: null,
  created_at: "2026-04-25T10:00:00Z",
  completed_at: null,
};

const completedTask = {
  id: 2,
  title: "Book dentist",
  priority: 30,
  status: "completed",
  source: "user_mention",
  snoozed_until: null,
  created_at: "2026-04-20T10:00:00Z",
  completed_at: "2026-04-24T10:00:00Z",
};

const snoozedTask = {
  id: 3,
  title: "Renew passport",
  priority: 60,
  status: "snoozed",
  source: "user_mention",
  snoozed_until: "2026-04-27T12:00:00Z",
  created_at: "2026-04-22T10:00:00Z",
  completed_at: null,
};

const activeGoal = {
  id: 10,
  title: "Launch beta",
  description: "Finish the private beta launch",
  status: "active",
  target_date: "2026-05-10",
  completed_at: null,
  created_at: "2026-04-20T10:00:00Z",
};

const completedGoal = {
  id: 11,
  title: "Close April books",
  description: null,
  status: "completed",
  target_date: null,
  completed_at: "2026-04-21T10:00:00Z",
  created_at: "2026-04-10T10:00:00Z",
};

const abandonedGoal = {
  id: 12,
  title: "Old marketing sprint",
  description: null,
  status: "abandoned",
  target_date: null,
  completed_at: null,
  created_at: "2026-04-01T10:00:00Z",
};

const morningWindow = {
  type: "morning",
  start_time: "8:00 AM",
  end_time: "8:30 AM",
  timezone: "America/New_York",
  is_active: true,
};

const call = {
  id: 100,
  call_type: "morning",
  call_date: "2026-04-26",
  scheduled_time: "2026-04-26T12:00:00Z",
  actual_start_time: "2026-04-26T12:01:00Z",
  end_time: "2026-04-26T12:06:00Z",
  status: "completed",
  occurrence_kind: "planned",
  attempt_number: 1,
  duration_seconds: 300,
  goal: "Ship the dashboard",
  next_action: "Write tests",
  commitments: ["Open PR"],
  call_outcome_confidence: "clear",
  accomplishments: "Cleared the launch blocker",
  tomorrow_intention: null,
  reflection_confidence: "clear",
  recap_sent_at: "2026-04-26T12:07:00Z",
};

const integrations = [
  { service: "google_calendar", connected: true, email: "asha@example.com" },
  { service: "gmail", connected: true, email: "asha@example.com" },
];

function json(data: unknown, status = 200): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

function setupDashboard(overrides?: {
  profile?: typeof profile;
  integrations?: typeof integrations;
}) {
  const requests: RequestRecord[] = [];
  const authFetchMock = vi.mocked(authFetch);
  const profileData = overrides?.profile ?? profile;
  const integrationData = overrides?.integrations ?? integrations;

  authFetchMock.mockImplementation((path, options) => {
    requests.push({ path, options });
    if (path === "/api/user/profile") return json(profileData);
    if (path === "/api/progress") return json(progress);
    if (path === "/api/tasks?status=pending") return json({ tasks: [pendingTask] });
    if (path === "/api/tasks?status=completed") {
      return json({ tasks: [completedTask] });
    }
    if (path === "/api/tasks?status=snoozed") return json({ tasks: [snoozedTask] });
    if (path === "/api/goals?status=active") return json({ goals: [activeGoal] });
    if (path === "/api/goals?status=completed") {
      return json({ goals: [completedGoal] });
    }
    if (path === "/api/goals?status=abandoned") {
      return json({ goals: [abandonedGoal] });
    }
    if (path === "/api/call-windows") return json({ windows: [morningWindow] });
    if (path.startsWith("/api/call-history?")) {
      return json({ calls: [call], count: 1 });
    }
    if (path === "/api/integrations") return json({ integrations: integrationData });

    if (path === "/api/tasks/1") return json({ task: pendingTask });
    if (path === "/api/tasks/1/complete") return json({ task: pendingTask });
    if (path === "/api/tasks/1/snooze") return json({ task: pendingTask });
    if (path === "/api/tasks/3/unsnooze") return json({ task: snoozedTask });

    if (path === "/api/goals") return json({ goal: activeGoal });
    if (path === "/api/goals/10") return json({ goal: activeGoal });
    if (path === "/api/goals/10/complete") return json({ goal: activeGoal });
    if (path === "/api/goals/10/abandon") return json({ goal: activeGoal });

    if (path === "/api/user/profile") return json(profileData);
    if (path === "/api/call-windows/morning") return json({ window: morningWindow });
    if (path === "/api/integrations/gmail/connect?redirect=false") {
      return json({ url: "https://api.example.test/auth/google/start?token=abc" });
    }
    if (path === "/api/integrations/gmail/disconnect") {
      return json({ status: "disconnected", service: "gmail" });
    }

    return json({});
  });

  render(<DashboardPage />);
  return requests;
}

function latestRequest(
  requests: RequestRecord[],
  path: string,
  method?: string,
): RequestRecord | undefined {
  return [...requests]
    .reverse()
    .find(
      (request) =>
        request.path === path &&
        (method === undefined || request.options?.method === method),
    );
}

function expectJsonBody(request: RequestRecord | undefined, body: unknown) {
  expect(request).toBeDefined();
  expect(JSON.parse(String(request?.options?.body))).toEqual(body);
}

beforeEach(() => {
  vi.mocked(authFetch).mockReset();
  mocks.push.mockReset();
  mocks.logout.mockReset();
  mocks.navigateExternal.mockReset();
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

describe("DashboardPage", () => {
  test("loads every dashboard-backed section", async () => {
    const requests = setupDashboard();

    expect(await screen.findByText("Send invoice")).toBeDefined();
    expect(screen.getByText("Launch beta")).toBeDefined();
    expect(screen.getByText("Morning Call")).toBeDefined();
    expect(screen.getByText(/Ship the dashboard/)).toBeDefined();
    expect(screen.getByText(/Cleared the launch blocker/)).toBeDefined();
    expect(screen.getByText(/Outcome: Clear/)).toBeDefined();
    expect(screen.getByText(/Reflection: Clear/)).toBeDefined();
    expect(screen.getByText(/Recap sent/)).toBeDefined();
    expect(screen.getByText("+15551234567")).toBeDefined();
    expect(screen.getByText("Google Calendar")).toBeDefined();
    expect(screen.getAllByText("Gmail").length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(requests.map((request) => request.path)).toEqual(
        expect.arrayContaining([
          "/api/user/profile",
          "/api/progress",
          "/api/tasks?status=pending",
          "/api/tasks?status=completed",
          "/api/tasks?status=snoozed",
          "/api/goals?status=active",
          "/api/goals?status=completed",
          "/api/goals?status=abandoned",
          "/api/call-windows",
          "/api/call-history?limit=25",
          "/api/integrations",
        ]),
      );
    });
  });

  test("wires task update, complete, snooze, unsnooze, and delete", async () => {
    const requests = setupDashboard();
    expect(await screen.findByText("Send invoice")).toBeDefined();

    fireEvent.click(screen.getByLabelText("Edit Send invoice"));
    fireEvent.change(screen.getByDisplayValue("Send invoice"), {
      target: { value: "Send final invoice" },
    });
    fireEvent.click(screen.getByLabelText("Save Send invoice"));
    await waitFor(() =>
      expectJsonBody(latestRequest(requests, "/api/tasks/1", "PATCH"), {
        title: "Send final invoice",
        priority: 80,
      }),
    );

    fireEvent.click(screen.getByLabelText("Complete Send invoice"));
    await waitFor(() =>
      expect(latestRequest(requests, "/api/tasks/1/complete", "POST")).toBeDefined(),
    );

    fireEvent.click(screen.getByLabelText("Snooze Send invoice"));
    fireEvent.click(screen.getByLabelText("Save snooze Send invoice"));
    await waitFor(() => {
      const request = latestRequest(requests, "/api/tasks/1/snooze", "POST");
      expect(request).toBeDefined();
      expect(JSON.parse(String(request?.options?.body))).toHaveProperty(
        "snooze_until",
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "Snoozed (1)" }));
    fireEvent.click(screen.getByLabelText("Unsnooze Renew passport"));
    await waitFor(() =>
      expect(latestRequest(requests, "/api/tasks/3/unsnooze", "POST")).toBeDefined(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Pending (1)" }));
    fireEvent.click(screen.getByLabelText("Delete Send invoice"));
    await waitFor(() =>
      expect(latestRequest(requests, "/api/tasks/1", "DELETE")).toBeDefined(),
    );
  });

  test("wires goal create, update, complete, abandon, and delete", async () => {
    const requests = setupDashboard();
    expect(await screen.findByText("Launch beta")).toBeDefined();

    fireEvent.change(screen.getByLabelText("Goal"), {
      target: { value: "Finish onboarding QA" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Verify every dashboard section" },
    });
    fireEvent.change(screen.getByLabelText("Target"), {
      target: { value: "2026-05-15" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Goal" }));
    await waitFor(() =>
      expectJsonBody(latestRequest(requests, "/api/goals", "POST"), {
        title: "Finish onboarding QA",
        description: "Verify every dashboard section",
        target_date: "2026-05-15",
      }),
    );

    fireEvent.click(screen.getByLabelText("Edit Launch beta"));
    fireEvent.change(screen.getByDisplayValue("Launch beta"), {
      target: { value: "Launch public beta" },
    });
    fireEvent.click(screen.getByLabelText("Save Launch beta"));
    await waitFor(() =>
      expectJsonBody(latestRequest(requests, "/api/goals/10", "PATCH"), {
        title: "Launch public beta",
        description: "Finish the private beta launch",
        target_date: "2026-05-10",
      }),
    );

    fireEvent.click(screen.getByLabelText("Edit Launch beta"));
    fireEvent.change(screen.getByLabelText("Goal description"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Goal target date"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByLabelText("Save Launch beta"));
    await waitFor(() =>
      expectJsonBody(latestRequest(requests, "/api/goals/10", "PATCH"), {
        title: "Launch beta",
        description: null,
        target_date: null,
      }),
    );

    fireEvent.click(screen.getByLabelText("Complete Launch beta"));
    await waitFor(() =>
      expect(latestRequest(requests, "/api/goals/10/complete", "POST")).toBeDefined(),
    );

    fireEvent.click(screen.getByLabelText("Abandon Launch beta"));
    await waitFor(() =>
      expect(latestRequest(requests, "/api/goals/10/abandon", "POST")).toBeDefined(),
    );

    fireEvent.click(screen.getByLabelText("Delete Launch beta"));
    await waitFor(() =>
      expect(latestRequest(requests, "/api/goals/10", "DELETE")).toBeDefined(),
    );
  });

  test("wires settings, call-window CRUD, and call-history filters", async () => {
    const requests = setupDashboard();
    expect(await screen.findByText("Morning Call")).toBeDefined();

    const timezoneInput = screen.getByLabelText("Timezone") as HTMLInputElement;
    fireEvent.change(timezoneInput, {
      target: { value: "America/Chicago" },
    });
    fireEvent.click(screen.getByLabelText("Urgent email calls"));
    fireEvent.click(screen.getByLabelText("Auto-task from emails"));
    fireEvent.change(screen.getByLabelText("Quiet start"), {
      target: { value: "22:00" },
    });
    fireEvent.change(screen.getByLabelText("Quiet end"), {
      target: { value: "07:30" },
    });
    await waitFor(() => expect(timezoneInput.value).toBe("America/Chicago"));
    fireEvent.click(screen.getByLabelText("Save settings"));
    await waitFor(() =>
      expectJsonBody(latestRequest(requests, "/api/user/profile", "PATCH"), {
        name: "Asha",
        timezone: "America/Chicago",
        urgent_email_calls_enabled: true,
        auto_task_from_emails_enabled: true,
        email_automation_quiet_hours_start: "22:00",
        email_automation_quiet_hours_end: "07:30",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Add Window" }));
    await waitFor(() =>
      expectJsonBody(latestRequest(requests, "/api/call-windows", "POST"), {
        window_type: "afternoon",
        start_time: "09:00",
        end_time: "09:30",
      }),
    );

    fireEvent.click(screen.getByLabelText("Edit morning window"));
    fireEvent.click(screen.getByLabelText("Save morning window"));
    await waitFor(() =>
      expectJsonBody(latestRequest(requests, "/api/call-windows/morning", "PATCH"), {
        start_time: "08:00",
        end_time: "08:30",
      }),
    );

    fireEvent.click(screen.getByLabelText("Remove morning window"));
    await waitFor(() =>
      expect(
        latestRequest(requests, "/api/call-windows/morning", "DELETE"),
      ).toBeDefined(),
    );

    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "completed" },
    });
    await waitFor(() =>
      expect(
        requests.some((request) =>
          request.path.includes("/api/call-history?status=completed"),
        ),
      ).toBe(true),
    );
  });

  test("gates email automation on Gmail and wires dashboard integrations", async () => {
    const requests = setupDashboard({
      integrations: [
        { service: "google_calendar", connected: true, email: "asha@example.com" },
        { service: "gmail", connected: false },
      ],
    });

    expect(
      await screen.findByText("Connect Gmail before enabling email automation."),
    ).toBeDefined();
    expect((screen.getByLabelText("Urgent email calls") as HTMLInputElement).disabled)
      .toBe(true);
    expect(
      (screen.getByLabelText("Auto-task from emails") as HTMLInputElement).disabled,
    ).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Connect Gmail" }));
    await waitFor(() =>
      expect(
        latestRequest(
          requests,
          "/api/integrations/gmail/connect?redirect=false",
        ),
      ).toBeDefined(),
    );
    expect(mocks.navigateExternal).toHaveBeenCalledWith(
      "https://api.example.test/auth/google/start?token=abc",
    );
  });
});
