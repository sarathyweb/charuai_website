interface ComingSoonProps {
  name: string;
  description: string;
  icon: React.ReactNode;
}

export default function ComingSoonBadge({ name, description, icon }: ComingSoonProps) {
  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-5 flex items-center gap-4 mb-2.5 opacity-60">
      <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-[22px] flex-shrink-0 bg-accent-surface">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-muted">{name}</div>
        <div className="text-[13px] text-muted mt-0.5">{description}</div>
      </div>
      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-purple-50 text-purple-600">
        Coming Soon
      </span>
    </div>
  );
}
