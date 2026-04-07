"use client";

const sections = [
  { id: "progress", label: "Progress" },
  { id: "tasks", label: "Tasks" },
  { id: "schedule", label: "Schedule" },
  { id: "profile", label: "Profile" },
];

export default function SectionNav() {
  return (
    <div className="bg-surface border-b border-warm-gray/20 px-8 flex gap-6 sticky top-[53px] z-40">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="py-2.5 text-[13px] font-medium text-muted hover:text-dark border-b-2 border-transparent hover:border-primary/30 transition-all"
        >
          {s.label}
        </a>
      ))}
    </div>
  );
}
