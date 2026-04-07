export default function Features() {
  const cards = [
    {
      title: "WhatsApp check-ins",
      desc: "Quick nudges between calls. Like body doubling, but in your pocket - just the chat you already have.",
    },
    {
      title: "Your calendar, handled",
      desc: "Charu sees your day, finds the gaps, and blocks time for the work that matters - so you don't have to fight executive dysfunction alone.",
    },
    {
      title: "Emails that need replies",
      desc: "She surfaces the ones you're avoiding. Drafts a reply. You just say yes. No more inbox paralysis.",
    },
    {
      title: "Tasks you mention, tracked",
      desc: "Say it once, it's saved. Finish it, it's done. No separate app to open and abandon after a week.",
    },
    {
      title: "Adapts to your day",
      desc: "Reschedule calls, skip one, or say 'call me in 30 minutes.' She never ghosts, never judges.",
    },
  ];

  return (
    <section id="features" className="bg-background py-16 md:py-24">
      <div className="max-w-[1120px] mx-auto px-6">
        <h2 className="font-serif text-primary text-3xl md:text-4xl text-center mb-12">
          She shows up. Every single day.
        </h2>

        {/* Featured card */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-surface rounded-md shadow-card p-8">
            <h3 className="font-bold text-xl text-text mb-2">
              Daily accountability calls
            </h3>
            <p className="text-muted">
              Three calls a day. Your phone rings, you pick up, and someone asks
              what you need to get done. That&apos;s it. No notification to swipe
              away.
            </p>
          </div>
        </div>

        {/* Standard cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-surface rounded-md shadow-card p-6"
            >
              <h3 className="font-bold text-base text-text mb-2">
                {card.title}
              </h3>
              <p className="text-muted text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
