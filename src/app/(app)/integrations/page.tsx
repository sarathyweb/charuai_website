"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import ComingSoonBadge from "@/components/integrations/ComingSoonBadge";

interface Integration {
  service: string;
  connected: boolean;
  email?: string;
  connected_at?: string;
}

export default function IntegrationsPage() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    authFetch("/api/integrations")
      .then((r) => r.ok ? r.json() : { integrations: [] })
      .then((d) => setIntegrations(d.integrations || []));
  }, []);

  const google = (service: string) =>
    integrations.find((i) => i.service === service);

  const handleConnect = async (service: string) => {
    const response = await authFetch(
      `/api/integrations/${service}/connect?redirect=false`
    );
    if (!response.ok) {
      alert("Could not start the connection flow. Please try again.");
      return;
    }
    const data = (await response.json()) as { url?: string };
    if (!data.url) {
      alert("Could not start the connection flow. Please try again.");
      return;
    }
    window.location.href = data.url;
  };

  const handleDisconnect = async (service: string) => {
    if (!confirm(`Disconnect ${service.replace("_", " ")}?`)) return;
    await authFetch(`/api/integrations/${service}/disconnect`, { method: "DELETE" });
    setIntegrations((prev) =>
      prev.map((i) => i.service === service ? { ...i, connected: false, email: undefined } : i)
    );
  };

  const cal = google("google_calendar");
  const gmail = google("gmail");

  return (
    <div className="max-w-[720px] mx-auto px-8 py-8">
      <h1 className="text-[22px] font-bold text-dark mb-1">Integrations</h1>
      <p className="text-sm text-muted mb-8">
        Connect your accounts so Charu can help you stay on top of everything.
      </p>

      <div className="bg-accent-surface/50 border border-warm-gray/20 rounded-xl p-4 mb-8 text-[13px] text-primary leading-relaxed">
        <strong className="font-semibold">How it works:</strong> When you connect an account,
        Charu can read your calendar events and emails to surface relevant tasks during your daily calls.
        You can disconnect at any time.
      </div>

      <div className="mb-10">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted mb-3">Your Accounts</div>

        <IntegrationCard
          name="Google Calendar"
          description="View upcoming events and surface scheduling conflicts"
          icon={<span>&#128197;</span>}
          connected={cal?.connected || false}
          email={cal?.email}
          onConnect={() => handleConnect("google_calendar")}
          onDisconnect={() => handleDisconnect("google_calendar")}
        />

        <IntegrationCard
          name="Gmail"
          description="Surface important emails and help draft replies during calls"
          icon={<span>&#9993;</span>}
          connected={gmail?.connected || false}
          email={gmail?.email}
          onConnect={() => handleConnect("gmail")}
          onDisconnect={() => handleDisconnect("gmail")}
        />

        <IntegrationCard
          name="WhatsApp"
          description="Daily recaps, midday check-ins, and on-demand messaging"
          icon={<span>&#128172;</span>}
          connected={true}
          statusText={`Active on ${user?.phoneNumber || ""}`}
          readOnly
        />
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted mb-3">Coming Soon</div>
        <ComingSoonBadge name="Microsoft Teams" description="Calendar sync and meeting awareness" icon={<span>&#128101;</span>} />
        <ComingSoonBadge name="Microsoft Outlook" description="Email integration for task surfacing" icon={<span>&#128231;</span>} />
        <ComingSoonBadge name="Slack" description="Check-ins and task updates in your workspace" icon={<span>&#128488;</span>} />
        <ComingSoonBadge name="Notion" description="Task sync and note integration" icon={<span>&#128221;</span>} />
      </div>
    </div>
  );
}
