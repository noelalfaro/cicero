# Cicero / Prospect Portfolio

Web app where users invest in NBA players' "potential" — a score derived from in-game stats plus sentiment from online reputation.

## Stack

- **Framework**: Next.js 15 (App Router, Turbopack, React 19)
- **Auth**: Better Auth v1.6 (Google OAuth only) — `lib/auth.ts`, `lib/auth-client.ts`
- **DB**: Postgres on Neon, accessed via Drizzle ORM (`server/db/`)
- **Styling**: Tailwind v4 + shadcn/ui (Radix primitives in `components/ui/`)
- **Forms**: react-hook-form + zod
- **Uploads**: UploadThing
- **Data fetching**: TanStack Query

## Commands

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run generate` — `drizzle-kit generate` (create migration from schema diff)
- `npm run db:push` — `drizzle-kit push` (apply schema directly, dev only)
- `npm run studio` — Drizzle Studio
- `npx tsc --noEmit` — typecheck
- `npm run lint` — ESLint

## Auth model

- All routes under `app/(main)/` require an authed + onboarded session. Layout-level gate in `app/(main)/layout.tsx` redirects to `/login` or `/onboarding`.
- `app/onboarding/layout.tsx` redirects already-onboarded users back to `/dashboard`.
- `middleware.ts` handles cookie-based redirect for unauthed access; public paths are listed in a `PUBLIC_PATHS` set.
- New users sign in with Google → Better Auth creates `users` row with `onboarding_status=false` → `/onboarding` form → `POST /api/users/complete-onboarding` flips the flag.

## DB conventions

- Schemas live in `server/db/schema/`; the auth tables (`accounts`, `sessions`, `verifications`) are in `auth.ts`, app tables in their own files.
- `users.id` is `text` (Better Auth uses string IDs, not uuid).
- Use snake_case column names. JS field names mostly mirror them (mix of snake_case and a few camelCase for Better Auth-required fields like `emailVerified`, `createdAt`, `updatedAt`).
- All DB access goes through `db` from `@/server/db`.

## Code conventions

- Server Components by default. Add `'use client'` only when needed (state, effects, browser APIs).
- Path alias: `@/*` → repo root.
- Server-only modules: `import 'server-only'` at top (see `lib/data/users.ts`).
- Server actions go in `app/.../actions/` and are marked `'use server'`.
- Component file naming: `kebab-case.tsx`. Exports: prefer named exports for components.
- Don't write comments unless the WHY is non-obvious. Don't reference past tasks/PRs in comments.

## Don't touch

- **`.env.local`** — do not read or write this file. If env vars need to change, tell me what to add/remove and I'll edit it myself.
- **`server/db/drizzle/*.sql` migration files after they're committed** — generate new migrations instead of editing old ones.
- **`package-lock.json`** — let `npm install` manage it.

## Things to ask before doing

- Schema migrations against the live Neon DB (`db:push` on `main` branch).
- Deleting or truncating user/auth tables.
- Rotating any secret in `.env.local`.
- `git push`, force-push, branch deletion.
- Installing new top-level dependencies.

## Commit style

- Do NOT add `Co-Authored-By` trailers to commit messages.

## Useful context

- The user is a solo dev working through Linear tickets in the "Courtside" team (project key `CRT`).
- Branding shifted from "Cicero" → "Prospect Portfolio" in user-facing copy; the repo/codebase still uses "cicero".
- Demo login flow was removed during the Better Auth migration. Do not re-introduce it.
