"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Profile {
  name: string;
  phone: string;
  created_at: string;
}

export default function ProfileCard({ profile }: { profile: Profile }) {
  const { logout } = useAuth();
  const router = useRouter();

  const initial = profile.name?.[0]?.toUpperCase() || "?";
  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-6 flex items-center gap-5">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent-warm flex items-center justify-center text-[22px] font-semibold text-white flex-shrink-0">
        {initial}
      </div>
      <div>
        <div className="text-[17px] font-semibold text-dark">{profile.name || "User"}</div>
        <div className="text-[13px] text-muted mt-0.5">{profile.phone}</div>
        <div className="text-[12px] text-muted">Member since {memberSince}</div>
      </div>
      <button
        onClick={handleLogout}
        className="ml-auto border border-warm-gray/40 rounded-lg px-5 py-2 text-[13px] text-muted hover:border-muted hover:text-dark transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
