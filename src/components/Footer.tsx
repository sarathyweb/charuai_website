import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-accent-surface">
      <div className="mx-auto max-w-container px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo.svg" alt="Charu AI" className="h-6 brightness-0 invert" />
        </Link>

        {/* Links */}
        <div className="flex gap-6 text-sm tracking-[0.01em]">
          <Link
            href="/privacy"
            className="underline underline-offset-4 text-accent-surface/70 hover:text-accent-surface transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="underline underline-offset-4 text-accent-surface/70 hover:text-accent-surface transition-colors"
          >
            Terms &amp; Conditions
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm tracking-[0.01em] text-accent-surface/60 text-center md:text-right">
          2026 Charu AI. Made with care for people who struggle to start.
        </p>
      </div>
    </footer>
  );
}
