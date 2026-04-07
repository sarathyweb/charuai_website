export default function About() {
  return (
    <section id="about" className="bg-accent-surface py-16 md:py-24">
      <div className="max-w-[680px] mx-auto px-6">
        <h2 className="font-serif text-primary text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] leading-[1.15] mb-8">
          Built for you, when starting feels impossible
        </h2>

        <div className="space-y-5">
          <p className="text-base leading-relaxed text-text">
            Starting tasks is genuinely hard. It&apos;s not a character flaw -
            it&apos;s a gap between knowing and doing that no planner or reminder
            can fix.
          </p>
          <p className="text-base leading-relaxed text-text">
            Charu doesn&apos;t say &quot;just do it&quot; or guilt you into
            productivity. She shows up like a friend who gets it - calls you,
            asks what matters, and helps you take the first step. If you miss a
            call, no big deal. She&apos;ll be there tomorrow.
          </p>
          <p className="text-base leading-relaxed text-text">
            People already pay humans $30-40 a month for exactly this - daily
            accountability calls that actually work. We built the AI version, so
            it never ghosts, never judges, and costs a fraction of a coach.
          </p>
        </div>

        <p className="italic text-muted mt-8">
          Your morning starts with a plan. Your day has structure. And you stop
          going to bed wondering where it all went.
        </p>

        <p className="text-sm tracking-[0.01em] text-muted mt-6">
          We read thousands of posts from people describing what they actually
          need. Then we built that.
        </p>

        <a
          href="#how-it-works"
          className="inline-block mt-8 text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
        >
          See how Charu works
        </a>
      </div>
    </section>
  );
}
