"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import WhatsAppCta from "@/components/WhatsAppCta";

export default function CtaBanner() {
  return (
    <section id="cta" className="cta-gradient py-20 md:py-28 relative">
      <div className="max-w-[1120px] mx-auto px-6 text-center relative z-10">
        <FadeIn>
          <h2 className="font-serif text-white text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] leading-[1.15] mb-4">
            Ready to stop planning and start doing?
          </h2>
          <p className="text-white/70 text-base max-w-lg mx-auto mb-10">
            Two minutes to set up. No app to download. No judgment if you miss a
            day.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex justify-center">
            <WhatsAppCta />
          </div>
        </FadeIn>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-8 left-[10%] w-2 h-2 rounded-full bg-white/10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-12 right-[15%] w-3 h-3 rounded-full bg-white/8"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 right-[8%] w-1.5 h-1.5 rounded-full bg-white/10"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>
    </section>
  );
}
