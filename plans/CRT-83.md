# Plan CRT-83: Verify player pages render correctly with Combine-written stats

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat c70fb52..HEAD -- app/(main)/players/ lib/data/players.ts components/player/`
> Changes from plan CRT-84 are EXPECTED here (it must land first). Anything
> else changed: compare the "Current state" excerpts before proceeding.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (this is a verification ticket — the only code written is a read-only check script and a report)
- **Depends on**: plans/CRT-84.md (schema alignment — without it several player pages fail to render at all)
- **Category**: tests
- **Planned at**: commit `c70fb52`, 2026-06-10
- **Linear**: https://linear.app/ciceroapp/issue/CRT-83

## Why this matters

Combine writes player stats to the shared Neon DB; Courtside reads them via Drizzle. Until someone walks the pipeline end-to-end, we don't know whether the player page renders real data, stale data, or silently falls back to empty states. The deliverable of this ticket is **a verified statement of what works and a written list of what doesn't** — not fixes. Broken sections become follow-up tickets (most are already covered by CRT-85/86/87; the report should say which).

## Current state (verified 2026-06-10 against Neon project `twilight-river-76263451`)

- `player_stats`: 14,767 rows across 548 players, season `2025`, game dates 2025-03-06 → 2026-05-31. **`is_mock = true` rows: 0.** The ticket's premise ("mock stats from Combine") is not literally satisfied — the data present looks like real stat lines. Verification proceeds against whatever Combine wrote; the report must flag the missing mock-data marker as a Combine coordination item.
- `cicero_scores`: **0 rows.** The ticket AC "PR Score displays the value from cicero_scores, not a placeholder" cannot pass with real data today. Expected page behavior with the current code: `fetchPlayerDataByID` (`lib/data/players.ts`) returns `cicero_score: null` and `components/player/player-action-bar.tsx` hides the PR line (it renders only when non-null). That **is** the correct graceful behavior — record it, don't "fix" it.
- `player_averages`: 539 rows — ~123 players with stats have **no** averages row. `components/player/player-action-bar.tsx:21-23` renders `PPG: {averages?.ppg}` → literally "PPG: " (undefined) for those players. Known cosmetic bug; document it (fixed properly in CRT-88's copy pass / CRT-86).
- The player page is `app/(main)/players/[id]/page.tsx` (NOT `/players/[slug]` as the ticket says — routes are numeric NBA player ids). Sections, each in its own `<Suspense>`: `PlayerDetailsStatic`, `PlayerStatsChart` (client, refetches via `/api/player-stats/[id]`), `PlayerActionBar`, `PlayerNews` (**hardcoded mock articles** from `fetchPlayerNews` in `lib/data/players.ts:194` — real news wiring is CRT-87), `PlayerAiSummary` (hardcoded mock text).
- Routes under `app/(main)/` require an authed + onboarded session — you must be signed in (Google OAuth) in the browser to view player pages. `npm run dev` hits the **production** Neon DB; browsing is read-only and safe, do not write anything.
- Known chart math bug to look for in the console: `player-stats-chart.tsx:124-133` averages `prScore` without filtering nulls (all 51 SGA rows have prScore, so it may not reproduce on the suggested players — note whatever you observe).

### Good test players (verified to have full data)

| id | player | stat rows | has prScore | has averages row |
|---|---|---|---|---|
| 1628983 | Shai Gilgeous-Alexander | 51 | all rows | yes |
| 1628418 | Thomas Bryant | 52 | all rows | yes |
| 1627936 | Alex Caruso | 51 | all rows | yes |
| 1631114 | Jalen Williams | 51 | all rows | yes |
| 1630828 | Alex Antetokounmpo | (fewer) | — | NULL `LAST_AFFILIATION` — only renders after CRT-84 |

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Dev server | `npm run dev` | http://localhost:3000 |
| DB probe script | `npx tsx scripts/verify-crt83.ts` | prints counts + per-player summary, exit 0 |

## Scope

**In scope** (only files you may create):
- `scripts/verify-crt83.ts` (create — read-only DB probe)
- `plans/CRT-83-report.md` (create — the deliverable)
- `plans/README.md` (status row)

**Out of scope** (do NOT touch):
- Any component, data, or schema file. If you find a bug, it goes in the report, not in a diff. (CLAUDE.md: out-of-scope findings become Linear issues, never inline fixes.)
- Any SQL that writes. The DB is production.

## Git workflow

- Branch: `crt-83-confirm-player-pages-render-correctly-with-mock-stats-from` off latest `main` (after CRT-84's branch has merged).
- One commit, e.g. `chore(crt-83): add pipeline verification script and report`. No `Co-Authored-By`.
- Do not push without operator approval.

## Steps

### Step 1: Write the read-only DB probe

Create `scripts/verify-crt83.ts`. It must load env the way `drizzle.config.ts` does (do **not** read `.env.local` yourself — the script loads it at runtime):

```ts
import { config } from 'dotenv';
config({ path: '.env.local' });
```

then dynamically `await import('@/server/db')` AFTER the config call (static imports would evaluate the db module before env is loaded — use `const { db } = await import('../server/db');` with a relative path since tsx won't resolve `@/` without help). Query and print:

- total `player_stats` rows, distinct players, count where `is_mock = true`
- total `cicero_scores` rows
- for ids 1628983, 1628418, 1627936, 1631114: stat-row count, min/max gamedate, whether an averages row exists, latest `cicero_scores` row if any

**Verify**: `npx tsx scripts/verify-crt83.ts` → exits 0 and prints numbers consistent with the "Current state" table (counts may have grown if Combine ran since 2026-06-10; note the actual values).

### Step 2: Browser walkthrough

With `npm run dev` running and a signed-in session, for each of `/players/1628983`, `/players/1628418`, `/players/1627936`, `/players/1631114`, and `/players/1630828`, record:

1. Page loads without the route error boundary or "Player not found".
2. Player header: name, team, headshot render.
3. Stats chart: line chart renders points for the last 5 games (not a stuck skeleton, not the "No Performance Data" empty card).
4. PR Score: expected to be **absent** (cicero_scores is empty) — confirm the action bar simply omits the PR line rather than showing `NaN`/`undefined`.
5. News + AI summary sections render (knowing they're hardcoded mocks — record that fact).
6. Browser devtools console: no uncaught errors / unhandled promise rejections. Copy any errors verbatim into the report.

**Verify**: notes captured for all 5 pages.

### Step 3: Write the report

Create `plans/CRT-83-report.md` with sections:

- **What was verified** (per-player table from Steps 1–2, with date and actual row counts).
- **AC status** — each Linear AC marked pass/fail/blocked:
  - "3–5 players have Combine data" → expected PASS
  - "Player page loads without errors" → expected PASS (post CRT-84)
  - "PR Score displays value from cicero_scores" → expected BLOCKED — table empty; needs Combine to write scores (coordination with Bryan, already flagged in `plans/CRT-84-report.md`)
  - "Stats section renders game log rows" → record result
  - "News renders or graceful empty state" → mock data renders; real wiring is CRT-87
  - "No console errors" → record result
- **Broken/missing sections → follow-up mapping**: "PPG: undefined" for players without averages (→ CRT-86/CRT-88), hardcoded news/AI summary (→ CRT-87), `is_mock` never set + empty `cicero_scores` (→ Combine ticket, operator to file in Linear), any new console errors found.

**Verify**: file exists; every AC from the ticket appears with a verdict.

## Test plan

This plan *is* a test. No unit tests to add. Gate: `npx tsc --noEmit` → exit 0 (the new script must typecheck).

## Done criteria

- [ ] `scripts/verify-crt83.ts` exists, runs read-only, exits 0
- [ ] `plans/CRT-83-report.md` exists with all six AC verdicts and the follow-up mapping
- [ ] `npx tsc --noEmit` exits 0
- [ ] No source files outside the in-scope list modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- CRT-84 has not been merged (check: `git log --oneline -10` should contain its commit; or `/players/1630828` shows "Player not found") — this plan's results are meaningless before it.
- The probe script cannot connect (likely missing `DRIZZLE_DATABASE_URL` in the environment) — report; do not open or edit `.env.local`.
- Any player page renders the route-level error boundary — capture the error text and stop; that's a finding bigger than this ticket.
- You catch yourself writing a fix to a component. Report instead.

## Maintenance notes

- Keep `scripts/verify-crt83.ts` — it's a cheap pipeline smoke test to re-run whenever Combine changes its writer.
- The report's "blocked" items gate CRT-85 (needs `cicero_scores` rows) — the operator should chase the Combine ticket before scheduling CRT-85's visual verification.
