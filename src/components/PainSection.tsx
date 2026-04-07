const painCards = [
  "You have 20 things to do and can't start any of them. It's not laziness - your brain just won't bridge the gap between knowing and doing.",
  "Your day ends and you're not sure what you actually did. The guilt hits at 11pm, and you promise tomorrow will be different. It never is.",
  "You've tried the planners. The apps. The reminders you swipe away without reading. They all worked for a week - then became background noise.",
];

export default function PainSection() {
  return (
    <section className="bg-accent-surface py-16 md:py-24">
      <div className="max-w-[1120px] mx-auto px-6">
        <h2 className="font-serif text-primary text-3xl md:text-4xl text-center mb-12">
          Your to-do list is running your life
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {painCards.map((text, i) => (
            <div
              key={i}
              className="bg-surface rounded-md shadow-card p-6"
            >
              <p className="text-text">{text}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-muted text-lg mt-12 max-w-xl mx-auto">
          Imagine ending every day knowing you actually did the thing. Not
          everything - just the thing that mattered.
        </p>
      </div>
    </section>
  );
}
