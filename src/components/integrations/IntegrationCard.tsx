"use client";

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  email?: string;
  statusText?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  readOnly?: boolean;
}

export default function IntegrationCard({
  name,
  description,
  icon,
  connected,
  email,
  statusText,
  onConnect,
  onDisconnect,
  readOnly,
}: IntegrationCardProps) {
  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-5 flex items-center gap-4 mb-2.5">
      <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-[22px] flex-shrink-0 bg-accent-surface">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-dark">{name}</div>
        <div className="text-[13px] text-muted mt-0.5">{description}</div>
        {connected && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded bg-green-50 text-green-700">Connected</span>
            {email && <span className="text-[12px] text-muted">{email}</span>}
            {statusText && (
              <span className="flex items-center gap-1.5 text-[13px] text-dark">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {statusText}
              </span>
            )}
          </div>
        )}
        {!connected && !readOnly && (
          <div className="text-[12px] text-muted mt-1">Not connected</div>
        )}
      </div>
      <div className="flex-shrink-0">
        {readOnly && connected ? (
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded bg-green-50 text-green-700">Connected</span>
        ) : connected ? (
          <button
            onClick={onDisconnect}
            className="border border-red-200 text-red-600 rounded-lg px-4 py-2 text-[13px] font-medium hover:bg-red-50 transition-colors"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="bg-primary text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:bg-accent-warm transition-colors"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
