"use client";

import { motion } from "framer-motion";
import WhatsAppCta from "@/components/WhatsAppCta";
import WhatsAppMockup from "@/components/WhatsAppMockup";

export default function Hero() {
  return (
    <section className="hero-gradient py-20 md:py-32 overflow-hidden relative">
      <div className="max-w-[1120px] mx-auto px-6 flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Text column */}
        <div className="md:w-[55%] flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-sm font-medium text-accent-warm tracking-wide uppercase mb-2">
              Your AI accountability partner
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-primary text-[2.25rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1]"
          >
            You know what you need to do.{" "}
            <span className="relative inline-block">
              Charu gets you to actually do it.
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M2 8C50 2 100 4 150 6C200 8 250 4 298 7"
                  stroke="#507ABD"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-muted text-lg max-w-xl"
          >
            An AI accountability partner that calls your phone and checks in on
            WhatsApp. Daily calls, calendar sync, and task tracking — no new app
            to download.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <WhatsAppCta />
          </motion.div>
        </div>

        {/* Mockup column */}
        <motion.div
          className="md:w-[45%]"
          initial={{ opacity: 0, x: 40, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <WhatsAppMockup />
        </motion.div>
      </div>
    </section>
  );
}
