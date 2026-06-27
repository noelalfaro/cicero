# Plan CRT-86: Redesign the stats chart — game log view and season averages view

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat c70fb52..HEAD -- components/player/ app/(main)/players/ lib/definitions.ts components/layout/skeletons.tsx`
> Diffs from CRT-84/85 are expected. Re-read `player-stats-chart.tsx` and
> `page.tsx` before editing — if their structure no longer matches the
> excerpts below, STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (rewrites the most visually complex component on the player page)
- **Depends on**: plans/CRT-84.md (type fixes); run after plans/CRT-85.md to avoid `page.tsx` merge churn
- **Category**: direction (feature/UX)
- **Planned at**: commit `c70fb52`, 2026-06-10
- **Linear**: https://linear.app/ciceroapp/issue/CRT-86

## Why this matters

The current chart grew incrementally and is confusing: it's titled "Pulse Rating (PR)" but its footer mixes points and PR ("Last game: X points (Points Avg {averagePrScore})" — a real labeling bug at `player-stats-chart.tsx:231-234`), it shows only the last 5 games of one metric, and its average math divides by all games including DNPs and crashes to `NaN` if any `prScore` is null. Before the invest button lands (CRT-89), the page must answer "is this player performing well?" — via a game-log view (hot/cold streaks) and a season-averages view (stable baseline).

## Current state

- `components/player/player-stats-chart.tsx` (client component, 243 lines) — the component this plan replaces. Key facts:
  - Gets `initialStats` as a prop from the server page, then `useSuspenseQuery({ queryKey: ['playerStats', playerId], queryFn: () => fetchPlayerStatsApi(playerId), initialData: initialStats, staleTime: 7200000, refetchOnMount: false })` with `playerId` from `useParams`. **Keep this data flow** — it's the repo's established pattern for this component (`lib/client/player-stats-api.ts` → `GET /api/player-stats/[id]` → `fetchPlayerStatsByID`).
  - Renders a Card spanning `md:col-span-5 lg:col-span-6`, internally split: left ~3/4 = chart area, right ~1/4 = `<PlayerTicker lastGamePrScore={...} />` (big PR number + Buy/Sell buttons). **The ticker panel and its grid classes must survive the redesign unchanged** — CRT-89 wires those buttons.
  - DNP detection idiom: `stat.comment.includes('DNP') || stat.comment.includes('DND')` (line 116-118).
  - Chart idiom: `ChartContainer`/`ChartTooltip`/`ChartTooltipContent` from `components/ui/chart.tsx`, colors only via CSS vars (`var(--primary)`, `var(--border)`, `var(--background)`, `var(--destructive)`).
  - Bug inventory being fixed by replacement: NaN-prone averages (lines 124-133: `sum + stat.prScore` over possibly-null values, divided by `stats.length` including DNP games), points/PR label mix-up in footer, only-5-games hard cap with no control.
- `PlayerStats` type (post-CRT-84: derived from Drizzle in `lib/definitions.ts`): per-game fields used here — `points`, `totReb`, `assists`, `min`, `opp`, `game_result`, `comment`, `prScore` (nullable), `gamedate`, `stats_id`, `season`.
- Empty state already handled ("No Performance Data" card) — keep equivalent behavior.
- Error state: `isError` → `PlayerChartError` (`components/player/player-chart-error.tsx`, no retry). Ticket requires an inline error **with retry** — `useSuspenseQuery` exposes `refetch`; pass it down.
- **No Tabs component exists** in `components/ui/` and `@radix-ui/react-tabs` is not installed; new dependencies require operator approval (CLAUDE.md). The view toggle is therefore a segmented control built from existing `Button`s (pattern below).
- Data reality (verified 2026-06-10): one season (`2025`) in `player_stats`; good test players: 1628983 (SGA, 51 games), 1628418 (Thomas Bryant, 52). ~123 players with stats have no `player_averages` row, and league averages **do not exist anywhere in the DB** — the ticket's "compare against league average if data is available" is explicitly skipped (note it in the PR description).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Unit tests | `npm test` | all pass |
| Dev server | `npm run dev` | http://localhost:3000 (production DB, read-only) |

## Scope

**In scope**:
- `components/player/stats-chart.tsx` (create — the new component)
- `lib/player-stats-view.ts` (create — pure helpers: per-game chart rows, season-average computation, DNP filter)
- `lib/player-stats-view.test.ts` (create)
- `components/player/player-stats-chart.tsx` (delete after the switch)
- `app/(main)/players/[id]/page.tsx` (swap the import/usage)
- `components/layout/skeletons.tsx` (update `PlayerStatsChartSkeleton` title/shape if needed)
- `components/player/player-chart-error.tsx` (add optional `onRetry` prop)
- `plans/README.md` (status row)

**Out of scope**:
- `components/player/player-ticker.tsx` — visual/host position unchanged (CRT-89 owns its buttons).
- `components/player/pr-score-chart.tsx` (CRT-85's chart) — different metric, different card.
- The API route / data layer — no query changes.
- Installing any package (no radix tabs).

## Git workflow

- Branch: `crt-86-redesign-stats-chart-for-clarity-game-log-view-and-season` off latest `main`.
- Commits per logical unit: `feat(player): add stats view helpers`, `feat(player): redesign stats chart with game log and season views`, `chore(player): remove old stats chart`. No `Co-Authored-By`.
- Do not push without operator approval.

## Steps

### Step 1: Pure view-model helpers

Create `lib/player-stats-view.ts` (no `'use client'`, no server-only — pure functions):

- `isDNP(stat): boolean` — comment contains `'DNP'` or `'DND'` (port the existing idiom).
- `toGameLogRows(stats: PlayerStats[], count: number)` — last `count` games chronologically, each `{ label /* 'MMM D' via toLocaleDateString en-US, timeZone UTC */, points, rebounds: totReb, assists, prScore, min, opp, game_result, isDNP, key: stats_id }`.
- `seasonAverages(stats: PlayerStats[])` — over **non-DNP** games only: `{ games, ppg, rpg, apg, prAvg }`, where `prAvg` averages only non-null `prScore` values (`null` if none). Round to 1 decimal. Return `null` when there are no non-DNP games.

**Verify**: `npx tsc --noEmit` → exit 0

### Step 2: New component with two views

Create `components/player/stats-chart.tsx`, `'use client'`, named export `StatsChart`, props `{ initialStats: PlayerStats[] }` — drop-in replacement for the old component, same `useSuspenseQuery` setup (copy lines 52-60 of the old file verbatim, including `queryKey: ['playerStats', playerId]`).

Layout: same outer Card and grid classes as the old component (`flex grow flex-col gap-0 md:col-span-5 md:flex-row lg:col-span-6`), left chart area + right `<PlayerTicker lastGamePrScore={...} />` panel preserved (compute `lastGamePrScore` from the latest non-DNP game with a non-null prScore, falling back to 0).

Header row contains the segmented view toggle (local `useState<'log' | 'season'>('log')` — ticket: persists within session only, so plain state is fine):

```tsx
<div role="tablist" aria-label="Stats view" className="bg-muted inline-flex rounded-md p-1">
  <Button role="tab" aria-selected={view === 'log'} size="sm"
    variant={view === 'log' ? 'secondary' : 'ghost'} onClick={() => setView('log')}>
    Game log
  </Button>
  <Button role="tab" aria-selected={view === 'season'} size="sm"
    variant={view === 'season' ? 'secondary' : 'ghost'} onClick={() => setView('season')}>
    Season averages
  </Button>
</div>
```

**Game log view (default)**: Recharts `BarChart` of the last 10 games from `toGameLogRows(stats, 10)`. A second, smaller segmented control (same pattern, state `metric: 'points' | 'rebounds' | 'assists'`) selects the plotted `dataKey`. X axis `label`, bar fill `var(--primary)`; DNP games get fill `var(--muted)` (use Recharts `<Cell>` per data point). Tooltip: custom `ChartTooltipContent`-based content showing the full line — `PTS / REB / AST / MIN / OPP / W-L`, or "Did not play" for DNP rows.

**Season averages view**: `seasonAverages(stats)` rendered as a `BarChart` with one bar per category (`[{ name: 'PPG', value }, { name: 'RPG', value }, { name: 'APG', value }]`) plus a text line "Across {games} games played" and, when `prAvg` is non-null, "Avg PR: {prAvg}". If `seasonAverages` returns `null`, show the empty-state copy "No completed games this season."

**States**: keep the `stats.length === 0` empty Card ("No Performance Data" + suggestion text); on `isError` render `PlayerChartError` with `onRetry={() => refetch()}` (add the optional prop and a "Try again" `Button` to `player-chart-error.tsx`). Footer: replace the buggy points/PR copy with one honest line per view (log: "Showing last N games"; season: nothing extra).

**Verify**: `npx tsc --noEmit` → exit 0

### Step 3: Swap usage and delete the old component

In `app/(main)/players/[id]/page.tsx`, replace the `PlayerStatsChart` import and `<PlayerStatsChart initialStats={player.stats ?? []} />` with `StatsChart`. Update `PlayerStatsChartSkeleton` in `components/layout/skeletons.tsx` only if its title text now mismatches (rename title to "Player Stats"). Delete `components/player/player-stats-chart.tsx`.

**Verify**: `npx tsc --noEmit` → exit 0 AND `grep -rn "player-stats-chart\|PlayerStatsChart\b" app components lib --include="*.tsx" --include="*.ts"` → only the skeleton name remains (or rename it to `StatsChartSkeleton` everywhere and the grep returns nothing).

### Step 4: Unit tests

Create `lib/player-stats-view.test.ts` (model after `lib/definitions.test.ts`): DNP rows excluded from averages; null `prScore` doesn't yield `NaN`; `toGameLogRows` returns chronological last-N; `seasonAverages` returns `null` for all-DNP input; rounding to 1 decimal.

**Verify**: `npm test` → all pass.

### Step 5: Browser check

On `/players/1628983` (51 games) and `/players/1628418`: game log renders bars with tooltips; metric toggle switches points/rebounds/assists; view toggle switches to season averages without a page reload; ticker + Buy/Sell panel unchanged on the right; mobile width stacks without horizontal scroll. On a player with no stats (find one via `/explore`): empty card. Console: no errors.

**Verify**: all observations hold.

## Test plan

Step 4's unit tests (5 cases) + Step 5's manual matrix. Gate: `npx tsc --noEmit && npm run lint && npm test` → exit 0.

## Done criteria

- [ ] `npx tsc --noEmit`, `npm run lint`, `npm test` all exit 0
- [ ] Game log and season averages views both render and toggle client-side
- [ ] DNP games visually distinct and excluded from averages; no `NaN` anywhere
- [ ] Old component deleted; no dangling imports (grep from Step 3 clean)
- [ ] PlayerTicker panel and its props unchanged (`git diff components/player/player-ticker.tsx` → empty)
- [ ] No hardcoded colors in new files
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- The old chart's structure no longer matches the excerpts (another plan rewrote it first).
- You need a Tabs/SegmentedControl dependency — the Button-based control above must suffice; installing packages is forbidden without approval.
- `player.stats` prop shape changed (CRT-84 altered types) in a way that breaks `initialData` for `useSuspenseQuery` — report the type error rather than casting.
- The ticker's `lastGamePrScore` computation can't produce a sensible value (e.g. all prScores null for test players) — pick the documented fallback (0) only if visually acceptable; otherwise report.

## Maintenance notes

- League-average comparison was skipped (no data source); if Combine ever publishes league averages, extend the season view's BarChart with a second series.
- The 10-game window in the log view is a constant in `stats-chart.tsx` — if product wants a selector (10/25/all), it's a small extension of the metric-toggle pattern.
- Reviewer should scrutinize: tooltip correctness for DNP rows, and that `queryKey: ['playerStats', playerId]` stayed identical (other components may share the cache entry).
