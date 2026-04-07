# Customer Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a customer-facing dashboard to the existing charuai.com Next.js website with Firebase Phone Auth, progress tracking, read-only task list, call schedule view, profile, and integrations management.

**Architecture:** Next.js 16 App Router with route groups — `(marketing)` for existing homepage/privacy/terms and `(app)` for authenticated dashboard/integrations. Firebase Phone Auth is client-side only. All data fetched client-side from api.charuai.com with JWT. Route groups give separate layouts without affecting URLs.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Firebase JS SDK (phone auth), react-phone-number-input

**Design Spec:** `docs/superpowers/specs/2026-04-07-customer-dashboard-design.md`

**IMPORTANT:** This is Next.js 16 which has breaking changes. Before writing any code for a file, check the relevant guide in `node_modules/next/dist/docs/` for current API. Key changes: `params` is now a Promise, route groups support multiple root layouts, `LayoutProps` helper is globally available.

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                          ← DELETE (replaced by route group layouts)
│   ├── (marketing)/
│   │   ├── layout.tsx                      ← NEW: root layout with Navbar+Footer (move from current app/layout.tsx)
│   │   ├── page.tsx                        ← MOVE from app/page.tsx
│   │   ├── privacy/page.tsx                ← MOVE from app/privacy/page.tsx
│   │   └── terms/page.tsx                  ← MOVE from app/terms/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx                      ← NEW: root layout with AuthProvider, dashboard nav, auth guard
│   │   ├── dashboard/page.tsx              ← NEW: progress + tasks + schedule + profile
│   │   └── integrations/page.tsx           ← NEW: integration management
│   ├── login/
│   │   ├── layout.tsx                      ← NEW: minimal root layout (no nav)
│   │   └── page.tsx                        ← NEW: Firebase Phone Auth
│   └── globals.css                         ← KEEP (already updated with blue palette)
├── components/
│   ├── Navbar.tsx                           ← KEEP (marketing only)
│   ├── Footer.tsx                           ← KEEP (marketing only)
│   ├── dashboard/
│   │   ├── DashboardNav.tsx                ← NEW
│   │   ├── SectionNav.tsx                  ← NEW
│   │   ├── ProgressStats.tsx               ← NEW
│   │   ├── Heatmap.tsx                     ← NEW
│   │   ├── WeeklySummary.tsx               ← NEW
│   │   ├── TaskList.tsx                    ← NEW
│   │   ├── CallSchedule.tsx                ← NEW
│   │   └── ProfileCard.tsx                 ← NEW
│   └── integrations/
│       ├── IntegrationCard.tsx             ← NEW
│       └── ComingSoonBadge.tsx             ← NEW
├── lib/
│   ├── constants.ts                        ← KEEP
│   ├── firebase.ts                         ← NEW
│   ├── auth.tsx                            ← NEW
│   └── api.ts                              ← NEW
```

Note: Route groups `(marketing)` and `(app)` each define their own root `layout.tsx` with `<html>` and `<body>`. `/login` also gets its own root layout. Navigating between route groups causes a full page load (expected and acceptable — users navigate marketing→login→dashboard, not back and forth).

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Firebase and phone input packages**

```bash
cd /home/sarathy/projects/charu.ai/website
npm install firebase react-phone-number-input
```

- [ ] **Step 2: Verify installation**

```bash
node -e "require('firebase/app'); console.log('firebase OK')"
node -e "require('react-phone-number-input'); console.log('phone-input OK')"
```

Expected: Both print OK without errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add firebase and react-phone-number-input"
```

---

## Task 2: Restructure into route groups

Move existing pages into `(marketing)` route group and create `(app)` and `login` route group skeletons. This task changes no functionality — the homepage must still work at `/`.

**Files:**
- Move: `src/app/layout.tsx` → `src/app/(marketing)/layout.tsx`
- Move: `src/app/page.tsx` → `src/app/(marketing)/page.tsx`
- Move: `src/app/privacy/page.tsx` → `src/app/(marketing)/privacy/page.tsx`
- Move: `src/app/terms/page.tsx` → `src/app/(marketing)/terms/page.tsx`
- Create: `src/app/(app)/layout.tsx` (placeholder)
- Create: `src/app/(app)/dashboard/page.tsx` (placeholder)
- Create: `src/app/(app)/integrations/page.tsx` (placeholder)
- Create: `src/app/login/layout.tsx` (placeholder)
- Create: `src/app/login/page.tsx` (placeholder)

- [ ] **Step 1: Create route group directories**

```bash
mkdir -p src/app/\(marketing\)/privacy src/app/\(marketing\)/terms
mkdir -p src/app/\(app\)/dashboard src/app/\(app\)/integrations
mkdir -p src/app/login
```

- [ ] **Step 2: Move marketing pages**

```bash
mv src/app/page.tsx src/app/\(marketing\)/page.tsx
mv src/app/privacy/page.tsx src/app/\(marketing\)/privacy/page.tsx
mv src/app/terms/page.tsx src/app/\(marketing\)/terms/page.tsx
rmdir src/app/privacy src/app/terms
```

- [ ] **Step 3: Move and adapt root layout to marketing layout**

Copy `src/app/layout.tsx` to `src/app/(marketing)/layout.tsx`. It already has `<html>`, `<body>`, Navbar, Footer — that's exactly what the marketing root layout needs. Then delete `src/app/layout.tsx`.

```bash
cp src/app/layout.tsx src/app/\(marketing\)/layout.tsx
rm src/app/layout.tsx
```

- [ ] **Step 4: Create (app) root layout placeholder**

```tsx
// src/app/(app)/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dashboard | Charu AI",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-background text-text font-sans">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Create dashboard page placeholder**

```tsx
// src/app/(app)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted">Dashboard coming soon</p>
    </div>
  );
}
```

- [ ] **Step 6: Create integrations page placeholder**

```tsx
// src/app/(app)/integrations/page.tsx
export default function IntegrationsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted">Integrations coming soon</p>
    </div>
  );
}
```

- [ ] **Step 7: Create login root layout**

```tsx
// src/app/login/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sign In | Charu AI",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-background text-text font-sans">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Create login page placeholder**

```tsx
// src/app/login/page.tsx
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted">Login coming soon</p>
    </div>
  );
}
```

- [ ] **Step 9: Build and verify**

```bash
npm run build
```

Expected: Build succeeds. Routes should be:
- `/ ` → marketing homepage
- `/privacy` → privacy page
- `/terms` → terms page
- `/dashboard` → placeholder
- `/integrations` → placeholder
- `/login` → placeholder

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "refactor: restructure into route groups for marketing/app/login"
```

---

## Task 3: Firebase setup and auth library

**Files:**
- Create: `src/lib/firebase.ts`
- Create: `src/lib/auth.tsx`
- Create: `src/lib/api.ts`
- Create: `.env.local` (not committed)

- [ ] **Step 1: Create `.env.local` with Firebase config**

Create `.env.local` in the `website/` directory (this file is gitignored by default in Next.js):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_BASE_URL=https://api.charuai.com
```

- [ ] **Step 2: Create Firebase initialization**

```ts
// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
```

- [ ] **Step 3: Create AuthProvider and useAuth hook**

```tsx
// src/lib/auth.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import {
  type User,
  type ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sendOtp: (phoneNumber: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<User>;
  getIdToken: () => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.charuai.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const sendOtp = async (phoneNumber: string) => {
    recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    const result = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaRef.current
    );
    setConfirmationResult(result);
  };

  const verifyOtp = async (code: string): Promise<User> => {
    if (!confirmationResult) {
      throw new Error("No confirmation result. Send OTP first.");
    }
    const result = await confirmationResult.confirm(code);

    // Sync user to backend
    const token = await result.user.getIdToken();
    await fetch(`${API_BASE}/api/auth/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    return result.user;
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, sendOtp, verifyOtp, getIdToken, logout }}
    >
      {children}
      <div id="recaptcha-container" />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
```

- [ ] **Step 4: Create authenticated fetch wrapper**

```ts
// src/lib/api.ts
import { auth } from "./firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.charuai.com";

export async function authFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE}${path}`;
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return fetch(url, options);
}
```

- [ ] **Step 5: Build to verify no type errors**

```bash
npm run build
```

Expected: Build succeeds. Firebase modules are tree-shaken — unused code won't be in the bundle.

- [ ] **Step 6: Commit**

```bash
git add src/lib/firebase.ts src/lib/auth.tsx src/lib/api.ts
git commit -m "feat: add Firebase auth library with AuthProvider and authFetch"
```

---

## Task 4: Login page

**Files:**
- Modify: `src/app/login/layout.tsx`
- Rewrite: `src/app/login/page.tsx`

- [ ] **Step 1: Update login layout to include AuthProvider**

```tsx
// src/app/login/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sign In | Charu AI",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-background text-text font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Implement login page with phone input and OTP**

```tsx
// src/app/login/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { user, loading, sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState<string | undefined>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  const handleSendOtp = async () => {
    if (!phone) return;
    setSubmitting(true);
    setError("");
    try {
      await sendOtp(phone);
      setOtpSent(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to send code";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setSubmitting(true);
    setError("");
    try {
      await verifyOtp(code);
      router.push("/dashboard");
    } catch {
      setError("Invalid code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="bg-surface border border-warm-gray/30 rounded-2xl shadow-card w-full max-w-[400px] p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/logo.svg" alt="Charu AI" className="h-8 mx-auto" />
          </div>

          {!otpSent ? (
            <>
              <h1 className="text-[22px] font-bold text-dark text-center mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-muted text-center mb-8">
                Sign in with your phone number to access your dashboard.
              </p>

              <label className="block text-[13px] font-medium text-dark mb-1.5">
                Phone number
              </label>
              <PhoneInput
                international
                defaultCountry="IN"
                value={phone}
                onChange={setPhone}
                className="mb-6"
              />

              {error && (
                <p className="text-sm text-red-600 mb-4">{error}</p>
              )}

              <button
                onClick={handleSendOtp}
                disabled={!phone || submitting}
                className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-accent-warm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send verification code"}
              </button>

              <p className="text-xs text-muted text-center mt-6 leading-relaxed">
                By continuing, you agree to our{" "}
                <a href="/terms" className="text-primary underline">Terms</a> and{" "}
                <a href="/privacy" className="text-primary underline">Privacy Policy</a>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => { setOtpSent(false); setError(""); setOtp(["","","","","",""]); }}
                className="text-[13px] text-muted hover:text-dark mb-6 inline-flex items-center gap-1"
              >
                &larr; Change number
              </button>

              <h1 className="text-[22px] font-bold text-dark text-center mb-2">
                Enter verification code
              </h1>
              <p className="text-sm text-muted text-center mb-8">
                We sent a 6-digit code to<br />
                <span className="font-semibold text-dark">{phone}</span>
              </p>

              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-[22px] font-semibold text-dark bg-background border border-warm-gray rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center mb-4">{error}</p>
              )}

              <button
                onClick={handleVerify}
                disabled={otp.join("").length !== 6 || submitting}
                className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-accent-warm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Verifying..." : "Verify"}
              </button>

              <p className="text-xs text-muted text-center mt-6">
                Code expires in 5 minutes
              </p>
            </>
          )}
        </div>
      </div>
      <div className="text-center py-4">
        <a href="/" className="text-xs text-muted underline">Back to charuai.com</a>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add PhoneInput CSS override for Tailwind compatibility**

Add to the bottom of `src/app/globals.css`:

```css
/* Phone input overrides */
.PhoneInput {
  display: flex;
  gap: 8px;
}
.PhoneInputCountry {
  padding: 12px;
  background: var(--color-background);
  border: 1px solid var(--color-warm-gray);
  border-radius: 10px;
}
.PhoneInputInput {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  background: var(--color-background);
  border: 1px solid var(--color-warm-gray);
  border-radius: 10px;
  outline: none;
  color: var(--color-text);
}
.PhoneInputInput:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(67,104,177,0.1);
}
```

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

Expected: Build succeeds with `/login` route.

- [ ] **Step 5: Commit**

```bash
git add src/app/login/ src/app/globals.css
git commit -m "feat: implement login page with Firebase Phone Auth"
```

---

## Task 5: Dashboard layout with AuthProvider and nav

**Files:**
- Rewrite: `src/app/(app)/layout.tsx`
- Create: `src/components/dashboard/DashboardNav.tsx`
- Create: `src/components/dashboard/SectionNav.tsx`

- [ ] **Step 1: Create DashboardNav component**

```tsx
// src/components/dashboard/DashboardNav.tsx
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
```

- [ ] **Step 2: Create SectionNav component**

```tsx
// src/components/dashboard/SectionNav.tsx
"use client";

const sections = [
  { id: "progress", label: "Progress" },
  { id: "tasks", label: "Tasks" },
  { id: "schedule", label: "Schedule" },
  { id: "profile", label: "Profile" },
];

export default function SectionNav() {
  return (
    <div className="bg-surface border-b border-warm-gray/20 px-8 flex gap-6 sticky top-[53px] z-40">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="py-2.5 text-[13px] font-medium text-muted hover:text-dark border-b-2 border-transparent hover:border-primary/30 transition-all"
        >
          {s.label}
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Update (app) layout with AuthProvider, auth guard, and nav**

```tsx
// src/app/(app)/layout.tsx
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
```

Note: This layout is `"use client"` because it uses AuthProvider (context) and AuthGuard (hooks). The metadata export must be removed since client components cannot export metadata. The page title will be set via the page components or we accept the default.

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

Expected: Build succeeds. `/dashboard` and `/integrations` now show the nav with auth guard.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(app\)/layout.tsx src/components/dashboard/DashboardNav.tsx src/components/dashboard/SectionNav.tsx
git commit -m "feat: add dashboard layout with auth guard and navigation"
```

---

## Task 6: Dashboard page — Progress section

**Files:**
- Create: `src/components/dashboard/ProgressStats.tsx`
- Create: `src/components/dashboard/Heatmap.tsx`
- Create: `src/components/dashboard/WeeklySummary.tsx`
- Modify: `src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Create ProgressStats component**

```tsx
// src/components/dashboard/ProgressStats.tsx
"use client";

interface Stats {
  streak: { current: number; best: number };
  week: { calls_completed: number; calls_total: number; prev_calls_completed: number };
  goals: { completion_pct: number; prev_completion_pct: number };
}

function TrendIndicator({ current, previous }: { current: number; previous: number }) {
  if (current > previous) return <span className="text-[12px] text-green-600">&uarr; from {previous}</span>;
  if (current < previous) return <span className="text-[12px] text-muted">&darr; from {previous}</span>;
  return <span className="text-[12px] text-muted">same as last week</span>;
}

export default function ProgressStats({ stats }: { stats: Stats }) {
  const goalDiff = stats.goals.completion_pct - stats.goals.prev_completion_pct;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-surface border border-warm-gray/20 rounded-xl p-5 shadow-card">
        <div className="text-[11px] uppercase tracking-wider text-muted font-medium">Current Streak</div>
        <div className="text-[32px] font-bold text-dark mt-1">{stats.streak.current}</div>
        <div className="text-[12px] text-green-600">days</div>
      </div>
      <div className="bg-surface border border-warm-gray/20 rounded-xl p-5 shadow-card">
        <div className="text-[11px] uppercase tracking-wider text-muted font-medium">Best Streak</div>
        <div className="text-[32px] font-bold text-dark mt-1">{stats.streak.best}</div>
        <div className="text-[12px] text-muted">days</div>
      </div>
      <div className="bg-surface border border-warm-gray/20 rounded-xl p-5 shadow-card">
        <div className="text-[11px] uppercase tracking-wider text-muted font-medium">This Week</div>
        <div className="text-[32px] font-bold text-dark mt-1">{stats.week.calls_completed}/{stats.week.calls_total}</div>
        <TrendIndicator current={stats.week.calls_completed} previous={stats.week.prev_calls_completed} />
      </div>
      <div className="bg-surface border border-warm-gray/20 rounded-xl p-5 shadow-card">
        <div className="text-[11px] uppercase tracking-wider text-muted font-medium">Goals Completed</div>
        <div className="text-[32px] font-bold text-dark mt-1">{stats.goals.completion_pct}%</div>
        <span className={`text-[12px] ${goalDiff >= 0 ? "text-green-600" : "text-muted"}`}>
          {goalDiff >= 0 ? `\u2191 ${goalDiff}%` : `\u2193 ${Math.abs(goalDiff)}%`} vs last week
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Heatmap component**

```tsx
// src/components/dashboard/Heatmap.tsx
"use client";

interface HeatmapDay {
  date: string;
  level: number; // 0-4
}

const LEVEL_COLORS = [
  "bg-warm-gray/40",  // 0 = no activity (neutral gray)
  "bg-[#b8d4f0]",     // 1
  "bg-[#7badd6]",     // 2
  "bg-[#4B73B9]",     // 3
  "bg-[#2C2D72]",     // 4
];

export default function Heatmap({ data }: { data: HeatmapDay[] }) {
  // Group into weeks (7 days per column)
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-dark">Activity (last 12 weeks)</span>
        <div className="flex items-center gap-1 text-[11px] text-muted">
          <span>Less</span>
          {LEVEL_COLORS.map((c, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="flex gap-[3px]">
        <div className="flex flex-col gap-[3px] pr-1 text-[9px] text-muted">
          <div className="h-[11px] leading-[11px]">M</div>
          <div className="h-[11px]" />
          <div className="h-[11px] leading-[11px]">W</div>
          <div className="h-[11px]" />
          <div className="h-[11px] leading-[11px]">F</div>
          <div className="h-[11px]" />
          <div className="h-[11px] leading-[11px]">S</div>
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div
                key={di}
                className={`w-[11px] h-[11px] rounded-sm ${LEVEL_COLORS[day.level] || LEVEL_COLORS[0]}`}
                title={`${day.date}: level ${day.level}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create WeeklySummary component**

```tsx
// src/components/dashboard/WeeklySummary.tsx
export default function WeeklySummary({ summary }: { summary: string }) {
  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card">
      <div className="px-5 pt-4 text-sm font-semibold text-dark">Weekly Summary</div>
      <div className="px-5 pb-4 pt-2 text-sm text-muted leading-relaxed">{summary}</div>
    </div>
  );
}
```

- [ ] **Step 4: Wire up dashboard page with progress section**

```tsx
// src/app/(app)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import SectionNav from "@/components/dashboard/SectionNav";
import ProgressStats from "@/components/dashboard/ProgressStats";
import Heatmap from "@/components/dashboard/Heatmap";
import WeeklySummary from "@/components/dashboard/WeeklySummary";

interface DashboardData {
  streak: { current: number; best: number };
  week: { calls_completed: number; calls_total: number; prev_calls_completed: number };
  goals: { completion_pct: number; prev_completion_pct: number };
  heatmap: { date: string; level: number }[];
  weekly_summary: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch("/api/progress")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Something went wrong. Please try again."));
  }, []);

  return (
    <>
      <SectionNav />
      <div className="max-w-[960px] mx-auto px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Progress Section */}
        <section id="progress" className="mb-10">
          <h2 className="text-lg font-semibold text-dark mb-4">Progress</h2>
          {data ? (
            <div className="space-y-3">
              <ProgressStats stats={{ streak: data.streak, week: data.week, goals: data.goals }} />
              <Heatmap data={data.heatmap} />
              <WeeklySummary summary={data.weekly_summary} />
            </div>
          ) : !error ? (
            <div className="space-y-3">
              {/* Skeleton loading */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-surface border border-warm-gray/20 rounded-xl p-5 shadow-card animate-pulse">
                    <div className="h-3 w-20 bg-warm-gray/30 rounded mb-3" />
                    <div className="h-8 w-16 bg-warm-gray/30 rounded mb-2" />
                    <div className="h-3 w-12 bg-warm-gray/30 rounded" />
                  </div>
                ))}
              </div>
              <div className="h-32 bg-surface border border-warm-gray/20 rounded-xl shadow-card animate-pulse" />
              <div className="h-20 bg-surface border border-warm-gray/20 rounded-xl shadow-card animate-pulse" />
            </div>
          ) : null}
        </section>

        {/* Remaining sections added in Tasks 7 and 8 */}
      </div>
    </>
  );
}
```

- [ ] **Step 5: Build to verify**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/ProgressStats.tsx src/components/dashboard/Heatmap.tsx src/components/dashboard/WeeklySummary.tsx src/app/\(app\)/dashboard/page.tsx
git commit -m "feat: add dashboard progress section with stats, heatmap, and weekly summary"
```

---

## Task 7: Dashboard page — Tasks, Schedule, Profile sections

**Files:**
- Create: `src/components/dashboard/TaskList.tsx`
- Create: `src/components/dashboard/CallSchedule.tsx`
- Create: `src/components/dashboard/ProfileCard.tsx`
- Modify: `src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Create TaskList component**

```tsx
// src/components/dashboard/TaskList.tsx
"use client";

import { useState } from "react";

interface Task {
  id: number;
  title: string;
  priority: number;
  status: string;
  source: string;
  created_at: string;
  completed_at: string | null;
}

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-warm-gray",
};

function priorityLabel(p: number): string {
  if (p >= 70) return "high";
  if (p >= 40) return "medium";
  return "low";
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  return `${Math.floor(days / 7)} weeks ago`;
}

export default function TaskList({
  pending,
  completed,
}: {
  pending: Task[];
  completed: Task[];
}) {
  const [tab, setTab] = useState<"pending" | "completed">("pending");
  const tasks = tab === "pending" ? pending : completed;

  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card overflow-hidden">
      <div className="flex border-b border-warm-gray/20 px-5">
        <button
          onClick={() => setTab("pending")}
          className={`py-3 px-4 text-[13px] font-medium border-b-2 transition-colors ${
            tab === "pending"
              ? "text-primary border-primary"
              : "text-muted border-transparent"
          }`}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setTab("completed")}
          className={`py-3 px-4 text-[13px] font-medium border-b-2 transition-colors ${
            tab === "completed"
              ? "text-primary border-primary"
              : "text-muted border-transparent"
          }`}
        >
          Completed ({completed.length})
        </button>
      </div>
      {tasks.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-muted">
          {tab === "pending"
            ? "No tasks yet. Charu will track tasks from your daily calls."
            : "No completed tasks yet."}
        </div>
      ) : (
        <div>
          {tasks.map((task) => {
            const level = priorityLabel(task.priority);
            return (
              <div key={task.id} className="flex items-center px-5 py-3.5 border-b border-warm-gray/10 last:border-b-0">
                <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[level]} mr-3.5 flex-shrink-0`} />
                <div>
                  <div className="text-sm text-dark">{task.title}</div>
                  <div className="text-[11px] text-muted mt-0.5">
                    Added {timeAgo(task.created_at)} &middot; Priority: {level.charAt(0).toUpperCase() + level.slice(1)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create CallSchedule component**

```tsx
// src/components/dashboard/CallSchedule.tsx
interface Window {
  type: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
}

const ICONS: Record<string, string> = {
  morning: "\u{1F305}",
  evening: "\u{1F319}",
};

const LABELS: Record<string, string> = {
  morning: "Morning Call",
  evening: "Evening Reflection",
};

export default function CallSchedule({ windows }: { windows: Window[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {windows.map((w) => (
        <div key={w.type} className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-6">
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="text-[22px]">{ICONS[w.type] || ""}</span>
            <span className="text-sm font-semibold text-dark">{LABELS[w.type] || w.type}</span>
            <span className={`ml-auto text-[11px] font-medium px-2.5 py-0.5 rounded ${
              w.is_active
                ? "bg-green-50 text-green-700"
                : "bg-warm-gray/20 text-muted"
            }`}>
              {w.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="text-[26px] font-bold text-dark">{w.start_time} &ndash; {w.end_time}</div>
          <div className="text-[12px] text-muted mt-1">{w.timezone}</div>
          <div className="text-[12px] text-muted mt-3 italic">
            To change, tell Charu during your next call or on WhatsApp
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create ProfileCard component**

```tsx
// src/components/dashboard/ProfileCard.tsx
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
```

- [ ] **Step 4: Add Tasks, Schedule, Profile sections to dashboard page**

Add the following sections inside the dashboard page, after the Progress section closing `</section>` and before the closing `</div>`:

Add imports at top of `src/app/(app)/dashboard/page.tsx`:

```tsx
import TaskList from "@/components/dashboard/TaskList";
import CallSchedule from "@/components/dashboard/CallSchedule";
import ProfileCard from "@/components/dashboard/ProfileCard";
```

Add state types for tasks, windows, profile alongside existing DashboardData:

```tsx
interface Task {
  id: number;
  title: string;
  priority: number;
  status: string;
  source: string;
  created_at: string;
  completed_at: string | null;
}

interface CallWindow {
  type: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
}

interface Profile {
  name: string;
  phone: string;
  created_at: string;
}
```

Add state variables:

```tsx
const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
const [windows, setWindows] = useState<CallWindow[]>([]);
const [profile, setProfile] = useState<Profile | null>(null);
```

Add fetch calls in the existing `useEffect`:

```tsx
useEffect(() => {
  authFetch("/api/progress")
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    })
    .then(setData)
    .catch(() => setError("Something went wrong. Please try again."));

  authFetch("/api/tasks?status=pending")
    .then((r) => r.ok ? r.json() : { tasks: [] })
    .then((d) => setPendingTasks(d.tasks || []));

  authFetch("/api/tasks?status=completed")
    .then((r) => r.ok ? r.json() : { tasks: [] })
    .then((d) => setCompletedTasks(d.tasks || []));

  authFetch("/api/call-windows")
    .then((r) => r.ok ? r.json() : { windows: [] })
    .then((d) => setWindows(d.windows || []));

  authFetch("/api/user/profile")
    .then((r) => r.ok ? r.json() : null)
    .then(setProfile);
}, []);
```

Add sections after the Progress section:

```tsx
{/* Tasks Section */}
<section id="tasks" className="mb-10">
  <h2 className="text-lg font-semibold text-dark mb-4">Tasks</h2>
  <TaskList pending={pendingTasks} completed={completedTasks} />
</section>

{/* Schedule Section */}
<section id="schedule" className="mb-10">
  <h2 className="text-lg font-semibold text-dark mb-4">Call Schedule</h2>
  {windows.length > 0 ? (
    <CallSchedule windows={windows} />
  ) : (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-8 text-center text-sm text-muted">
      No call windows configured yet. Tell Charu your preferred schedule during your next call.
    </div>
  )}
</section>

{/* Profile Section */}
<section id="profile" className="mb-10">
  <h2 className="text-lg font-semibold text-dark mb-4">Profile</h2>
  {profile ? (
    <ProfileCard profile={profile} />
  ) : (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-6 animate-pulse">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-warm-gray/30" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-warm-gray/30 rounded" />
          <div className="h-3 w-24 bg-warm-gray/30 rounded" />
        </div>
      </div>
    </div>
  )}
</section>
```

- [ ] **Step 5: Build to verify**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/TaskList.tsx src/components/dashboard/CallSchedule.tsx src/components/dashboard/ProfileCard.tsx src/app/\(app\)/dashboard/page.tsx
git commit -m "feat: add tasks, call schedule, and profile sections to dashboard"
```

---

## Task 8: Integrations page

**Files:**
- Create: `src/components/integrations/IntegrationCard.tsx`
- Create: `src/components/integrations/ComingSoonBadge.tsx`
- Rewrite: `src/app/(app)/integrations/page.tsx`

- [ ] **Step 1: Create IntegrationCard component**

```tsx
// src/components/integrations/IntegrationCard.tsx
"use client";

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  email?: string;
  statusText?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  readOnly?: boolean;
}

export default function IntegrationCard({
  name,
  description,
  icon,
  connected,
  email,
  statusText,
  onConnect,
  onDisconnect,
  readOnly,
}: IntegrationCardProps) {
  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-5 flex items-center gap-4 mb-2.5">
      <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-[22px] flex-shrink-0 bg-accent-surface">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-dark">{name}</div>
        <div className="text-[13px] text-muted mt-0.5">{description}</div>
        {connected && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded bg-green-50 text-green-700">Connected</span>
            {email && <span className="text-[12px] text-muted">{email}</span>}
            {statusText && (
              <span className="flex items-center gap-1.5 text-[13px] text-dark">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {statusText}
              </span>
            )}
          </div>
        )}
        {!connected && !readOnly && (
          <div className="text-[12px] text-muted mt-1">Not connected</div>
        )}
      </div>
      <div className="flex-shrink-0">
        {readOnly && connected ? (
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded bg-green-50 text-green-700">Connected</span>
        ) : connected ? (
          <button
            onClick={onDisconnect}
            className="border border-red-200 text-red-600 rounded-lg px-4 py-2 text-[13px] font-medium hover:bg-red-50 transition-colors"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="bg-primary text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:bg-accent-warm transition-colors"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ComingSoonBadge component**

```tsx
// src/components/integrations/ComingSoonBadge.tsx
interface ComingSoonProps {
  name: string;
  description: string;
  icon: React.ReactNode;
}

export default function ComingSoonBadge({ name, description, icon }: ComingSoonProps) {
  return (
    <div className="bg-surface border border-warm-gray/20 rounded-xl shadow-card p-5 flex items-center gap-4 mb-2.5 opacity-60">
      <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-[22px] flex-shrink-0 bg-accent-surface">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-muted">{name}</div>
        <div className="text-[13px] text-muted mt-0.5">{description}</div>
      </div>
      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-purple-50 text-purple-600">
        Coming Soon
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Implement integrations page**

```tsx
// src/app/(app)/integrations/page.tsx
"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import ComingSoonBadge from "@/components/integrations/ComingSoonBadge";

interface Integration {
  service: string;
  connected: boolean;
  email?: string;
  connected_at?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.charuai.com";

export default function IntegrationsPage() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    authFetch("/api/integrations")
      .then((r) => r.ok ? r.json() : { integrations: [] })
      .then((d) => setIntegrations(d.integrations || []));
  }, []);

  const google = (service: string) =>
    integrations.find((i) => i.service === service);

  const handleConnect = async (service: string) => {
    const token = await user?.getIdToken();
    window.location.href = `${API_BASE}/api/integrations/${service}/connect?token=${token}`;
  };

  const handleDisconnect = async (service: string) => {
    if (!confirm(`Disconnect ${service}?`)) return;
    await authFetch(`/api/integrations/${service}/disconnect`, { method: "DELETE" });
    setIntegrations((prev) =>
      prev.map((i) => i.service === service ? { ...i, connected: false, email: undefined } : i)
    );
  };

  const cal = google("google_calendar");
  const gmail = google("gmail");

  return (
    <div className="max-w-[720px] mx-auto px-8 py-8">
      <h1 className="text-[22px] font-bold text-dark mb-1">Integrations</h1>
      <p className="text-sm text-muted mb-8">
        Connect your accounts so Charu can help you stay on top of everything.
      </p>

      <div className="bg-accent-surface/50 border border-warm-gray/20 rounded-xl p-4 mb-8 text-[13px] text-primary leading-relaxed">
        <strong className="font-semibold">How it works:</strong> When you connect an account,
        Charu can read your calendar events and emails to surface relevant tasks during your daily calls.
        You can disconnect at any time.
      </div>

      <div className="mb-10">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted mb-3">Your Accounts</div>

        <IntegrationCard
          name="Google Calendar"
          description="View upcoming events and surface scheduling conflicts"
          icon={<span>&#128197;</span>}
          connected={cal?.connected || false}
          email={cal?.email}
          onConnect={() => handleConnect("google_calendar")}
          onDisconnect={() => handleDisconnect("google_calendar")}
        />

        <IntegrationCard
          name="Gmail"
          description="Surface important emails and help draft replies during calls"
          icon={<span>&#9993;</span>}
          connected={gmail?.connected || false}
          email={gmail?.email}
          onConnect={() => handleConnect("gmail")}
          onDisconnect={() => handleDisconnect("gmail")}
        />

        <IntegrationCard
          name="WhatsApp"
          description="Daily recaps, midday check-ins, and on-demand messaging"
          icon={<span>&#128172;</span>}
          connected={true}
          statusText={`Active on ${user?.phoneNumber || ""}`}
          readOnly
        />
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted mb-3">Coming Soon</div>
        <ComingSoonBadge name="Microsoft Teams" description="Calendar sync and meeting awareness" icon={<span>&#128101;</span>} />
        <ComingSoonBadge name="Microsoft Outlook" description="Email integration for task surfacing" icon={<span>&#128231;</span>} />
        <ComingSoonBadge name="Slack" description="Check-ins and task updates in your workspace" icon={<span>&#128488;</span>} />
        <ComingSoonBadge name="Notion" description="Task sync and note integration" icon={<span>&#128221;</span>} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/integrations/ src/app/\(app\)/integrations/page.tsx
git commit -m "feat: implement integrations page with Google, WhatsApp, and coming soon"
```

---

## Task 9: Update next.config.ts for VPS deployment

**Files:**
- Modify: `src/next.config.ts`

- [ ] **Step 1: Remove static export if present, ensure standalone output**

Check `node_modules/next/dist/docs/01-app/03-api-reference/05-config/` for current config options before editing. Update `next.config.ts`:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

The `output: "standalone"` creates a self-contained build for VPS deployment with `node .next/standalone/server.js`.

- [ ] **Step 2: Build to verify**

```bash
npm run build
```

Expected: Build succeeds and creates `.next/standalone/` directory.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "config: set standalone output for VPS deployment"
```

---

## Task 10: Final build verification and push

- [ ] **Step 1: Clean build**

```bash
rm -rf .next
npm run build
```

Expected: Build succeeds with all routes:
- `/ ` (marketing)
- `/privacy` (marketing)
- `/terms` (marketing)
- `/login`
- `/dashboard` (auth guarded)
- `/integrations` (auth guarded)

- [ ] **Step 2: Verify dev server**

```bash
npm run dev
```

Visit:
- `http://localhost:3000` → marketing homepage with logo and blue brand
- `http://localhost:3000/login` → phone auth login page
- `http://localhost:3000/dashboard` → redirects to /login (not authenticated)
- `http://localhost:3000/integrations` → redirects to /login (not authenticated)

- [ ] **Step 3: Push**

```bash
git push
```
