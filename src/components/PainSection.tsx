"use client";

import FadeIn from "@/components/FadeIn";
import {
  BoltSlashIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { type ComponentType, type SVGProps } from "react";

const painCards: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
}[] = [
  {
    icon: BoltSlashIcon,
    title: "Starting is the bottleneck",
    text: "You can see the work clearly, but the first step still feels like a wall.",
  },
  {
    icon: ClockIcon,
    title: "Days blur together",
    text: "By night, you remember the pressure more than the progress.",
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Reminders go quiet",
    text: "Apps, planners, and notifications work until your brain turns them into background noise.",
  },
];

export default function PainSection() {
  return (
    <section className="bg-accent-surface py-20 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-warm">
              Built for the gap between knowing and doing
            </p>
            <h2 className="mt-3 font-serif text-[1.85rem] leading-tight text-primary md:text-[2.6rem]">
              Your to-do list is not the problem. Getting into motion is.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Charu is designed for the moment when motivation is gone but a real
              person asking the right question would still help.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {painCards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-warm-gray/30 bg-surface p-6 shadow-card transition-shadow hover:shadow-card-hover">
                <card.icon className="mb-4 h-7 w-7 text-primary" />
                <h3 className="text-base font-semibold text-dark">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.25}>
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-primary/10 bg-surface px-6 py-5 text-center shadow-card">
            <p className="text-base leading-7 text-dark">
              Charu does not ask you to become a different kind of person. It gives
              your day the kind of external structure that makes follow-through
              possible.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
