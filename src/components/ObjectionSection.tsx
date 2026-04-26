"use client";

import FadeIn from "@/components/FadeIn";
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { type ComponentType, type SVGProps } from "react";

const answers: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
}[] = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Do I need another productivity app?",
    text: "No. The first step happens in WhatsApp, and the dashboard is there when you want a fuller view.",
  },
  {
    icon: ArrowPathIcon,
    title: "Will Charu call at random times?",
    text: "No. You choose the call windows, and you can reschedule, skip, or update the rhythm when your week changes.",
  },
  {
    icon: CalendarDaysIcon,
    title: "Why connect Calendar and Gmail?",
    text: "They give Charu enough context to protect time, spot follow-ups, and turn important loose ends into action.",
  },
  {
    icon: ShieldCheckIcon,
    title: "What happens after the call?",
    text: "Charu saves the goal, next action, and tasks, then sends the recap back to WhatsApp so the plan stays visible.",
  },
];

export default function ObjectionSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-warm">
              Before you start
            </p>
            <h2 className="mt-3 font-serif text-[1.85rem] leading-tight text-primary md:text-[2.6rem]">
              Clear answers before Charu ever calls you.
            </h2>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {answers.map((answer, index) => (
            <FadeIn key={answer.title} delay={index * 0.08}>
              <div className="h-full rounded-2xl border border-warm-gray/30 bg-surface p-6 shadow-card">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-surface">
                  <answer.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-dark">
                  {answer.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {answer.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
