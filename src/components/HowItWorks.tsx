"use client";

import FadeIn from "@/components/FadeIn";
import WhatsAppCta from "@/components/WhatsAppCta";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  PhoneArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { type ComponentType, type SVGProps } from "react";

const steps: {
  number: string;
  title: string;
  desc: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  {
    number: "01",
    title: "Start in WhatsApp",
    desc: "Message Charu, set your name and timezone, and choose when accountability calls should happen.",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    number: "02",
    title: "Connect your work context",
    desc: "Calendar and Gmail give Charu the schedule and follow-up context needed to make each call useful.",
    icon: CalendarDaysIcon,
  },
  {
    number: "03",
    title: "Answer and move",
    desc: "Charu calls, helps you choose the next action, saves the plan, and follows up in WhatsApp.",
    icon: PhoneArrowUpRightIcon,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-warm">
              The path to the first call
            </p>
            <h2 className="mt-3 font-serif text-[1.85rem] leading-tight text-primary md:text-[2.6rem]">
              Start from WhatsApp, then let Charu carry the follow-through.
            </h2>
          </div>
        </FadeIn>

        <div className="relative mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-[42px] hidden h-px bg-warm-gray md:block" />

          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.12}>
              <div className="relative h-full rounded-2xl border border-warm-gray/30 bg-background p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-warm-gray/30 bg-surface shadow-sm">
                  <step.icon className="h-9 w-9 text-primary" />
                </div>
                <span className="mt-5 block text-[12px] font-bold uppercase tracking-[0.16em] text-accent-warm">
                  Step {step.number}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-dark">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="mx-auto mt-14 max-w-[360px]">
            <WhatsAppCta />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
