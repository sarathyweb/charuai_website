"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { WHATSAPP_URL_WITH_UTM } from "@/lib/constants";

export default function WhatsAppCta() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, WHATSAPP_URL_WITH_UTM, {
        width: 148,
        margin: 1,
        color: {
          dark: "#2C2D72",
          light: "#ffffff",
        },
      });
    }
  }, []);

  return (
    <div className="w-full">
      <div className="hidden rounded-2xl border border-warm-gray/30 bg-surface p-4 shadow-card md:block">
        <a
          href={WHATSAPP_URL_WITH_UTM}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-cta-blue focus:outline-none focus:ring-4 focus:ring-primary/20"
        >
          Start on WhatsApp
        </a>
        <div className="mt-4 flex items-center gap-4">
          <div className="rounded-xl border border-warm-gray/30 bg-white p-2">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>
          <div>
            <p className="text-sm font-semibold text-dark">Scan to chat</p>
            <p className="mt-1 text-[12px] leading-5 text-muted">
              Works from the WhatsApp account already on your phone.
            </p>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <a
          href={WHATSAPP_URL_WITH_UTM}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-primary px-6 py-3.5 text-center font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Message Charu on WhatsApp
        </a>
      </div>
    </div>
  );
}
