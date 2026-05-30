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

- **`.env.local`** — do not read or write this file. If env vars need to change, tell me what to add/remove and I'll edit it myself.
- **`server/db/drizzle/*.sql` migration files after they're committed** — generate new migrations instead of editing old ones.
- **`package-lock.json`** — let `npm install` manage it.

## Things to ask before doing

- Schema migrations against the live Neon DB (`db:push` on `main` branch).
- Deleting or truncating user/auth tables.
- Rotating any secret in `.env.local`.
- `git push`, force-push, branch deletion.
- Installing new top-level dependencies.

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
git pull                                      # ensure staging is current
git merge crt-XX-short-description           # bring feature onto staging
git push                                      # triggers Vercel staging deploy
# test the feature on the staging Vercel URL
# once verified, check the staging AC box in the PR and merge PR → main
```

**After merging to main — reset staging:**
```bash
git checkout staging
git reset --hard main
git push --force                              # staging is now a clean mirror of main
```

**PR acceptance criteria must include:**
- [ ] Tested and verified on the staging Vercel deployment (not just localhost)

## Commit style

- Do NOT add `Co-Authored-By` trailers to commit messages.

## Scratchpad

`scratchpad.md` lives at the repo root and is gitignored. It's a personal space for jotting down topics to study or write about (blog ideas, tech rabbit holes, things noticed during a session that aren't directly tied to the task). When the user says "note that in the scratchpad," append a new entry to that file.

## Documentation

Notion is the documentation hub for this project (Cicero teamspace). Pages cover architecture, the Courtside and Combine stacks, the shared DB schema, the development workflow, roadmap, and team conventions.

**When to suggest a Notion update:** If a session results in a change that affects how the system works at a meaningful level, flag it at the end of the session with a one-line suggestion to update the relevant page. This includes:
- A new dependency added to the stack
- A DB table added, renamed, or significantly changed
- An auth or middleware behavior change
- A new API route or server action pattern introduced
- A change to the PR Score formula or pipeline (coordinate with Bryan / Combine)
- A shift in architecture (e.g. splitting the DB, changing the ORM, new external service)

Do NOT suggest updates for bug fixes, UI tweaks, refactors within existing patterns, or anything already captured in git history and Linear.

The relevant Notion pages to point to:
- **Architecture** — shared DB, data flow, external APIs, PR Score formula
- **Courtside** — stack, auth model, routes, schema, env vars
- **Development Workflow** — Linear process, branching, PR rules, bug triage

## Available MCPs

MCP servers connected to this Claude Code session:

- **Notion** (`mcp__notion__*`) — Read and write the Cicero Notion workspace. Use for updating documentation pages when flagged above.
- **Linear** (`mcp__linear-server__*`) — Read and write Linear issues, projects, milestones, and comments in the Cicero workspace (teams: Courtside `CRT`, Combine `CMB`).
- **Neon** (`mcp__neon__*` and `mcp__Neon__*`) — Interact with the Neon PostgreSQL database directly. Use for inspecting schema, running queries, and managing branches. Ask before running any destructive queries.
- **GitHub** (`mcp__github__*`) — Read and write GitHub repos, PRs, issues, and branches. Ask before pushing or merging.
- **Vercel** (`mcp__vercel__*`) — Inspect deployments, logs, and project config for the Courtside Vercel project.
- **Google Calendar** (`mcp__claude_ai_Google_Calendar__*`) — Read and write calendar events.
- **Gmail** (`mcp__claude_ai_Gmail__*`) — Read and send Gmail.
- **Google Drive** (`mcp__claude_ai_Google_Drive__*`) — Read files from Google Drive.

## Useful context

- The user is a solo dev working through Linear tickets in the "Courtside" team (project key `CRT`).
- Branding shifted from "Cicero" → "Prospect Portfolio" in user-facing copy; the repo/codebase still uses "cicero".
- Demo login flow was removed during the Better Auth migration. Do not re-introduce it.
- Combine (Python pipeline, `bddiaz/cicero-scripts`) is owned by Bryan Diaz and shares the same Neon DB. Courtside reads Combine-owned tables (`players`, `player_stats`, `player_averages`, `teams`) but does not write them.
