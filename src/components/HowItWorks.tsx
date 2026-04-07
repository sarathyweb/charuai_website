import WhatsAppCta from "@/components/WhatsAppCta";

const steps = [
  {
    number: "1",
    title: "Say hi on WhatsApp",
    desc: "Message Charu. Tell her your name and when you'd like your calls. That's it - two minutes, no app to download.",
  },
  {
    number: "2",
    title: "Get daily check-in calls",
    desc: "Morning call to plan your day. Afternoon call to check in. Evening call to wrap up. She asks what matters most and helps you start.",
  },
  {
    number: "3",
    title: "Actually finish things",
    desc: "Your tasks get tracked, your calendar gets blocked, your emails get answered. All through the same WhatsApp chat you already use.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-16 md:py-24">
      <div className="max-w-[1120px] mx-auto px-6">
        <h2 className="font-serif text-primary text-3xl md:text-4xl text-center">
          How Charu works
        </h2>
        <p className="text-muted text-lg text-center mt-4 mb-12">
          Three steps to a calmer day.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-3">
              <span className="font-serif text-primary text-5xl">
                {step.number}
              </span>
              <h3 className="font-bold text-text text-lg">{step.title}</h3>
              <p className="text-muted">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 mt-16">
          <WhatsAppCta />
          <p className="text-muted text-sm">Your day, handled.</p>
        </div>
      </div>
    </section>
  );
}
