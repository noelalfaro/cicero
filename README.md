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
| Auth | Better Auth v1.6 (Google OAuth) |
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
- A Google OAuth app (Client ID + Secret)
- A [Neon](https://neon.tech) database
- A [Better Auth](https://better-auth.com) secret
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
# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Database
DRIZZLE_DATABASE_URL=

# Uploadthing
UPLOADTHING_TOKEN=
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
  (public)/       # Public routes (login, landing)
  onboarding/     # Onboarding flow (runs after first login)
  api/            # API routes (auth, users, uploadthing)
components/       # Shared UI components
lib/              # Auth config, data fetching, type definitions
server/
  db/             # Drizzle schema + client
middleware.ts     # Auth + onboarding redirect logic
```

---

## Auth Flow

1. User clicks "Sign in with Google" → Better Auth initiates OAuth flow
2. Google redirects back → Better Auth creates `users` row with `onboarding_status=false`
3. Middleware checks session + onboarding status:
   - No session → redirect to `/login`
   - Session but not onboarded → redirect to `/onboarding`
   - Onboarded → allow access to protected routes
4. Onboarding form POSTs to `/api/users/complete-onboarding` → flips `onboarding_status=true`

## Environments

| Environment | Branch | URL | Neon DB |
|---|---|---|---|
| Local | — | `http://localhost:3000` | `main` branch |
| Staging | `staging` | `cicero-git-staging-noel-alfaros-projects.vercel.app` | `staging` branch |
| Production | `main` | `cicero-coral.vercel.app` | `main` branch |

`BETTER_AUTH_URL` and `DRIZZLE_DATABASE_URL` differ per environment. All other env vars are shared.

## Branching and staging workflow

**Branches:**
- `main` — production, always stable
- `staging` — permanent beta environment for live testing, never merges into main
- `crt-XX-short-description` — feature branches, always off latest `main`

**Starting a ticket:**
```bash
git checkout main && git pull
git checkout -b crt-XX-short-description
```

**Before merging a PR — test on staging:**
```bash
git checkout staging && git pull
git merge crt-XX-short-description
git push                          # triggers Vercel staging deploy
# verify on staging URL, check the AC box, then merge PR → main
```

**After merging to main — reset staging:**
```bash
git checkout staging
git fetch origin
git reset --hard origin/main
git push --force                  # staging mirrors main again
```

---

## Related

- **Combine** (Python backend): `cicero-scripts` repo — owned by Bryan
- **Linear**: [Courtside project](https://linear.app/ciceroapp) — P1 (User Platform) active through mid-May 2026
- **Vercel**: Deployed on Vercel, preview deploys on every PR
