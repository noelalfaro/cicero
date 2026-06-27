# Plan CRT-85: Build the PR Score time-series chart wired to cicero_scores

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat c70fb52..HEAD -- app/(main)/players/ lib/data/ components/player/ components/layout/skeletons.tsx`
> Diffs from CRT-84 (and possibly CRT-83/86) are expected. Re-read
> `app/(main)/players/[id]/page.tsx` before editing it — other plans touch it.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (data source is currently empty; visual verification needs seeded rows, which requires operator approval)
- **Depends on**: plans/CRT-84.md
- **Category**: direction (new feature)
- **Planned at**: commit `c70fb52`, 2026-06-10
- **Linear**: https://linear.app/ciceroapp/issue/CRT-85

## Why this matters

A single current PR Score says where a player is; the time series says where they're going — the most investment-relevant signal on the page and the input to the buy/sell decisions coming in CRT-89/90. This plan adds a `getPlayerScoreHistory` data function, a Recharts line chart component with skeleton/empty states, and a new full-width row on the player page.

**Two constraints discovered during planning (2026-06-10), baked into this plan:**
1. `cicero_scores` has **0 rows** — Combine hasn't written scores yet (flagged in `plans/CRT-84-report.md`). The chart must ship with a correct empty state, verified with operator-approved seed rows.
2. The ticket asks for `{ date, score, gameId }`, but `cicero_scores` has **no game column** — only `(id → player_id, cicero_score numeric, calculated_at timestamp)`. The data function therefore returns `{ date, score }` keyed on `calculated_at`, and the gameId linkage goes in the report as a Combine schema request. Do not invent a join to `player_stats`.

## Current state

- `server/db/schema/cicero_scores.ts` (the entire table):

```ts
export const ciceroScores = pgTable('cicero_scores', {
  player_id: integer('id')
    .notNull()
    .references(() => players.id),
  cicero_score: numeric('cicero_score').notNull(),
  calculated_at: timestamp('calculated_at').defaultNow(),
});
```

  Note `player_id` maps to a DB column literally named `id`, and `numeric` comes back from Postgres **as a string**. `calculated_at` is nullable.

- The page (`app/(main)/players/[id]/page.tsx`) is a Server Component laying sections into `md:grid md:grid-cols-8 md:grid-rows-[350px_1fr_300px] lg:grid-rows-[350px_1fr_250px]`, each section wrapped in `<Suspense>` with a skeleton from `components/layout/skeletons.tsx`. The existing per-game chart (`components/player/player-stats-chart.tsx`) shows the repo's Recharts idiom: `ChartContainer`/`ChartTooltip` from `components/ui/chart.tsx`, semantic CSS vars (`var(--primary)`, `var(--border)`), `LineChart` + `CartesianGrid` + axis config. Model the new chart on it.
- The current PR Score displays in `components/player/player-action-bar.tsx` (renders `PR: {Number(ciceroScore).toFixed(1)}` only when non-null). The ticket places the history chart "below the current PR Score display, full width".
- Data-fetching convention (CLAUDE.md): fetch in the Server Component, pass down as props; client components only for state/recharts. The existing data layer for players is `lib/data/players.ts` (`import 'server-only'` at top — follow that pattern).
- Empty states convention: meaningful message, never blank (CLAUDE.md). Loading: Suspense + skeleton.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Unit tests | `npm test` | all pass (script added by CRT-84) |
| Dev server | `npm run dev` | http://localhost:3000 (production DB — no writes) |

## Scope

**In scope**:
- `lib/data/scores.ts` (create)
- `components/player/pr-score-chart.tsx` (create — client chart + server wrapper may live in one file pair, see Step 2)
- `components/layout/skeletons.tsx` (add `PRScoreChartSkeleton`)
- `app/(main)/players/[id]/page.tsx` (add the new grid row)
- `lib/data/scores.test.ts` (create)
- `plans/README.md` (status row)

**Out of scope**:
- `server/db/schema/cicero_scores.ts` — no schema changes; adding a game_id column is Combine's call.
- `components/player/player-stats-chart.tsx` — that's CRT-86's redesign; don't refactor it here.
- Any INSERT into the production DB without explicit operator approval (Step 5 asks).

## Git workflow

- Branch: `crt-85-build-time-series-chart-showing-a-players-pr-score-game-by` off latest `main`.
- Commits: `feat(player): add PR score history data layer`, `feat(player): add PR score history chart`. No `Co-Authored-By`.
- Do not push without operator approval.

## Steps

### Step 1: Data layer

Create `lib/data/scores.ts`:

```ts
import 'server-only';
import { db } from '@/server/db';
import { ciceroScores } from '@/server/db/schema/cicero_scores';
import { asc, eq } from 'drizzle-orm';

export type ScorePoint = { date: Date; score: number };

export async function getPlayerScoreHistory(
  playerId: number,
): Promise<ScorePoint[]> {
  const rows = await db
    .select()
    .from(ciceroScores)
    .where(eq(ciceroScores.player_id, playerId))
    .orderBy(asc(ciceroScores.calculated_at));

  return rows
    .filter((r) => r.calculated_at !== null)
    .map((r) => ({ date: r.calculated_at!, score: Number(r.cicero_score) }));
}
```

Export the row→point mapping as its own pure function (e.g. `toScorePoints(rows)`) so it can be unit tested without a DB.

**Verify**: `npx tsc --noEmit` → exit 0

### Step 2: Chart component

Create `components/player/pr-score-chart.tsx` containing two exports:

1. `PRScoreChartSection` — async Server Component: `const points = await getPlayerScoreHistory(playerId)`; if `points.length < 2`, render the empty-state Card (`CardTitle` "PR Score History", body copy like "Not enough score history yet — check back after a few more games."); otherwise render `<PRScoreChartClient points={...} />`. Dates must be serialized for the client boundary (pass `points.map(p => ({ date: p.date.toISOString(), score: p.score }))`).
2. `PRScoreChartClient` — `'use client'`, props `{ points: { date: string; score: number }[] }`. Recharts `LineChart` inside `ChartContainer` (copy the structure from `components/player/player-stats-chart.tsx:147-220`): X axis = date formatted `MMM D` via `toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })`, Y axis auto domain, `ChartTooltip` showing exact score + full date, line stroke `var(--primary)`, grid stroke `var(--border)`. No hardcoded colors (CLAUDE.md semantic-color rule). Wrap the whole thing in a `Card` with `CardHeader` title "PR Score History" and description "Pulse Rating after each calculation".

Component file naming is kebab-case, named exports (repo convention).

**Verify**: `npx tsc --noEmit` → exit 0

### Step 3: Skeleton + page placement

- Add `PRScoreChartSkeleton` to `components/layout/skeletons.tsx`, modeled on `PlayerStatsChartSkeleton` (Card + title + `<Skeleton className="h-[200px] w-full" />`), with grid class `md:col-span-8`.
- In `app/(main)/players/[id]/page.tsx`, add directly **after** the `PlayerActionBar` Suspense block (the action bar shows the current PR Score; the ticket wants history below it):

```tsx
<Suspense fallback={<PRScoreChartSkeleton />}>
  <PRScoreChartSection playerId={player.id} />
</Suspense>
```

  Give the section's Card `md:col-span-8` so it spans the full grid width, and change the grid rows template from `md:grid-rows-[350px_1fr_300px]` to `md:grid-rows-[350px_1fr_auto_300px]` (and the `lg:` variant equivalently) so the new row sizes to content. Also update `app/(main)/players/[id]/loading.tsx` to include the new skeleton in the same position.

**Verify**: `npm run dev` → on `/players/1628983` the new full-width "PR Score History" card shows the **empty state** (table is empty) below the action bar; layout not broken on mobile width (no horizontal scroll).

### Step 4: Unit-test the mapping

Create `lib/data/scores.test.ts` (model after `lib/definitions.test.ts` from CRT-84) covering `toScorePoints`:
- converts `cicero_score` strings to numbers
- drops rows with `calculated_at: null`
- preserves ascending order

**Verify**: `npm test` → all pass.

### Step 5: Visual verification with real rows — ASK FIRST

The chart's populated path can't be seen with production data (0 rows). **Ask the operator** to approve seeding, presenting exactly this statement for them to run/approve (3 rows for a test player, trivially deletable):

```sql
INSERT INTO cicero_scores (id, cicero_score, calculated_at) VALUES
  (1628983, 71.2, '2026-05-01'), (1628983, 74.8, '2026-05-15'), (1628983, 73.1, '2026-05-29');
-- cleanup afterwards:
-- DELETE FROM cicero_scores WHERE id = 1628983 AND calculated_at IN ('2026-05-01','2026-05-15','2026-05-29');
```

If approved: confirm `/players/1628983` renders a 3-point line, tooltip shows score + date, points are chronological; then run the cleanup DELETE (with approval). If not approved or no response: mark this step BLOCKED in `plans/README.md` and note that the populated path is covered only by unit tests.

**Verify**: screenshot-level confirmation recorded in the README status row note.

## Test plan

- `lib/data/scores.test.ts` — 3 cases listed in Step 4.
- Manual: empty state on any player page (Step 3), populated chart via approved seed (Step 5).
- Gate: `npx tsc --noEmit && npm run lint && npm test` → exit 0.

## Done criteria

- [ ] `npx tsc --noEmit`, `npm run lint`, `npm test` all exit 0
- [ ] `/players/1628983` shows the PR Score History card with a meaningful empty state (no blank space, no crash)
- [ ] Chart renders correctly with ≥2 seeded points (or step explicitly marked BLOCKED with operator decision recorded)
- [ ] No hardcoded colors: `grep -n "bg-white\|text-black\|#[0-9a-fA-F]\{6\}" components/player/pr-score-chart.tsx` → no matches
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- `cicero_scores` turns out to have gained a game/date column since 2026-06-10 (Combine may ship the schema change) — the data function should then use it; report so the plan is amended rather than guessing the semantics.
- You are tempted to join `player_stats.prScore` to fake a history — that's a different metric lineage; the ticket owner must decide (it's also what the existing CRT-86 chart already shows).
- Seeding is needed for any step other than 5, or any write beyond the approved INSERT/DELETE.
- `page.tsx` has structurally changed (other plans touch it) such that the placement instruction is ambiguous.

## Maintenance notes

- When Combine starts writing `cicero_scores` for real, check volume: this query is unindexed; if rows-per-player grows large, add an index on `(id, calculated_at)` via a proper migration.
- If Combine adds `game_id` to the table, extend `ScorePoint` and the tooltip — the ticket originally wanted it.
- CRT-88's layout review should re-evaluate whether action-bar PR + history chart + (CRT-86) stats chart present PR coherently.
