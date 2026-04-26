# Charu AI Website

Next.js app for Charu's marketing site, authenticated dashboard, integrations,
login flow, and web chat surface.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

Useful commands:

```bash
npm run test
npm run lint
npm run build
```

## App Surfaces

- `/` marketing homepage
- `/login` Firebase phone OTP login
- `/dashboard` authenticated progress, tasks, goals, call history, and settings
- `/chat` authenticated web chat backed by `/api/chat/stream`
- `/integrations` authenticated Google/WhatsApp integration management

Set `NEXT_PUBLIC_API_BASE_URL` to the backend base URL for authenticated API
calls. Firebase web config values are read from `NEXT_PUBLIC_FIREBASE_*`
environment variables.
