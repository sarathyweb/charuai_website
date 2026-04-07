"use client";

import FadeIn from "@/components/FadeIn";

export default function About() {
  return (
    <section id="about" className="bg-accent-surface py-20 md:py-28 relative overflow-hidden">
      <div className="blob-decoration w-[250px] h-[250px] bg-accent-warm/15 top-10 -right-16 absolute" />

      <div className="max-w-[680px] mx-auto px-6 relative z-10">
        <FadeIn>
          <h2 className="font-serif text-primary text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] leading-[1.15] mb-8">
            Built for you, when starting feels impossible
          </h2>
        </FadeIn>

        <div className="space-y-5">
          <FadeIn delay={0.1}>
            <p className="text-base leading-relaxed text-text">
              Starting tasks is genuinely hard. It&apos;s not a character flaw —
              it&apos;s a gap between knowing and doing that no planner or reminder
              can fix.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-base leading-relaxed text-text">
              Charu doesn&apos;t say &quot;just do it&quot; or guilt you into
              productivity. She shows up like a friend who gets it — calls you,
              asks what matters, and helps you take the first step. If you miss a
              call, no big deal. She&apos;ll be there tomorrow.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-base leading-relaxed text-text">
              People already pay humans $30–40 a month for exactly this — daily
              accountability calls that actually work. We built the AI version, so
              it never ghosts, never judges, and costs a fraction of a coach.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-10 p-6 bg-surface rounded-xl border border-warm-gray/30 shadow-sm">
            <p className="italic text-muted leading-relaxed">
              &ldquo;Your morning starts with a plan. Your day has structure. And you stop
              going to bed wondering where it all went.&rdquo;
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 mt-8 text-primary font-medium hover:gap-3 transition-all"
          >
            See how Charu works
            <span aria-hidden="true">&rarr;</span>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
