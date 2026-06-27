# Plan CRT-88: Player page layout review — "does this give someone enough context to invest?"

> **Executor instructions**: This is a structured REVIEW with a small inline
> copy-fix budget, not a build ticket. Follow the steps; if anything in the
> "STOP conditions" section occurs, stop and report. When done, update the
> status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat c70fb52..HEAD -- app/(main)/players/ components/player/`
> Large diffs are EXPECTED — this plan is meant to run after CRT-85/86/87
> reshaped the page. Review the page as it exists, not as excerpted below.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW (review + copy tweaks only)
- **Depends on**: plans/CRT-85.md, plans/CRT-86.md, plans/CRT-87.md (review the finished page, not the construction site)
- **Category**: direction
- **Planned at**: commit `c70fb52`, 2026-06-10
- **Linear**: https://linear.app/ciceroapp/issue/CRT-88

## Why this matters

The player page was built section-by-section across many tickets. Before the invest button gets wired to real money-like actions (CRT-89), one holistic pass must answer: "would a first-time visitor have enough context to buy shares in this player?" Gaps are cheaper to fix before the buy modal exists. The ticket's deliverable is a **written gap list** (→ follow-up tickets) plus inline fixes for anything under ~30 minutes.

## Current state

- Page: `app/(main)/players/[id]/page.tsx`. Sections after CRT-85/86/87 land: player header card (`player-detail-static.tsx`), stats chart with game-log/season views + PR ticker and Buy/Sell buttons (`stats-chart.tsx` + `player-ticker.tsx`), action bar with PPG/APG/RPG + current PR (`player-action-bar.tsx`), PR Score history chart (`pr-score-chart.tsx`), player news, AI summary (`player-ai-summary.tsx` — still mock content by design).
- Auth: viewing requires a signed-in, onboarded session; `npm run dev` hits the production Neon DB (browse read-only).
- Test players: `/players/1628983` (SGA — full data), `/players/1628418` (Thomas Bryant), `/players/1630828` (Alex Antetokounmpo — sparse data; good "worst case" page), plus a no-stats player found via `/explore`.
- Known candidate gaps from planning (seed the review with these, verify each against the live page):
  1. `player-action-bar.tsx` renders `PPG: {averages?.ppg}` → "PPG: " (blank) when a player has no `player_averages` row (~123 players). Fix candidate: `averages?.ppg ?? '—'` (inline-budget).
  2. "Pulse Rating (PR)" / "PR Score" / "cicero score" naming is never explained anywhere on the page — a first-time investor has no idea what the number means or that it acts as the price. Fix candidate: one-line description or tooltip near the score (inline if pure copy; ticket if it needs design).
  3. `player-ai-summary.tsx` shows fake AI text with a fake source link ("AI-Model.com") — actively misleading for an investment decision. Likely ticket: hide the card or label it clearly as "coming soon" (decide in review; labeling is inline-budget).
  4. ThumbsUp/ThumbsDown icons in the action bar do nothing (no handlers). Decide: remove (inline) or ticket a sentiment feature.
  5. The header card's "Add to Watchlist" button is static until CRT-89 — note as "resolved by CRT-89" rather than a new gap.
  6. Position/height/weight/age/draft info exists in the DB (`players` table) but the header shows only name + team — relevant context for "potential" investing. Likely ticket.
- CLAUDE.md rules that bind this review: out-of-scope improvements become Linear-issue suggestions, never inline fixes; minor copy fixes are allowed by the ticket itself (<30 min each).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Dev server | `npm run dev` | http://localhost:3000 |
| Typecheck | `npx tsc --noEmit` | exit 0 (gate for any inline fix) |
| Lint | `npm run lint` | exit 0 |

## Scope

**In scope**:
- `plans/CRT-88-review.md` (create — the deliverable)
- Copy/label-level edits ONLY, each individually under ~30 minutes and confined to: `components/player/player-action-bar.tsx`, `components/player/player-detail-static.tsx`, `components/player/player-ai-summary.tsx`, `components/player/player-ticker.tsx`, chart title/description strings in `components/player/*.tsx`
- `plans/README.md` (status row)

**Out of scope** (document, don't do):
- Any layout restructuring, new data fetching, new components, schema changes.
- Anything touching the Buy/Sell/watchlist behavior (CRT-89's job).
- Each inline fix must not change component props or data flow — text, fallbacks (`?? '—'`), and removed dead icons only.

## Git workflow

- Branch: `crt-88-review-full-player-page-layout-with-the-question-does-this` off latest `main`.
- One commit for the review doc, one for copy fixes: `docs(crt-88): player page investment-lens review`, `fix(player): copy and fallback polish from layout review`. No `Co-Authored-By`.
- Do not push without operator approval.

## Steps

### Step 1: Structured walkthrough

With the dev server running, visit the three test players plus a no-stats player. For each of the six ticket-mandated sections — header, current PR Score, PR history chart, stats chart, news feed, invest/watchlist buttons — answer in writing:

- Does this give useful signal toward "should I buy shares in this player?"
- Is it clear what the number/chart means without prior knowledge?
- What's missing that would increase confidence?

Also record cross-section issues: visual hierarchy (is the most decision-relevant info above the fold?), terminology consistency (PR vs Pulse Rating vs score), and the sparse-data experience (1630828).

**Verify**: notes exist for all 6 sections × 4 players (sparse pages may share notes).

### Step 2: Write the review document

Create `plans/CRT-88-review.md`:

- **Verdict** — one paragraph: is the page ready for CRT-89's invest wiring? (Explicit sign-off or blockers, per the ticket's AC.)
- **Per-section findings** — table: section | signal value (good/weak/none) | clarity | gaps.
- **Gap list** — each gap: severity, one-line proposed fix, and disposition: `inline-fixed (commit X)` / `proposed ticket: <draft title + 2-sentence description>` / `resolved by CRT-XX`. Seed with the six candidates from "Current state", validated or dismissed by what you actually saw.
- **Proposed ticket drafts** are written ready-to-paste; the operator files them in Linear (or approves the executor doing it if Linear MCP access exists in the session).

**Verify**: every gap has exactly one disposition; the verdict paragraph exists.

### Step 3: Apply the inline budget

Implement only the gaps you dispositioned `inline-fixed`, within the scope rules. Expected (confirm in review): `?? '—'` fallbacks in the action bar, a one-line PR explainer (e.g. `CardDescription` under the PR display: "Pulse Rating — our performance score, used as the player's price"), "coming soon" labeling or removal of the fake AI-summary source link, removal of the dead thumbs icons if dispositioned so.

**Verify**: `npx tsc --noEmit && npm run lint` → exit 0; re-load the pages and confirm each fix renders.

## Test plan

No unit tests — copy-only changes. Gate: typecheck + lint + visual re-check of all touched pages, including the sparse-data player.

## Done criteria

- [ ] `plans/CRT-88-review.md` exists with verdict, per-section table, dispositioned gap list, ready-to-file ticket drafts
- [ ] All inline fixes applied render correctly; `npx tsc --noEmit` and `npm run lint` exit 0
- [ ] No file outside the in-scope list modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- CRT-85/86/87 have not all landed (check `plans/README.md` status) — reviewing the half-built page wastes the ticket.
- An "inline" fix starts requiring prop changes, new fetches, or touches a file outside scope — re-disposition it as a ticket and move on.
- The page errors outright for any test player — that's a regression from a prior plan; report it instead of reviewing around it.

## Maintenance notes

- The review doc is the sign-off artifact CRT-89 cites; keep it until CRT-89 merges.
- Re-run this lens whenever a new section lands on the player page (the six questions in Step 1 are reusable).
