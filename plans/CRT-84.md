# Plan CRT-84: Align Courtside's schemas with what Combine actually writes

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat c70fb52..HEAD -- lib/definitions.ts lib/data/players.ts server/db/schema/ components/player/ server/db/seedTeams.ts server/db/seedPlayers.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1 (Linear calls this the blocker for CRT-83/85/86/87/88/89)
- **Effort**: M
- **Risk**: MED (changes the player data contract used by the player page and explore page)
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `c70fb52`, 2026-06-10
- **Linear**: https://linear.app/ciceroapp/issue/CRT-84

## Why this matters

Combine (a Python pipeline owned by Bryan Diaz) and Courtside (this Next.js repo) share one Neon Postgres DB with no enforced contract. The live DB was inspected on 2026-06-10 and **the Drizzle table definitions match the live DB almost exactly — the real mismatches are in the hand-written Zod schemas in `lib/definitions.ts`**, which declare several nullable DB columns as required. Result: `playerSchema.parse()` throws for at least 10 real players (e.g. id `1630828` Alex Antetokounmpo, `1642905` Yang Hansen — NULL `LAST_AFFILIATION` or `SCHOOL`), `fetchPlayerDataByID` swallows the error and returns `null`, and the player page renders "Player not found" for players that exist. This plan replaces the hand-written Zod schemas with schemas derived from the Drizzle definitions via `drizzle-zod` (already installed, v0.8.3), which makes nullability impossible to get wrong again. CLAUDE.md's "Types" section already mandates this migration.

## Current state

### Facts verified against the live Neon DB (project `twilight-river-76263451`, branch `main`, 2026-06-10)

- Tables present: `players` (662 rows), `player_stats` (14,767 rows, 548 distinct players), `player_averages` (539 rows), `teams`, `cicero_scores` (**0 rows — Combine has not written any scores yet**), `transactions` (0 rows), plus auth/social tables.
- Column names and types in the live DB match `server/db/schema/*.ts` exactly for all six tables above. No extra columns exist in the DB that Drizzle doesn't define.
- Two type-level gaps in Drizzle vs DB:
  - `player_stats.is_mock` is `NOT NULL DEFAULT false` in the DB, but `server/db/schema/player_stats.ts:50` has `boolean('is_mock').default(false)` **without** `.notNull()` (TS type is `boolean | null` when it can never be null).
  - `cicero_scores` maps `player_id` to DB column `'id'` (`server/db/schema/cicero_scores.ts`) — confusing but **correct**; the live column is named `id`. Do not rename it.
- Nullable columns in the live `players` table: `SCHOOL`, `LAST_AFFILIATION`, `FROM_YEAR`, `TO_YEAR`, `DLEAGUE_FLAG`, `NBA_FLAG`, `GAMES_PLAYED_FLAG`, `DRAFT_YEAR`, `DRAFT_ROUND`, `DRAFT_NUMBER`, `IS_ACTIVE`, `LAST_UPDATED`, `IS_RETIRED`. The Drizzle schema agrees.
- 10 players (6 Active) currently have NULLs in `SCHOOL` or `LAST_AFFILIATION`: ids 1630828, 1642280, 1642530, 1642855, 1642866, 1642869, 1642885, 1642905, 1642911, 1642385.

### The buggy Zod schemas — `lib/definitions.ts`

`playerSchema` (lines ~67–105) declares these as required `z.string()` even though the DB allows NULL: `school`, `last_affiliation`, `draft_year`, `is_active`, `nba_flag`, `dleague_flag`, `games_played_flag`. It also has a field `last_update` that doesn't exist on `players` (the Drizzle field is `last_updated`) and is missing `is_retired`.

`playerAveragesSchema` (lines ~56–63) declares `ppg`/`apg`/`rpg` as `.optional()` — but the DB columns are nullable, and Drizzle returns `null`, not `undefined`. `z.number().optional()` **rejects null**, so any future NULL average breaks parsing (latent bug, 0 NULL rows today).

`teamSchema` (lines ~124–133) declares a `nickname` field that does not exist in the live `teams` table, and omits `code`. Only consumer is `server/db/seedTeams.ts` (a manual seed script).

### Where the parse failure is swallowed — `lib/data/players.ts:87-98`

```ts
try {
    return playerSchema.parse({
      ...player,
      averages: averagesResult[0],
      stats: statsResult || [],
      cicero_score: ciceroScoreResult[0]?.cicero_score ?? null,
      picture: pictureUrl,
    });
  } catch (error) {
    console.error('Failed to parse player data:', error);
    return null; // More graceful error handling
  }
```

Returning `null` here makes the page render "Player not found" (`app/(main)/players/[id]/page.tsx:30-32`) — indistinguishable from a genuinely missing player.

### Consumers that must keep compiling (type names must not change)

`Player`, `PlayerStats`, `PlayerAverages`, `Team`, and the schema exports are imported by: `lib/data/players.ts`, `components/player/player-stats-chart.tsx`, `components/player/player-detail-static.tsx`, `components/player/player-action-bar.tsx`, `components/explore/players.tsx`, `server/db/seedPlayers.ts`, `server/db/seedTeams.ts`. None of them render the newly-nullable fields (`school`, `draft_year`, etc.) today — verified by reading them — so loosening nullability should only require type-level fixes if `tsc` flags any.

### Repo conventions that apply

- Stack: Next.js 15 App Router, React 19, Drizzle ORM, Zod v3. Path alias `@/*` → repo root.
- DB types derived via `drizzle-zod` (`createSelectSchema`), per CLAUDE.md "Types" section.
- Never edit committed migration files in `server/db/drizzle/`. Never run `npm run db:push` without the operator's explicit approval (local dev points at the **production** Neon DB).
- Don't read or write `.env.local`.
- No code comments unless the WHY is non-obvious.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 (verified passing at `c70fb52`) |
| Lint | `npm run lint` | exit 0 |
| Dev server | `npm run dev` | serves http://localhost:3000 (hits the production Neon DB — read-only browsing is fine) |
| Unit tests | `npx vitest run` | all pass (vitest 3.1.4 is already installed; no config exists yet — step 5 creates it) |

## Scope

**In scope** (the only files you should modify/create):
- `lib/definitions.ts` — rewrite the Player/Stats/Averages/Team schema section with drizzle-zod
- `server/db/schema/player_stats.ts` — add `.notNull()` to `is_mock`
- `lib/data/players.ts` — stop swallowing parse errors in `fetchPlayerDataByID`
- `server/db/seedTeams.ts` — only if `tsc` breaks on the `Team` type change
- `vitest.config.ts` (create), `package.json` (add `"test": "vitest run"` script only)
- `lib/definitions.test.ts` (create)
- `plans/CRT-84-report.md` (create — the "columns Combine writes that Courtside doesn't use" / coordination notes deliverable)
- `plans/README.md` (status row)

**Out of scope** (do NOT touch):
- `server/db/drizzle/*.sql` — do not generate or edit migrations in this plan. The only Drizzle change (`is_mock` `.notNull()`) already matches the live DB, so no migration is needed. Running `npm run generate` risks emitting a large catch-up migration from historical `db:push` usage — don't run it.
- `package-lock.json`, `.env.local`, any new dependencies.
- The `users`/auth schemas and `updateUserFormSchema` in `lib/definitions.ts` — leave untouched.
- Combine's pipeline (`bddiaz/cicero-scripts`) — mismatches needing Combine changes go in the report, not in code.

## Git workflow

- Branch off latest `main`: `git checkout -b crt-84-identify-and-fix-any-schema-mismatches-between-what-combine` (Linear's branch name for this ticket)
- Commit style: short conventional prefix, e.g. `fix(schema): derive player zod schemas from drizzle to match DB nullability`. Do NOT add `Co-Authored-By` trailers.
- Do not push without the operator's approval.

## Steps

### Step 1: Add `.notNull()` to `is_mock`

In `server/db/schema/player_stats.ts:50`, change

```ts
is_mock: boolean('is_mock').default(false),
```
to
```ts
is_mock: boolean('is_mock').default(false).notNull(),
```

Do **not** run `npm run generate` (see Out of scope).

**Verify**: `npx tsc --noEmit` → exit 0

### Step 2: Rewrite the player-related Zod schemas with drizzle-zod

In `lib/definitions.ts`, replace the hand-written `playerStatsSchema`, `playerAveragesSchema`, `playerSchema`, and `teamSchema` with derived schemas. Keep every export name identical. Target shape:

```ts
import { createSelectSchema } from 'drizzle-zod';
import { players } from '@/server/db/schema/players';
import { playerStats } from '@/server/db/schema/player_stats';
import { playerAverages } from '@/server/db/schema/player_averages';
import { teams } from '@/server/db/schema/teams';

const playerStatsSchema = createSelectSchema(playerStats);
const playerAveragesSchema = createSelectSchema(playerAverages);

const playerSchema = createSelectSchema(players).extend({
  picture: z.string().optional(),
  averages: playerAveragesSchema.optional(),
  stats: z.array(playerStatsSchema).optional(),
  cicero_score: z.string().nullable().optional(),
});

const teamSchema = createSelectSchema(teams);
```

Notes:
- `cicero_score` stays `z.string()` — Postgres `numeric` comes back as a string, and `components/player/player-action-bar.tsx:26` already does `Number(ciceroScore)`.
- The old hand-written object literals are deleted entirely. The `export { ... }` lines and `export type Player = z.infer<typeof playerSchema>` etc. stay as they are.
- drizzle-zod v0.8 emits `z.date()` for timestamps and correct `.nullable()` for nullable columns — exactly the alignment we want.

**Verify**: `npx tsc --noEmit` → exit 0. If it reports errors in consumer files (e.g. `seedTeams.ts` referencing `nickname`, or a component assuming a non-null field), fix those call sites minimally (optional chaining / fallback text), staying inside the in-scope file list. If a fix would require touching a file outside scope, STOP.

### Step 3: Let schema-mismatch errors surface instead of masquerading as "Player not found"

In `lib/data/players.ts` `fetchPlayerDataByID`, remove the try/catch around `playerSchema.parse` so a parse failure throws and bubbles to `app/(main)/players/[id]/error.tsx` (the route already has an error boundary). Keep the `null` return only for the genuine "no row" case (`playerResult.length === 0`). Per CLAUDE.md error handling: unexpected failures throw to the boundary; never swallow.

**Verify**: `npx tsc --noEmit` → exit 0

### Step 4: Live verification against previously-broken players

Run `npm run dev`, then in a browser (or `curl -s localhost:3000/players/<id> | grep -c "Player not found"` → expect `0`):

- `/players/1630828` (Alex Antetokounmpo — NULL `LAST_AFFILIATION`, broken before this fix) → player card renders with name and team.
- `/players/1642905` (Yang Hansen — NULL `SCHOOL`) → renders.
- `/players/1628983` (Shai Gilgeous-Alexander — 51 stat rows, fully populated) → renders with stats chart (regression check).
- `/players/999999999` → still shows "Player not found".

**Verify**: all four behave as listed; no errors in the dev-server console other than pre-existing ones unrelated to players.

### Step 5: Add a unit test locking in the fix

Create `vitest.config.ts` at the repo root:

```ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
```

— STOP: `vite-tsconfig-paths` is **not** installed and new dependencies need approval. Instead, configure the alias manually:

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname) } },
  test: { environment: 'node' },
});
```

Add `"test": "vitest run"` to `package.json` scripts (change nothing else in that file).

Create `lib/definitions.test.ts` with cases:
1. `playerSchema.parse()` accepts a fully-populated player row (build the fixture from the field list in `server/db/schema/players.ts`).
2. `playerSchema.parse()` accepts a row where `school`, `last_affiliation`, `draft_year`, `is_active`, `nba_flag`, `dleague_flag`, `games_played_flag`, `is_retired`, `last_updated` are all `null` (this is the regression this plan fixes).
3. `playerAveragesSchema.parse()` accepts `{ averages_id: 1, player_id: 1, ppg: null, apg: null, rpg: null, last_update: null }`.
4. `playerStatsSchema.parse()` rejects a row missing `player_id` (sanity check that validation still validates).

**Verify**: `npm test` → 4 tests pass.

### Step 6: Write the coordination report

Create `plans/CRT-84-report.md` recording (for the operator to act on — ticket AC requires mismatches needing Combine changes to be filed as separate tickets):

- `cicero_scores` is empty (0 rows as of 2026-06-10). Courtside reads it in `fetchPlayerDataByID` and CRT-85 depends on it containing per-game history; it also has no game/date column besides `calculated_at` and no unique constraint. → needs a Combine-side ticket (owner: Bryan).
- `player_stats.is_mock` has 0 `true` rows — Combine's mock-data write (CRT-83's premise) hasn't happened or wrote with `is_mock=false`. → coordination item.
- All live DB columns are mapped by Courtside's Drizzle schemas; no unused Combine columns exist today.
- ~123 players with stats have no `player_averages` row (548 with stats vs 539 averages rows) — UI must tolerate missing averages (relevant to CRT-86/87/88).

**Verify**: file exists and contains the four findings.

## Test plan

Covered by Step 5 (unit tests — there is no existing test to model after; this creates the repo's first) and Step 4 (live page checks). Full gate: `npx tsc --noEmit && npm run lint && npm test` → all exit 0.

## Done criteria

- [ ] `npx tsc --noEmit` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm test` exits 0 with the 4 new tests passing
- [ ] `/players/1630828` renders the player (was "Player not found" before)
- [ ] `grep -n "z.object" lib/definitions.ts` shows no hand-written player/stats/averages/team object schemas (only `updateUserFormSchema` and `newsArticleSchema` remain)
- [ ] No migration files added or modified: `git status server/db/drizzle/` is clean
- [ ] `plans/CRT-84-report.md` exists
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `createSelectSchema` from drizzle-zod v0.8.3 produces types that break consumers in ways not fixable inside the in-scope files.
- You feel the need to run `npm run generate` or `npm run db:push` — both are forbidden here.
- Step 4 shows `/players/1628983` (the regression-check player) broken after the change.
- The live code at the cited lines doesn't match the "Current state" excerpts.
- Fixing a `tsc` error requires installing any package.

## Maintenance notes

- From now on, schema drift fixes happen in `server/db/schema/*.ts` and the Zod layer follows automatically — reviewers should reject any new hand-written DB row schema in `lib/definitions.ts`.
- If Combine adds a column, Courtside only needs the Drizzle field added; if Combine adds a NOT NULL column without a default, inserts from seed scripts will break first.
- Deferred: derived schemas for the `users` table (`updateUserFormSchema` stays hand-written by design — it's a form boundary, not a row schema).
- The dev DB **is** production; any future plan that wants to write rows must get operator approval first.
