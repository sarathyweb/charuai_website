# Design Spec: Charu AI Customer Dashboard

**Date:** 2026-04-07
**Status:** Approved

## Overview

A customer-facing web dashboard at charuai.com that lets users view their progress, tasks, call schedule, profile, and manage integrations. Built as an addition to the existing Next.js 16 website. No chat integration — the agent (via calls and WhatsApp) remains the primary interface. The dashboard is the mirror.

### Key Constraints

- **Auth:** Firebase Phone Auth (OTP only, no email/social)
- **API:** All data fetched from api.charuai.com with Firebase JWT
- **Deployment:** VPS with `next start` (moving from Cloudflare static)
- **Framework:** Next.js 16 App Router (existing website codebase)
- **Styling:** Tailwind CSS 4 (already in use)
- **Brand colors:** Deep indigo `#2C2D72`, medium blue `#4368B1`, accent `#507ABD`, `#4B73B9` (from logo)

## Pages

### 1. Login (`/login`)

Firebase Phone Auth with invisible reCAPTCHA. Two-step flow on the same route.

**Step 1 — Phone Input:**
- Logo centered at top
- Country code selector with full international support (use `react-phone-number-input` library)
- Phone number input (16px font minimum)
- "Send verification code" button
- Terms/Privacy links

**Step 2 — OTP Verification:**
- "Change number" back link
- 6-digit individual OTP input boxes (48x56px each, large touch targets)
- Shows which number the code was sent to
- Resend code link with cooldown timer
- Verify button (disabled until all 6 digits entered)
- Code expiry notice (5 minutes)

**Auth Flow:**
1. User enters phone → Firebase `signInWithPhoneNumber()` with invisible `RecaptchaVerifier`
2. User enters OTP → `confirmationResult.confirm(code)`
3. On success → `POST /api/auth/sync` with JWT to sync user to backend PostgreSQL
4. Redirect to `/dashboard`

**Auth State:**
- `AuthProvider` context wrapping the app with `onAuthStateChanged` listener
- `useAuth()` hook exposes: `user`, `loading`, `sendOtp`, `verifyOtp`, `getIdToken`, `logout`
- `authFetch()` wrapper auto-attaches JWT to `/api/*` requests
- Client-side route guard: if not authenticated, redirect to `/login`

### 2. Dashboard (`/dashboard`)

Single scrollable page with 4 sections. Sticky section nav for quick jumping. All data is **read-only** — the agent is the interface for making changes.

**Top Navigation:**
- Charu logo (original SVG from `public/logo.svg`)
- Two nav links: Dashboard (active), Integrations
- Phone number display + avatar initial

**Section Navigation (sticky below top nav):**
- Anchor links: Progress | Tasks | Schedule | Profile

#### Section: Progress

**Stat Cards (4-column grid, collapses to 2x2 on mobile):**
- Current Streak (days)
- Best Streak (days)
- This Week (calls completed, e.g. "5/7" with trend vs last week)
- Goals Completed (% with trend vs last week)

**Activity Heatmap (GitHub-style):**
- 12 weeks of daily cells
- Blue scale matching brand: neutral `#e5e7eb` (gray) for missed/no-data, `#b8d4f0` → `#7badd6` → `#4B73B9` → `#2C2D72` for increasing engagement
- Missed days are neutral gray — never red (ADHD-friendly, no shame mechanics)
- Legend: Less → More
- Day labels: M, W, F, S on left axis

**Weekly Summary Card:**
- AI-generated text summary (from existing weekly summary data)
- Calls completed, goals set, goals completed, focus areas

**API:** `GET /api/progress` → `{ streak: { current, best }, week: { calls_completed, calls_total, prev_calls_completed }, goals: { completion_pct, prev_completion_pct }, heatmap: [{ date, level }], weekly_summary: string }`

#### Section: Tasks

**Read-only task list** — users can view but not add/edit/complete tasks. The agent manages tasks.

- Tab bar: Pending (count) | Completed
- Each task shows:
  - Priority dot (red = high, yellow = medium, gray = low)
  - Title
  - Meta: "Added X ago" + Priority level
- Sorted by priority DESC, then recency DESC (matching backend query)

**API:** `GET /api/tasks?status=pending` and `GET /api/tasks?status=completed` → `{ tasks: [{ id, title, priority, status, source, created_at, completed_at }] }`

#### Section: Call Schedule

**View-only display** of morning and evening call windows.

- Two cards side by side (stack on mobile):
  - Morning Call: time range, timezone, Active/Inactive badge
  - Evening Reflection: time range, timezone, Active/Inactive badge
- Each card shows hint text: "To change, tell Charu during your next call or on WhatsApp"

**API:** `GET /api/call-windows` → `{ windows: [{ type, start_time, end_time, timezone, is_active }] }`

#### Section: Profile

- Avatar (initial from name, gradient background)
- Name
- Phone number
- Member since date
- Sign Out button

**API:** Uses data from `GET /api/dashboard` combined response or `GET /api/user/profile` → `{ name, phone, created_at }`

### 3. Integrations (`/integrations`)

Separate page for managing third-party service connections.

**Info Banner:**
- Explains what connecting does: "Charu can read your calendar events and emails to surface relevant tasks during your daily calls."

**Active Integrations:**

| Service | Actions | OAuth Flow |
|---|---|---|
| Google Calendar | Connect / Disconnect | Google OAuth via api.charuai.com |
| Gmail | Connect / Disconnect | Google OAuth via api.charuai.com |
| WhatsApp | Status display only | Auto-connected via phone number, shows active status + number |

- Connected state: green "Connected" badge + email + Disconnect button
- Not connected state: "Not connected" text + Connect button
- Connect triggers OAuth flow: redirect to `api.charuai.com/api/oauth/google/authorize` → Google consent → callback → redirect back

**Coming Soon (muted, non-interactive):**
- Microsoft Teams
- Microsoft Outlook
- Slack
- Notion
- Each shows "Coming Soon" purple badge, reduced opacity

**API:**
- `GET /api/integrations` → `{ integrations: [{ service, connected, email?, connected_at? }] }`
- `POST /api/integrations/google/connect` → redirects to OAuth
- `DELETE /api/integrations/google/disconnect`

## Architecture

### File Structure (new additions)

```
website/src/
├── app/
│   ├── layout.tsx              ← update: conditional nav (marketing vs dashboard)
│   ├── page.tsx                ← unchanged (homepage)
│   ├── login/page.tsx          ← NEW: Firebase Phone Auth
│   ├── dashboard/
│   │   ├── layout.tsx          ← NEW: dashboard shell (auth guard, nav)
│   │   └── page.tsx            ← NEW: progress + tasks + schedule + profile
│   └── integrations/
│       └── page.tsx            ← NEW: integration management
├── components/
│   ├── dashboard/
│   │   ├── DashboardNav.tsx    ← top nav with logo, page links, user info
│   │   ├── SectionNav.tsx      ← sticky anchor links for dashboard sections
│   │   ├── ProgressStats.tsx   ← 4 stat cards
│   │   ├── Heatmap.tsx         ← GitHub-style activity heatmap
│   │   ├── WeeklySummary.tsx   ← AI-generated weekly text
│   │   ├── TaskList.tsx        ← read-only task list with tabs
│   │   ├── CallSchedule.tsx    ← view-only morning/evening cards
│   │   └── ProfileCard.tsx     ← name, phone, sign out
│   └── integrations/
│       ├── IntegrationCard.tsx ← connected/disconnected states
│       └── ComingSoonBadge.tsx ← muted badge
├── lib/
│   ├── firebase.ts             ← NEW: Firebase app init (getApps guard for hot reload)
│   ├── auth.tsx                ← NEW: AuthProvider, useAuth hook, onAuthStateChanged
│   └── api.ts                  ← NEW: authFetch wrapper (attaches JWT to /api/* requests)
```

### Data Fetching

All dashboard data is fetched **client-side** using `authFetch()` since Firebase auth state is only available in the browser. Pattern:

```
"use client" component → useAuth() for JWT → authFetch("https://api.charuai.com/api/...") → render
```

### Route Protection

Client-side redirect in dashboard layout:
- If `!loading && !user` → redirect to `/login`
- If `!loading && user` on `/login` → redirect to `/dashboard`

### Layout Strategy

- `/` (homepage), `/privacy`, `/terms` → marketing layout (Navbar + Footer)
- `/login` → minimal layout (no nav, just logo)
- `/dashboard`, `/integrations` → dashboard layout (DashboardNav, auth guard)

## UI/UX Design Principles

Based on ADHD user research and codemigo UI/UX best practices:

1. **No shame mechanics** — missed days are neutral gray, never red. No guilt language.
2. **Single screen** — dashboard is one scrollable page. ADHD users abandon multi-page dashboards.
3. **Celebrate consistency** — streak counter is the hero metric. Trends show improvement, not absolute perfection.
4. **Read-only by design** — tasks and schedule are view-only. Agent is the interface, dashboard is the mirror.
5. **Function over flair** — clean, calm blue palette. Minimal color. Content and data stand out.
6. **4 type sizes max** — 32px stats, 18px section titles, 14px body, 11-13px meta.
7. **44px touch targets** — all interactive elements meet mobile minimum.
8. **16px+ input text** — phone and OTP inputs are 16px+ to prevent iOS zoom.
9. **One interactive color** — deep indigo `#2C2D72` for all active/interactive states.
10. **Neutral structural colors** — backgrounds, borders, dividers are low-saturation.

## Dependencies (new packages)

| Package | Purpose |
|---|---|
| `firebase` | Client-side Firebase SDK (Phone Auth, getIdToken) |
| `react-phone-number-input` | International phone input with country flags |

## API Endpoints Required (Backend)

These endpoints need to exist on api.charuai.com:

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/sync` | POST | JWT | Sync Firebase user to PostgreSQL (ensure_from_firebase) |
| `/api/dashboard` | GET | JWT | Combined progress + profile data |
| `/api/progress` | GET | JWT | Streak, weekly stats, heatmap, weekly summary |
| `/api/tasks` | GET | JWT | Task list (query param: status=pending/completed) |
| `/api/call-windows` | GET | JWT | User's call windows |
| `/api/user/profile` | GET | JWT | Name, phone, created_at |
| `/api/integrations` | GET | JWT | List of integration statuses |
| `/api/integrations/google/connect` | POST | JWT | Initiate Google OAuth flow |
| `/api/integrations/google/disconnect` | DELETE | JWT | Revoke Google OAuth |

## Error & Loading States

| State | UI Treatment |
|---|---|
| Loading (initial) | Skeleton placeholders matching card shapes |
| Empty tasks | "No tasks yet. Charu will track tasks from your daily calls." |
| No progress data | Show zeroed stats with encouraging message |
| API error | Toast notification: "Something went wrong. Please try again." |
| Auth expired (401) | Auto-redirect to /login |
| OTP send failure | Inline error below phone input, allow retry |
| OTP verify failure | "Invalid code. Please try again." with cleared inputs |
| Disconnect integration | Confirmation dialog before disconnecting |

## Out of Scope (MVP)

- Chat/messaging integration in dashboard
- Editing tasks from dashboard
- Editing call schedule from dashboard
- Dark mode
- Email/social auth providers
- Mobile native app
- Notification preferences
- Billing/subscription management
- Custom date range for progress
- Export data
