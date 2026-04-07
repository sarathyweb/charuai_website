import WhatsAppCta from "@/components/WhatsAppCta";

export default function CtaBanner() {
  return (
    <section id="cta" className="bg-cta-brown py-16 md:py-24">
      <div className="max-w-[1120px] mx-auto px-6 text-center">
        <h2 className="font-serif text-white text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] leading-[1.15] mb-4">
          Ready to stop planning and start doing?
        </h2>
        <p className="text-white/75 text-base max-w-lg mx-auto mb-10">
          Two minutes to set up. No app to download. No judgment if you miss a
          day.
        </p>
        <div className="flex justify-center">
          <WhatsAppCta />
        </div>
      </div>
    </section>
  );
}
