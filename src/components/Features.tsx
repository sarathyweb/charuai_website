"use client";

import FadeIn from "@/components/FadeIn";
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ClipboardDocumentCheckIcon,
  EnvelopeOpenIcon,
  PhoneArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { type ComponentType, type SVGProps } from "react";

const cards: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
}[] = [
  {
    icon: PhoneArrowUpRightIcon,
    title: "Calls that make commitment real",
    desc: "A scheduled phone call creates a harder-to-ignore moment than another reminder badge.",
  },
  {
    icon: ChatBubbleOvalLeftEllipsisIcon,
    title: "WhatsApp follow-ups you will see",
    desc: "Recaps, nudges, and quick changes happen in the chat already on your phone.",
  },
  {
    icon: CalendarDaysIcon,
    title: "Calendar-aware planning",
    desc: "Charu can see your schedule and help protect time for the work that matters.",
  },
  {
    icon: EnvelopeOpenIcon,
    title: "Gmail loose ends captured",
    desc: "Important emails can become tasks, drafts, or follow-up prompts during your call.",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: "Tasks and goals without extra admin",
    desc: "The things you say out loud become visible commitments you can update later.",
  },
  {
    icon: ArrowPathIcon,
    title: "Flexible call windows",
    desc: "Change the rhythm when your week changes, without rebuilding a productivity system.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-container px-6">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-warm">
              Why it keeps working
            </p>
            <h2 className="mt-3 font-serif text-[1.85rem] leading-tight text-primary md:text-[2.6rem]">
              Every feature points back to the next action.
            </h2>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-warm-gray/30 bg-background p-6 transition-colors hover:bg-accent-surface/70">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-surface shadow-sm">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-dark">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
