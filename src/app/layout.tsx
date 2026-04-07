import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Charu AI - Your accountability partner that actually calls you",
  description:
    "Charu calls your phone every day to help you start, stay on track, and finish. Daily check-ins on WhatsApp. No new app to download.",
  openGraph: {
    title: "Charu AI - Your accountability partner that actually calls you",
    description:
      "Charu calls your phone every day to help you start, stay on track, and finish. Daily check-ins on WhatsApp. No new app to download.",
    type: "website",
    url: "https://charuai.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${inter.variable}`}>
      <body className="antialiased">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </body>
    </html>
  );
}
