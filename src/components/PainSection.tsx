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
  text: string;
}[] = [
  {
    icon: BoltSlashIcon,
    text: "You have 20 things to do and can\u2019t start any of them. It\u2019s not laziness \u2014 your brain just won\u2019t bridge the gap between knowing and doing.",
  },
  {
    icon: ClockIcon,
    text: "Your day ends and you\u2019re not sure what you actually did. The guilt hits at 11pm, and you promise tomorrow will be different. It never is.",
  },
  {
    icon: DevicePhoneMobileIcon,
    text: "You\u2019ve tried the planners. The apps. The reminders you swipe away without reading. They all worked for a week \u2014 then became background noise.",
  },
];

export default function PainSection() {
  return (
    <section className="bg-accent-surface py-20 md:py-28 relative overflow-hidden">
      {/* Decorative blob */}
      <div className="blob-decoration w-[300px] h-[300px] bg-accent-warm/20 -top-20 -right-20 absolute" />

      <div className="max-w-[1120px] mx-auto px-6 relative z-10">
        <FadeIn>
          <h2 className="font-serif text-primary text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] leading-[1.15] text-center mb-4">
            Your to-do list is running your life
          </h2>
          <p className="text-muted text-center mb-14 max-w-md mx-auto">
            Sound familiar?
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {painCards.map((card, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="bg-surface rounded-xl shadow-card p-6 card-hover h-full">
                <card.icon className="w-7 h-7 text-accent-warm mb-3" />
                <p className="text-text leading-relaxed">{card.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5}>
          <p className="text-center text-muted text-lg mt-14 max-w-xl mx-auto italic">
            Imagine ending every day knowing you actually did the thing. Not
            everything — just the thing that mattered.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
