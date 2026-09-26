# Cicero / Prospect Portfolio — Agent Constitution

Web app where users invest in NBA players' "potential" — a score derived from in-game stats plus sentiment from online reputation.

This repo is **Courtside** (Next.js product UI). **Combine** (`bddiaz/cicero-scripts`) is the data aggregator / PR Score pipeline. Courtside reads Combine-owned tables; it does not write them.

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
- Combine-owned tables (`players`, `teams`, `player_stats`, `player_averages`, `cicero_scores`) live in `server/db/schema/combine.ts` and are excluded from `drizzle.config.ts` — do not generate Courtside migrations for them.
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
- Always use semantic Tailwind classes for color (`bg-background`, `text-foreground`, `border-border`, etc.). Never hardcode `bg-white`, `text-black`, or other non-semantic colors — the app supports dark mode via next-themes.

## Data fetching

- **Default:** fetch in the Server Component, pass data down as props. Fast, no client JS, no loading state needed.
- **Use TanStack Query** when the data needs to stay fresh, be refetched on user interaction, or is driven by client-side state (e.g. search results, live feeds, user-triggered refreshes).
- When in doubt, start with a server fetch — it's easier to move to the client than the other way around.

## Error handling

- **Server actions:** return `{ data, error }` objects for validation and expected failures. The client renders the error message. Never throw for user-facing validation errors.
- **Unexpected failures** (DB down, network error, unhandled exception): let them throw and bubble up to the nearest `error.tsx` boundary.
- Never swallow errors silently. If you catch something, either return it or rethrow it.

## Loading and empty states

- Always implement both when building a component that fetches async data.
- **Loading:** use Suspense boundaries with skeleton components. Never show a blank screen.
- **Empty state:** show a meaningful message or CTA — not just nothing. E.g. "No players found" with a suggestion, not an empty list.

## Types

- DB types should be derived from the Drizzle schema via `drizzle-zod`, not hand-written. Migration from `lib/definitions.ts` to drizzle-zod is tracked under CRT-77 and should be done before adding new DB-coupled types.
- Once migrated: use `createSelectSchema` / `createInsertSchema` from `drizzle-zod`, derive TypeScript types with `z.infer<>`, and extend at API/form boundaries for custom validation rules.

## Testing

- No tests currently. When implementing logic that has clear inputs/outputs and is worth protecting (utility functions, validation rules, score calculations), flag it as a candidate for a Vitest unit test. Don't write component tests.

## Out-of-scope findings

- If something worth improving is spotted outside the current ticket's scope, flag it and suggest a Linear issue. Do not fix it inline. Out-of-scope changes make PRs harder to review and can introduce unintended side effects.

## Feature approach

- Ask at the start of each new feature ticket: "Do you want to start from the DB schema, or sketch the UI shape first?" Default recommendation is schema-first (data model drives the UI), but defer to preference.

## Don't touch

- **`.env.local`** — do not read or write this file. If env vars need to change, tell the user what to add/remove; they edit it themselves.
- **`server/db/drizzle/*.sql` migration files after they're committed** — generate new migrations instead of editing old ones.
- **`package-lock.json`** — let `npm install` manage it.

## Things to ask before doing

- Schema migrations against the live Neon DB (`db:push` on `main` branch).
- Deleting or truncating user/auth tables.
- Rotating any secret in `.env.local`.
- `git push`, force-push, branch deletion.
- Installing new top-level dependencies.

## Environments

| Environment | Branch | Vercel URL | Neon DB branch |
|---|---|---|---|
| Local | — | `http://localhost:3000` | `main` (production DB) |
| Staging | `staging` | `cicero-git-staging-noel-alfaros-projects.vercel.app` | `staging` (Neon branch) |
| Production | `main` | `cicero-coral.vercel.app` | `main` |

**Vercel env vars per environment:**
- `BETTER_AUTH_URL` — must match the environment's URL (different per env)
- `DRIZZLE_DATABASE_URL` — staging uses the Neon `staging` branch connection string, production uses `main`
- All other vars (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_SECRET`, `UPLOADTHING_TOKEN`) — same value across all environments

**Google OAuth:** Both production and staging callback URLs must be registered as authorized redirect URIs. Adding a new environment requires registering its callback URL in the Google Console and adding it to `trustedOrigins` in `lib/auth.ts`.

## Branching and staging workflow

**Branches:**
- `main` — production. Always stable. PRs merge here after staging validation.
- `staging` — permanent beta/testing environment. Never deleted. Mirrors main between releases. **Never merges into main** — it is a testing target only, not a development base.
- `crt-XX-short-description` — feature branches. Always branched off the latest `main`.

**Starting a new ticket:**
```bash
git checkout main && git pull
git checkout -b crt-XX-short-description
```

**Before merging a PR to main — test on staging:**
```bash
git checkout staging
git pull
git merge crt-XX-short-description
git push
# test on the staging Vercel URL
# once verified, check the staging AC box in the PR and merge PR → main
```

**After merging to main — reset staging:**
```bash
git checkout staging
git fetch origin
git reset --hard origin/main
git push --force
```

**PR acceptance criteria must include:**
- [ ] Tested and verified on the staging Vercel deployment (not just localhost)

## Commit style

- Do NOT add `Co-Authored-By` trailers to commit messages.

## Scratchpad

`scratchpad.md` lives at the repo root and is gitignored. Personal notes only. When the user says "note that in the scratchpad," append a new entry to that file.

## Documentation

Notion is the documentation hub (Cicero teamspace). When a session changes how the system works at a meaningful level, flag a one-line Notion update at the end. Do not suggest updates for bug fixes, UI tweaks, or refactors within existing patterns.

Relevant pages:
- **Architecture** — shared DB, data flow, external APIs, PR Score formula
- **Courtside** — stack, auth model, routes, schema, env vars
- **Development Workflow** — Linear process, branching, PR rules, bug triage

## External tools

When available in the session, prefer connected Notion, Linear, Neon, GitHub, and Vercel tools for docs, tickets, DB inspection, PRs, and deployments. Ask before destructive database queries, pushes, or merges.

## Useful context

- Solo Courtside ownership (Linear team `CRT`). Combine is owned by Bryan Diaz (Linear team `CMB`).
- Branding: user-facing "Prospect Portfolio"; repo/codebase still uses "cicero".
- Demo login was removed during the Better Auth migration. Do not re-introduce it.
- Combine owns and writes: `players`, `teams`, `player_stats`, `player_averages`, `cicero_scores`. Courtside owns: `users`, auth tables, `follows`, `transactions` (and future product tables).
