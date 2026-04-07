"use client";

import FadeIn from "@/components/FadeIn";
import WhatsAppCta from "@/components/WhatsAppCta";
import {
  ChatBubbleLeftRightIcon,
  PhoneArrowUpRightIcon,
  CheckBadgeIcon,
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
    title: "Say hi on WhatsApp",
    desc: "Message Charu. Tell her your name and when you\u2019d like your calls. That\u2019s it \u2014 two minutes, no app to download.",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    number: "02",
    title: "Get daily check-in calls",
    desc: "Morning call to plan your day. Afternoon call to check in. Evening call to wrap up. She asks what matters most and helps you start.",
    icon: PhoneArrowUpRightIcon,
  },
  {
    number: "03",
    title: "Actually finish things",
    desc: "Your tasks get tracked, your calendar gets blocked, your emails get answered. All through the same WhatsApp chat you already use.",
    icon: CheckBadgeIcon,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-20 md:py-28 relative">
      <div className="max-w-[1120px] mx-auto px-6">
        <FadeIn>
          <h2 className="font-serif text-primary text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] leading-[1.15] text-center">
            How Charu works
          </h2>
          <p className="text-muted text-lg text-center mt-4 mb-16">
            Three steps to a calmer day.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-primary/20 via-accent-warm/30 to-primary/20" />

          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.2}>
              <div className="flex flex-col items-center text-center gap-4 relative">
                <div className="w-20 h-20 rounded-2xl bg-accent-surface flex items-center justify-center shadow-sm relative z-10">
                  <step.icon className="w-9 h-9 text-primary" />
                </div>
                <span className="step-number font-serif text-sm font-bold tracking-wider uppercase">
                  Step {step.number}
                </span>
                <h3 className="font-sans font-semibold text-text text-lg">
                  {step.title}
                </h3>
                <p className="text-muted text-[0.95rem] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.6}>
          <div className="flex flex-col items-center gap-4 mt-16">
            <WhatsAppCta />
            <p className="text-muted text-sm tracking-[0.01em]">
              Your day, handled.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
