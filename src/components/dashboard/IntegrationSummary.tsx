"use client";

import type { Integration, IntegrationService } from "@/lib/dashboardApi";

const SERVICES: {
  service: IntegrationService;
  name: string;
  description: string;
}[] = [
  {
    service: "google_calendar",
    name: "Google Calendar",
    description: "Calendar context for calls and scheduling tools",
  },
  {
    service: "gmail",
    name: "Gmail",
    description: "Email triage, reply drafting, urgent calls, and task capture",
  },
];

interface IntegrationSummaryProps {
  integrations: Integration[];
  busy: boolean;
  onConnect: (service: IntegrationService) => Promise<void>;
  onDisconnect: (service: IntegrationService) => Promise<void>;
}

function serviceStatus(
  integrations: Integration[],
  service: IntegrationService,
): Integration | undefined {
  return integrations.find((integration) => integration.service === service);
}

export default function IntegrationSummary({
  integrations,
  busy,
  onConnect,
  onDisconnect,
}: IntegrationSummaryProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {SERVICES.map((item) => {
        const integration = serviceStatus(integrations, item.service);
        const connected = integration?.connected ?? false;
        return (
          <div
            key={item.service}
            className="rounded-xl border border-warm-gray/20 bg-surface p-5 shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-dark">{item.name}</div>
                <div className="mt-1 text-[12px] leading-5 text-muted">
                  {item.description}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                      connected
                        ? "bg-green-50 text-green-700"
                        : "bg-background text-muted"
                    }`}
                  >
                    {connected ? "Connected" : "Not connected"}
                  </span>
                  {integration?.email && (
                    <span className="text-[11px] text-muted">
                      {integration.email}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  connected
                    ? onDisconnect(item.service)
                    : onConnect(item.service)
                }
                className={`rounded-lg px-3 py-1.5 text-[12px] font-medium disabled:opacity-60 ${
                  connected
                    ? "border border-warm-gray/40 text-muted hover:text-dark"
                    : "bg-primary text-white"
                }`}
              >
                {connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
