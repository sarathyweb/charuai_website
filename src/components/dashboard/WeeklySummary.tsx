export default function WeeklySummary({ summary }: { summary: string }) {
  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card">
      <div className="px-5 pt-4 text-sm font-semibold text-dark">Weekly Summary</div>
      <div className="px-5 pb-4 pt-2 text-sm text-muted leading-relaxed">{summary}</div>
    </div>
  );
}
