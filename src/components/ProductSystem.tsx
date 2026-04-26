"use client";

import FadeIn from "@/components/FadeIn";
import {
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  EnvelopeOpenIcon,
  PhoneArrowUpRightIcon,
} from "@heroicons/react/24/outline";

const rail = [
  {
    icon: PhoneArrowUpRightIcon,
    title: "Call",
    body: "Charu asks what matters and turns the answer into one next action.",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: "Track",
    body: "Tasks and goals are saved from the conversation instead of relying on memory.",
  },
  {
    icon: CalendarDaysIcon,
    title: "Protect",
    body: "Call windows and calendar blocks make the plan visible when the day gets noisy.",
  },
  {
    icon: EnvelopeOpenIcon,
    title: "Follow up",
    body: "WhatsApp recaps and email help close the loose ends you would otherwise carry.",
  },
];

export default function ProductSystem() {
  return (
    <section id="product" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-warm">
              What Charu does after you answer
            </p>
            <h2 className="mt-3 font-serif text-[1.85rem] leading-tight text-primary md:text-[2.6rem]">
              One short call becomes a plan your tools can carry.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              The important moment is when you say the next action out loud and
              Charu turns it into a visible commitment you can come back to.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
          <FadeIn direction="right">
            <div className="h-full rounded-2xl border border-warm-gray/30 bg-surface p-5 shadow-card">
              <div className="mb-4 flex items-center justify-between border-b border-warm-gray/20 pb-4">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Accountability call
                  </div>
                  <div className="text-xl font-semibold text-dark">
                    Turn intention into action
                  </div>
                </div>
                <div className="rounded-full bg-green-50 px-3 py-1 text-[12px] font-medium text-green-700">
                  Completed
                </div>
              </div>

              <div className="space-y-3">
                {[
                  ["Goal", "Finish the launch checklist"],
                  ["Next action", "Review payment copy before noon"],
                  ["Saved task", "Send Sara the onboarding notes"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-warm-gray/25 bg-background px-4 py-3"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                      {label}
                    </div>
                    <div className="mt-1 text-sm font-medium text-dark">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-primary px-4 py-3 text-sm leading-6 text-white">
                Charu will check back tonight and ask whether the launch
                checklist actually moved.
              </div>
            </div>
          </FadeIn>

          <div className="grid gap-4 sm:grid-cols-2">
            {rail.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-warm-gray/30 bg-surface p-5 shadow-card">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-surface">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-dark">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-6 rounded-2xl border border-warm-gray/30 bg-surface p-5 shadow-card">
            <div className="grid gap-3 md:grid-cols-4">
              {[
                ["8:00", "Morning plan"],
                ["10:30", "Focus block"],
                ["2:00", "Midday check-in"],
                ["7:30", "Evening reflection"],
              ].map(([time, label]) => (
                <div key={time} className="rounded-xl bg-background px-4 py-3">
                  <div className="text-lg font-bold text-dark">{time}</div>
                  <div className="text-[12px] text-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
