"use client";

import FadeIn from "@/components/FadeIn";

const proof = [
  {
    value: "Calls",
    label: "the nudge you cannot swipe away",
  },
  {
    value: "Tasks",
    label: "captured from what you say out loud",
  },
  {
    value: "Goals",
    label: "tracked across days, not forgotten after one call",
  },
  {
    value: "Calendar",
    label: "time blocks that protect the work",
  },
];

export default function ProofStrip() {
  return (
    <section className="bg-surface border-b border-warm-gray/30">
      <div className="mx-auto grid max-w-container grid-cols-2 gap-px px-6 py-6 md:grid-cols-4">
        {proof.map((item, index) => (
          <FadeIn key={item.value} delay={index * 0.06}>
            <div className="h-full border-l border-warm-gray/30 pl-4">
              <div className="text-sm font-bold text-primary md:text-base">
                {item.value}
              </div>
              <div className="mt-1 text-[12px] leading-5 text-muted md:text-[13px]">
                {item.label}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
