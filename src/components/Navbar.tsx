"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Why Charu", href: "#about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "nav-blur border-b border-warm-gray shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-container flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Charu AI"
            width={127}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-[0.01em] text-muted hover:text-primary transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/40 rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden md:inline-block text-sm tracking-[0.01em] text-muted hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <a
            href="#cta"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold tracking-[0.01em] text-white transition-colors hover:bg-cta-blue"
          >
            Start on WhatsApp
          </a>

          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-text transition-transform ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-text transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-text transition-transform ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-warm-gray bg-background px-6 overflow-hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="block py-3 text-sm tracking-[0.01em] text-muted hover:text-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: navLinks.length * 0.1 }}
              className="flex items-center gap-3 border-t border-warm-gray/50 py-3"
            >
              <Link
                href="/dashboard"
                className="text-sm tracking-[0.01em] text-primary font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <a
                href="#cta"
                className="ml-auto rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                onClick={() => setMenuOpen(false)}
              >
                Start
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
