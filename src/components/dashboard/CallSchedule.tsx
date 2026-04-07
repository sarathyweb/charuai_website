interface Window {
  type: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
}

const ICONS: Record<string, string> = {
  morning: "\u{1F305}",
  evening: "\u{1F319}",
};

const LABELS: Record<string, string> = {
  morning: "Morning Call",
  evening: "Evening Reflection",
};

export default function CallSchedule({ windows }: { windows: Window[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {windows.map((w) => (
        <div key={w.type} className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-6">
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="text-[22px]">{ICONS[w.type] || ""}</span>
            <span className="text-sm font-semibold text-dark">{LABELS[w.type] || w.type}</span>
            <span className={`ml-auto text-[11px] font-medium px-2.5 py-0.5 rounded ${
              w.is_active
                ? "bg-green-50 text-green-700"
                : "bg-warm-gray/20 text-muted"
            }`}>
              {w.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="text-[26px] font-bold text-dark">{w.start_time} &ndash; {w.end_time}</div>
          <div className="text-[12px] text-muted mt-1">{w.timezone}</div>
          <div className="text-[12px] text-muted mt-3 italic">
            To change, tell Charu during your next call or on WhatsApp
          </div>
        </div>
      ))}
    </div>
  );
}
