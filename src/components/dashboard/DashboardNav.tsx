"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Integrations", href: "/integrations" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const initial = user?.displayName?.[0]?.toUpperCase() || user?.phoneNumber?.[3] || "?";
  const phone = user?.phoneNumber || "";

  return (
    <nav className="bg-surface border-b border-warm-gray/30 px-8 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/dashboard">
          <img src="/logo.svg" alt="Charu AI" className="h-7" />
        </Link>
        <div className="flex gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                pathname === link.href
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-accent-surface hover:text-dark"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-muted hidden sm:inline">{phone}</span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-warm flex items-center justify-center text-[13px] font-semibold text-white">
          {initial}
        </div>
      </div>
    </nav>
  );
}
