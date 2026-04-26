"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import type { Profile, ProfileUpdatePayload } from "@/lib/dashboardApi";

interface ProfileCardProps {
  profile: Profile;
  busy: boolean;
  onUpdate: (payload: ProfileUpdatePayload) => Promise<void>;
}

export default function ProfileCard({
  profile,
  busy,
  onUpdate,
}: ProfileCardProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(profile.name || "");
  const [timezone, setTimezone] = useState(profile.timezone || "");
  const [urgentEmailCalls, setUrgentEmailCalls] = useState(
    profile.urgent_email_calls_enabled,
  );
  const [autoTaskFromEmails, setAutoTaskFromEmails] = useState(
    profile.auto_task_from_emails_enabled,
  );
  const [quietHoursStart, setQuietHoursStart] = useState(
    profile.email_automation_quiet_hours_start || "21:00",
  );
  const [quietHoursEnd, setQuietHoursEnd] = useState(
    profile.email_automation_quiet_hours_end || "08:00",
  );

  const initial = profile.name?.[0]?.toUpperCase() || "?";
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "unknown";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onUpdate({
      name: name.trim() || null,
      timezone: timezone.trim() || null,
      urgent_email_calls_enabled: urgentEmailCalls,
      auto_task_from_emails_enabled: autoTaskFromEmails,
      email_automation_quiet_hours_start: quietHoursStart,
      email_automation_quiet_hours_end: quietHoursEnd,
    });
  };

  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex items-center gap-5 lg:w-[320px]">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent-warm flex items-center justify-center text-[22px] font-semibold text-white flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="text-[17px] font-semibold text-dark break-words">
              {profile.name || "User"}
            </div>
            <div className="text-[13px] text-muted mt-0.5">{profile.phone}</div>
            <div className="text-[12px] text-muted">
              Member since {memberSince}
            </div>
            <div className="text-[12px] text-muted">
              {profile.onboarding_complete
                ? "Onboarding complete"
                : "Onboarding pending"}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid flex-1 gap-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-[12px] font-medium text-muted">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
              />
            </label>
            <label className="text-[12px] font-medium text-muted">
              Timezone
              <input
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                placeholder="America/New_York"
                className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_1fr_120px_120px] md:items-end">
            <label className="flex items-center justify-between gap-3 rounded-lg border border-warm-gray/30 bg-background px-3 py-2 text-[12px] font-medium text-muted">
              <span>Urgent email calls</span>
              <input
                type="checkbox"
                checked={urgentEmailCalls}
                onChange={(event) => setUrgentEmailCalls(event.target.checked)}
                className="h-4 w-4 rounded border-warm-gray/50 text-primary focus:ring-primary"
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-lg border border-warm-gray/30 bg-background px-3 py-2 text-[12px] font-medium text-muted">
              <span>Auto-task from emails</span>
              <input
                type="checkbox"
                checked={autoTaskFromEmails}
                onChange={(event) =>
                  setAutoTaskFromEmails(event.target.checked)
                }
                className="h-4 w-4 rounded border-warm-gray/50 text-primary focus:ring-primary"
              />
            </label>
            <label className="text-[12px] font-medium text-muted">
              Quiet start
              <input
                type="time"
                value={quietHoursStart}
                onChange={(event) => setQuietHoursStart(event.target.value)}
                className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
              />
            </label>
            <label className="text-[12px] font-medium text-muted">
              Quiet end
              <input
                type="time"
                value={quietHoursEnd}
                onChange={(event) => setQuietHoursEnd(event.target.value)}
                className="mt-1 w-full rounded-lg border border-warm-gray/40 bg-background px-3 py-2 text-sm text-dark outline-none focus:border-primary"
              />
            </label>
          </div>

          <div className="flex gap-2 sm:justify-end">
            <button
              type="submit"
              disabled={busy}
              aria-label="Save settings"
              className="rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-white disabled:opacity-60"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="border border-warm-gray/40 rounded-lg px-4 py-2 text-[13px] text-muted hover:border-muted hover:text-dark transition-colors"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
