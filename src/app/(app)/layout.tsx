"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { AuthProvider, useAuth } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-background text-text font-sans">
        <AuthProvider>
          <AuthGuard>
            <DashboardNav />
            <main>{children}</main>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
