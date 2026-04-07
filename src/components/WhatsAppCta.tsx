"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { WHATSAPP_URL_WITH_UTM } from "@/lib/constants";

export default function WhatsAppCta() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, WHATSAPP_URL_WITH_UTM, {
        width: 200,
        margin: 2,
        color: {
          dark: "#2C2D72",
          light: "#ffffff",
        },
      });
    }
  }, []);

  return (
    <div>
      {/* Desktop: QR code */}
      <div className="hidden md:flex flex-col items-center gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-qr">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>
        <p className="text-sm text-dark font-medium">Scan to chat with Charu</p>
        <a
          href={WHATSAPP_URL_WITH_UTM}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
        >
          Or open on your phone
        </a>
      </div>

      {/* Mobile: pill button */}
      <div className="md:hidden">
        <a
          href={WHATSAPP_URL_WITH_UTM}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block w-full text-center bg-primary text-white font-medium py-3.5 px-6 rounded-full hover:opacity-90 transition-all hover:shadow-lg active:scale-[0.98]"
        >
          Message Charu on WhatsApp
        </a>
      </div>
    </div>
  );
}
