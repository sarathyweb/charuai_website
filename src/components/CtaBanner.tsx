"use client";

import FadeIn from "@/components/FadeIn";
import WhatsAppCta from "@/components/WhatsAppCta";

export default function CtaBanner() {
  return (
    <section id="cta" className="bg-dark py-20 md:py-28">
      <div className="mx-auto grid max-w-container gap-8 px-6 md:grid-cols-[1fr_360px] md:items-center">
        <FadeIn>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-glow">
              Ready when you are
            </p>
            <h2 className="mt-3 font-serif text-[2rem] leading-tight text-white md:text-[3rem]">
              Let the next action become a call, not another note to yourself.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
              Message Charu on WhatsApp, choose your call windows, connect your
              work context, and let the first accountability call turn today
              into a concrete next step.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div>
            <WhatsAppCta />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
