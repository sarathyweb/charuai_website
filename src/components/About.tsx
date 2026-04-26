"use client";

import FadeIn from "@/components/FadeIn";

export default function About() {
  return (
    <section id="about" className="bg-accent-surface py-20 md:py-28">
      <div className="mx-auto grid max-w-container gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <FadeIn>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-warm">
              Why this works differently
            </p>
            <h2 className="mt-3 font-serif text-[1.85rem] leading-tight text-primary md:text-[2.6rem]">
              Built for people who do better when accountability is outside their head.
            </h2>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {[
            "Starting tasks is genuinely hard. It is not a character flaw, and another empty planner will not magically close the gap.",
            "Charu shows up like a steady accountability partner: calls you, asks what matters, writes down the plan, and checks back later.",
            "The product is intentionally phone-first because a ringing phone creates a different kind of moment than a badge count or reminder banner.",
          ].map((paragraph, index) => (
            <FadeIn key={paragraph} delay={index * 0.08}>
              <p className="rounded-2xl border border-warm-gray/30 bg-surface p-5 text-base leading-8 text-text shadow-card">
                {paragraph}
              </p>
            </FadeIn>
          ))}

          <FadeIn delay={0.28}>
            <a
              href="#cta"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-background"
            >
              Start with the first call
              <span aria-hidden="true">-&gt;</span>
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
