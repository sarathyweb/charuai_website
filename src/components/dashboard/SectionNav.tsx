"use client";

const sections = [
  { id: "progress", label: "Progress" },
  { id: "tasks", label: "Tasks" },
  { id: "goals", label: "Goals" },
  { id: "schedule", label: "Schedule" },
  { id: "call-history", label: "Calls" },
  { id: "settings", label: "Settings" },
];

export default function SectionNav() {
  return (
    <div className="bg-surface border-b border-warm-gray/20 px-8 flex gap-3 sm:gap-6 sticky top-[53px] z-40 overflow-x-auto">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="py-2.5 text-[13px] font-medium text-muted hover:text-dark border-b-2 border-transparent hover:border-primary/30 transition-all whitespace-nowrap"
        >
          {s.label}
        </a>
      ))}
    </div>
  );
}
