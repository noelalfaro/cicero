# Cicero — Prospect Portfolio

A pseudo NBA investment platform where users invest in players rated by a **PR Score** — a composite of in-game stats and social media sentiment analysis.

This repo is **Courtside**, the Next.js frontend. The Python backend (Combine) lives in [cicero-scripts](../nba-python/cicero/cicero-scripts).

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Radix UI, shadcn/ui |
| Auth | Kinde Auth (+ Management API) |
| Database | Neon (PostgreSQL) via Drizzle ORM |
| File Uploads | Uploadthing |
| Data Fetching | TanStack Query v5 |
| Animations | Motion (Framer Motion) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

## Prerequisites

- Node.js >= 20
- A [Kinde](https://kinde.com) account and application
- A [Neon](https://neon.tech) database
- An [Uploadthing](https://uploadthing.com) account

---

## Local Setup

**1. Clone and install**

```bash
git clone <repo-url>
cd cicero
npm install
```

**2. Set up environment variables**

Copy the example below into `.env.local` and fill in your values:

```bash
NODE_ENV=development

# Kinde Auth
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/api/auth/success
KINDE_DOMAIN=
KINDE_AUTH_LOGIN_ROUTE=/api/auth

# Kinde Management API (for onboarding sync)
KINDE_MANAGEMENT_CLIENT_ID=
KINDE_MANAGEMENT_CLIENT_SECRET=

# Kinde Social Connection IDs
GOOGLE_CONNECTION_ID=
GITHUB_CONNECTION_ID=

# Database
DRIZZLE_DATABASE_URL=

# Uploadthing
UPLOADTHING_TOKEN=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Demo user (optional)
NEXT_PUBLIC_DEMO_USERNAME=
DEMO_USERNAME=
KINDE_DEMO_EMAIL=
DEMO_LOGIN_PASSWORD=

# Hosting
VERCEL_URL=http://localhost:3000
```

**3. Push the database schema**

```bash
npm run db:push
```

**4. Start the dev server**

```bash
npm run dev
```

App runs at `http://localhost:3000`.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run generate` | Generate Drizzle migration files |
| `npm run db:push` | Push schema changes directly to DB |
| `npm run studio` | Open Drizzle Studio (DB browser) |
| `npm run seed` | Seed the database |

---

## Project Structure

```
app/
  (main)/         # Authenticated routes (dashboard, players, users)
  onboarding/     # Onboarding flow (runs after first login)
  api/            # API routes (auth, users, uploadthing)
components/       # Shared UI components
lib/              # Data fetching, utilities, type definitions
server/
  db/             # Drizzle schema + client
  kinde/          # Kinde Management API utilities
middleware.ts     # Auth + onboarding redirect logic
```

---

## Auth Flow

1. User registers/logs in via Kinde
2. Kinde redirects to `/api/auth/success` → user is synced to local DB
3. Middleware checks `onboarding_completed` claim:
   - Not completed → redirect to `/onboarding`
   - Completed → allow access to protected routes
4. Onboarding completion updates both the local DB and the Kinde user profile

---

## Related

- **Combine** (Python backend): `cicero-scripts` repo — owned by Bryan
- **Linear**: [Courtside project](https://linear.app/ciceroapp) — P1 (User Platform) active through mid-May 2026
- **Vercel**: Deployed on Vercel, preview deploys on every PR
