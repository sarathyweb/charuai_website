"use client";

import FadeIn from "@/components/FadeIn";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  CalendarDaysIcon,
  EnvelopeOpenIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
  PhoneArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { type ComponentType, type SVGProps } from "react";

const cards: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
}[] = [
  {
    icon: ChatBubbleOvalLeftEllipsisIcon,
    title: "WhatsApp check-ins",
    desc: "Quick nudges between calls. Like body doubling, but in your pocket \u2014 just the chat you already have.",
  },
  {
    icon: CalendarDaysIcon,
    title: "Your calendar, handled",
    desc: "Charu sees your day, finds the gaps, and blocks time for the work that matters \u2014 so you don\u2019t have to fight executive dysfunction alone.",
  },
  {
    icon: EnvelopeOpenIcon,
    title: "Emails that need replies",
    desc: "She surfaces the ones you\u2019re avoiding. Drafts a reply. You just say yes. No more inbox paralysis.",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: "Tasks you mention, tracked",
    desc: "Say it once, it\u2019s saved. Finish it, it\u2019s done. No separate app to open and abandon after a week.",
  },
  {
    icon: ArrowPathIcon,
    title: "Adapts to your day",
    desc: "Reschedule calls, skip one, or say \u2018call me in 30 minutes.\u2019 She never ghosts, never judges.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-background py-20 md:py-28 relative overflow-hidden">
      <div className="blob-decoration w-[400px] h-[400px] bg-accent-glow/15 -bottom-32 -left-32 absolute" />

      <div className="max-w-[1120px] mx-auto px-6 relative z-10">
        <FadeIn>
          <h2 className="font-serif text-primary text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] leading-[1.15] text-center mb-14">
            She shows up. Every single day.
          </h2>
        </FadeIn>

        {/* Featured card */}
        <FadeIn>
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-surface rounded-2xl shadow-card p-8 md:p-10 card-hover border border-warm-gray/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-warm/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-accent-surface flex items-center justify-center shrink-0">
                  <PhoneArrowUpRightIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-xl text-text mb-2">
                    Daily accountability calls
                  </h3>
                  <p className="text-muted leading-relaxed">
                    Three calls a day. Your phone rings, you pick up, and someone asks
                    what you need to get done. That&apos;s it. No notification to swipe
                    away.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Standard cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.1}>
              <div className="bg-surface rounded-xl shadow-card p-6 card-hover h-full border border-warm-gray/20">
                <card.icon className="w-6 h-6 text-accent-warm mb-3" />
                <h3 className="font-sans font-semibold text-base text-text mb-2">
                  {card.title}
                </h3>
                <p className="text-muted text-sm tracking-[0.01em] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
