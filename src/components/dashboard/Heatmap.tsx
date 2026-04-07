"use client";

interface HeatmapDay {
  date: string;
  level: number;
}

const LEVEL_COLORS = [
  "bg-warm-gray/40",
  "bg-[#b8d4f0]",
  "bg-[#7badd6]",
  "bg-[#4B73B9]",
  "bg-[#2C2D72]",
];

export default function Heatmap({ data }: { data: HeatmapDay[] }) {
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-dark">Activity (last 12 weeks)</span>
        <div className="flex items-center gap-1 text-[11px] text-muted">
          <span>Less</span>
          {LEVEL_COLORS.map((c, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="flex gap-[3px]">
        <div className="flex flex-col gap-[3px] pr-1 text-[9px] text-muted">
          <div className="h-[11px] leading-[11px]">M</div>
          <div className="h-[11px]" />
          <div className="h-[11px] leading-[11px]">W</div>
          <div className="h-[11px]" />
          <div className="h-[11px] leading-[11px]">F</div>
          <div className="h-[11px]" />
          <div className="h-[11px] leading-[11px]">S</div>
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div
                key={di}
                className={`w-[11px] h-[11px] rounded-sm ${LEVEL_COLORS[day.level] || LEVEL_COLORS[0]}`}
                title={`${day.date}: level ${day.level}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
