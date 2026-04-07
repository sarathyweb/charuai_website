import WhatsAppCta from "@/components/WhatsAppCta";
import WhatsAppMockup from "@/components/WhatsAppMockup";

export default function Hero() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-[1120px] mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Text column */}
        <div className="md:w-[55%] flex flex-col gap-6">
          <h1 className="font-serif text-primary text-[2.25rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1]">
            You know what you need to do. Charu gets you to actually do it.
          </h1>
          <p className="text-muted text-lg max-w-xl">
            An AI accountability partner that calls your phone and checks in on
            WhatsApp. Daily calls, calendar sync, and task tracking - no new app
            to download.
          </p>
          <WhatsAppCta />
        </div>

        {/* Mockup column */}
        <div className="md:w-[45%]">
          <WhatsAppMockup />
        </div>
      </div>
    </section>
  );
}
