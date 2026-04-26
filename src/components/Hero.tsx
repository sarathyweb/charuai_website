"use client";

import { motion } from "framer-motion";
import WhatsAppCta from "@/components/WhatsAppCta";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  EnvelopeOpenIcon,
  PhoneArrowUpRightIcon,
} from "@heroicons/react/24/outline";

function ProductScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="product-grid-bg absolute inset-0" />

      <motion.div
        initial={{ opacity: 0, y: 28, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-[-34px] top-24 hidden w-[560px] rounded-[28px] border border-warm-gray/50 bg-surface/95 p-5 shadow-[0_28px_90px_rgba(44,45,114,0.18)] lg:block"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Today
            </div>
            <div className="text-xl font-semibold text-dark">Follow-through plan</div>
          </div>
          <div className="rounded-full bg-green-50 px-3 py-1 text-[12px] font-medium text-green-700">
            Live
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            ["3", "calls"],
            ["7", "commitments"],
            ["2", "goals"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-xl border border-warm-gray/30 bg-background px-4 py-3"
            >
              <div className="text-2xl font-bold text-dark">{value}</div>
              <div className="text-[12px] text-muted">{label} tracked</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-[1.1fr_0.9fr] gap-4">
          <div className="rounded-2xl border border-warm-gray/30 bg-background p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-dark">
              <PhoneArrowUpRightIcon className="h-5 w-5 text-primary" />
              Next call
            </div>
            <div className="rounded-xl bg-surface p-3">
              <div className="text-[12px] text-muted">Morning plan</div>
              <div className="text-lg font-semibold text-dark">8:00 - 8:30 AM</div>
            </div>
            <div className="mt-3 space-y-2">
              {["Pick one priority", "Block focus time", "Send recap"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 text-[13px] text-muted">
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-warm-gray/30 bg-background p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-dark">
                <CalendarDaysIcon className="h-5 w-5 text-primary" />
                Calendar
              </div>
              <div className="h-2 w-full rounded bg-accent-surface" />
              <div className="mt-2 h-2 w-2/3 rounded bg-cta-blue/40" />
            </div>
            <div className="rounded-2xl border border-warm-gray/30 bg-background p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-dark">
                <EnvelopeOpenIcon className="h-5 w-5 text-primary" />
                Gmail
              </div>
              <div className="text-[12px] text-muted">2 replies drafted</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 34, rotate: 3 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-[-42px] right-[18%] hidden w-[265px] rounded-[32px] border border-warm-gray/40 bg-dark p-3 shadow-[0_26px_70px_rgba(26,26,46,0.24)] lg:block"
      >
        <div className="rounded-[24px] bg-[#f5f7fb] p-4">
          <div className="mb-4 flex items-center gap-3 border-b border-warm-gray/50 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              C
            </div>
            <div>
              <div className="text-sm font-semibold text-dark">Charu</div>
              <div className="text-[11px] text-green-700">calling today</div>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="max-w-[86%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-dark shadow-sm">
              What is the next action you can start today?
            </div>
            <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-white shadow-sm">
              Finish the launch deck.
            </div>
            <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-dark shadow-sm">
              Good. I saved that and will check back tonight.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-warm-gray/30 bg-background">
      <ProductScene />
      <div className="relative z-10 mx-auto max-w-container px-6 pb-16 pt-16 md:pb-24 md:pt-24 lg:min-h-[720px]">
        <div className="max-w-[680px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex items-center rounded-full border border-primary/15 bg-surface/90 px-4 py-2 text-[13px] font-semibold text-primary shadow-sm"
          >
            Charu AI for people who need a real nudge to begin
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[3.25rem] leading-none text-primary md:text-[5rem]"
          >
            AI accountability calls
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg leading-8 text-muted md:text-xl"
          >
            Charu calls on your schedule, helps you choose one next action,
            turns the commitment into tasks and goals, and follows up in
            WhatsApp so the plan does not disappear.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-[360px]"
          >
            <WhatsAppCta />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid max-w-xl grid-cols-3 gap-3"
          >
            {[
              ["2 min", "WhatsApp setup"],
              ["Your times", "call windows"],
              ["Tasks + goals", "saved for you"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="border-l border-primary/20 pl-3 text-[12px] uppercase tracking-[0.12em] text-muted"
              >
                <div className="text-lg font-bold normal-case tracking-normal text-dark">
                  {value}
                </div>
                {label}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 rounded-2xl border border-warm-gray/30 bg-surface p-4 shadow-card lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-warm-gray/20 pb-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Next call
                </div>
                <div className="text-base font-semibold text-dark">Start the day</div>
              </div>
              <div className="rounded-full bg-green-50 px-3 py-1 text-[12px] font-medium text-green-700">
                8:00 AM
              </div>
            </div>
            <div className="mt-3 grid gap-2">
              {["Choose one next action", "Save the commitment", "Send WhatsApp recap"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted">
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
