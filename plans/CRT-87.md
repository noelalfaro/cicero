# Plan CRT-87: Real player-news feed with filtering, plus per-section error isolation

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat c70fb52..HEAD -- app/(main)/players/ components/player/ components/explore/nba-news.tsx lib/data/players.ts components/layout/`
> Diffs from CRT-84/85/86 are expected. Re-read `page.tsx` and
> `player-news.tsx` before editing; on structural mismatch with the excerpts,
> STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (depends on an external API — RapidAPI `nba-latest-news` — whose key may not be configured)
- **Depends on**: plans/CRT-84.md; run after CRT-85/CRT-86 (all three edit `page.tsx`)
- **Category**: bug + UX polish
- **Planned at**: commit `c70fb52`, 2026-06-10
- **Linear**: https://linear.app/ciceroapp/issue/CRT-87

## Why this matters

The player page's news section currently renders **three hardcoded fake articles** (`fetchPlayerNews` in `lib/data/players.ts:194-219` returns a static array; the real RapidAPI fetchers above it are unused by the page) and the explore page's `NbaNews` is fully hardcoded JSX. Real fetchers exist but swallow every failure into `return null`, making "API down", "no key", and "no articles" indistinguishable. Additionally, an exception in any one server section of the player page currently propagates to the route-level `error.tsx` and blows away the whole page — the ticket requires each section to fail independently. This is the polish pass gating CRT-88's layout review.

## Current state

- `app/(main)/players/[id]/page.tsx` — five sections, each in `<Suspense>` with skeletons from `components/layout/skeletons.tsx`. **Suspense does not catch errors**; there are no per-section error boundaries. Route-level boundary exists at `app/(main)/players/[id]/error.tsx`.
- `components/player/player-news.tsx` — server component, `await fetchPlayerNews(playerId)` (the mock), renders a Carousel of `{title, content}` with a hardcoded "Source: NBA.com" link. There is no empty state and articles have no URL link.
- `lib/data/players.ts`:
  - `fetchNewsArticles()` (line ~130) and `FetchNewsArticlesByPlayerID(first_name, last_name)` (line ~161): call `https://nba-latest-news.p.rapidapi.com/articles` with headers `X-RapidAPI-Key: process.env.RAPID_API_KEY!`, parse items with `newsArticleSchema` — which is only `{ title, url, source }` (`lib/definitions.ts:111-115`). **No date field exists in the schema**, so the ticket's "sort by most recent" cannot be implemented unless the API returns a date — see Step 1's probe.
  - Both fetchers `return null` on ANY error (catch-all). The player-ID variant filters server-side via `?player=first-last` query param.
  - `fetchPlayerNews` (mock) and `generateAiSummary` (mock) — the AI summary stays mock (no ticket covers it yet); it just gets an error boundary.
- `components/explore/nba-news.tsx` — static JSX, three fake 2022 articles.
- Conventions: server-fetch by default; `{ data, error }` returns for expected failures; unexpected → throw to boundary; loading = Suspense skeleton; empty states must say something meaningful (CLAUDE.md). Client error toasts use `handleError` in `lib/error/handle.ts` (not needed here — these are server sections).
- `RAPID_API_KEY`: referenced in code; **you cannot read `.env.local` to confirm it exists**. Step 1 probes behavior instead. CLAUDE.md: if env vars must change, tell the operator — never edit the file.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Unit tests | `npm test` | all pass |
| Dev server | `npm run dev` | http://localhost:3000 (production DB, read-only) |

## Scope

**In scope**:
- `components/layout/section-error-boundary.tsx` (create)
- `components/player/player-news.tsx` (rewrite to real data + states)
- `lib/data/news.ts` (create — move/fix the two news fetchers; delete them + the `fetchPlayerNews` mock from `lib/data/players.ts`)
- `components/explore/nba-news.tsx` (wire to real fetcher with states)
- `app/(main)/players/[id]/page.tsx` (wrap sections in boundaries; pass player names to news)
- `app/(main)/explore/page.tsx` (only if NbaNews usage needs a Suspense wrapper)
- `lib/data/news.test.ts` (create)
- `plans/README.md` (status row)

**Out of scope**:
- `PlayerAiSummary` content (stays mock) — it only gets wrapped in a boundary like every other section.
- "Load more" pagination — **deferred** (see Maintenance notes): the API's only knob is `limit`, the schema has no cursor/date, and doing it properly means a client-side TanStack Query rework of the news section. Cap at 10 (the API call already passes `limit=10`).
- The skeletons themselves — all five sections already have skeletons; don't redesign them.
- The RapidAPI subscription/key — operator-owned.

## Git workflow

- Branch: `crt-87-improve-news-feed-filtering-and-add-loading-skeletons-and` off latest `main`.
- Commits: `feat(news): real player news data layer with error semantics`, `feat(player): per-section error boundaries`, `feat(explore): wire NBA news feed`. No `Co-Authored-By`.
- Do not push without operator approval.

## Steps

### Step 1: Probe the news API's real behavior

With `npm run dev` running, hit the existing unused fetcher indirectly: temporarily add `console.log(JSON.stringify((await fetchNewsArticles())?.slice(0,2)))` inside any server component you're already editing, load the page once, read the dev-server log, then remove the log line. Record: does it return articles? Do raw items contain a date field the schema drops?

- If articles return and items include a usable date field → extend `newsArticleSchema` with that field (optional) and implement recency sort in Step 2.
- If articles return but no date field → skip sorting (API order is presumed-recent); note it in the PR.
- If `null`/401/403 → the key is missing or expired: **STOP and report** — tell the operator `RAPID_API_KEY` needs to be set/renewed in `.env.local` and Vercel. Do not proceed to build against an API you can't observe.

**Verify**: observed behavior recorded in the commit/PR description.

### Step 2: News data layer with honest error semantics

Create `lib/data/news.ts` with `import 'server-only'`. Move `fetchNewsArticles` and `FetchNewsArticlesByPlayerID` here (renamed `fetchNewsByPlayer(firstName, lastName)`), rewritten per CLAUDE.md error rules:

- `!response.ok` or fetch throw → **throw** (unexpected failure → section boundary catches it). Never `return null`.
- Successful response with zero matching articles → return `[]` (expected case → empty state).
- Keep `noStore()`, the 10-article limit, and `newsArticleSchema.parse` per item; a single malformed item should be skipped (`safeParse`, filter failures) rather than killing the list.
- Delete the originals AND the mock `fetchPlayerNews` from `lib/data/players.ts`; fix imports.

**Verify**: `npx tsc --noEmit` → exit 0; `grep -n "fetchPlayerNews\|FetchNewsArticlesByPlayerID" -r app components lib` → no matches outside `lib/data/news.ts`.

### Step 3: Reusable section error boundary

Create `components/layout/section-error-boundary.tsx` — `'use client'`, a class component (React error boundaries must be classes):

```tsx
'use client';
import { Component, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props { title: string; className?: string; children: ReactNode }
interface State { hasError: boolean }

export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <Card className={this.props.className}>
        <CardHeader><CardTitle>{this.props.title}</CardTitle></CardHeader>
        <CardContent className="flex flex-col items-start gap-2">
          <p className="text-muted-foreground text-sm">This section failed to load.</p>
          <Button variant="outline" size="sm" onClick={() => this.setState({ hasError: false })}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }
}
```

Note: "Try again" re-renders the children; for server-component children that re-attempts the suspended tree only if the page re-fetches — acceptable best-effort retry (the ticket says "where feasible").

**Verify**: `npx tsc --noEmit` → exit 0

### Step 4: Wrap every player-page section

In `app/(main)/players/[id]/page.tsx`, wrap each of the five (six, once CRT-85's chart exists) `<Suspense>` blocks:

```tsx
<SectionErrorBoundary title="Player Stats" className="md:col-span-5 lg:col-span-6 ...">
  <Suspense fallback={<PlayerStatsChartSkeleton />}>...</Suspense>
</SectionErrorBoundary>
```

The boundary's `className` must carry the same grid-span classes as the section it guards so the grid doesn't collapse when a fallback Card renders (read each section's Card classes and mirror them).

**Verify**: temporarily `throw new Error('boom')` at the top of `PlayerNews`, load a player page → news slot shows the fallback Card while all other sections render; remove the throw. `npx tsc --noEmit` → exit 0.

### Step 5: Rewire PlayerNews

Rewrite `components/player/player-news.tsx`:

- Props become `{ firstName, lastName }` (page passes `player.first_name`/`player.last_name` — both NOT NULL in the DB).
- `const articles = await fetchNewsByPlayer(firstName, lastName);`
- Empty (`articles.length === 0`): keep the Card header, body shows "No recent news for this player." (meaningful empty state per CLAUDE.md).
- Non-empty: carousel items render `title` as an external link to `article.url` (`target="_blank" rel="noopener noreferrer"`) and "Source: {article.source}" — delete the hardcoded NBA.com link. Cap at 10 (already API-side). Apply recency sort only if Step 1 found a date field.
- Title the card "Player News" (it's player-filtered now; "NBA News" stays on explore).

**Verify**: on `/players/1628983` the news card shows real SGA articles (or the empty state if the API has none for him — try `/players/1627936` too); each title opens the source site.

### Step 6: Explore page news

Rewrite `components/explore/nba-news.tsx` as an async server component using `fetchNewsArticles()` from `lib/data/news.ts`, same empty-state/link treatment, keeping the existing Card/Carousel layout. In `app/(main)/explore/page.tsx`, ensure it's inside `<Suspense>` (add a simple skeleton reusing `PlayerNewsSkeleton` if none exists) and a `SectionErrorBoundary`.

**Verify**: `/explore` shows live league news; `npx tsc --noEmit` → exit 0.

### Step 7: Unit tests

Create `lib/data/news.test.ts` (mock `fetch` with `vi.stubGlobal`): ok-response maps and filters malformed items; non-ok response throws; empty article array returns `[]`. Note `lib/data/news.ts` has `import 'server-only'` — add `vi.mock('server-only', () => ({}))` at the top of the test (first use of this in the repo; keep the mock local to this test file).

**Verify**: `npm test` → all pass.

## Test plan

Step 7 unit tests + the Step 4 forced-throw isolation check + manual pass on `/players/1628983`, `/players/1627936`, `/explore` (loading skeletons visible on throttled reload, real articles, empty states, no console errors). Gate: `npx tsc --noEmit && npm run lint && npm test` → exit 0.

## Done criteria

- [ ] `npx tsc --noEmit`, `npm run lint`, `npm test` all exit 0
- [ ] `grep -rn "fetchPlayerNews" app components lib` → no matches (mock gone)
- [ ] Player news shows real, player-filtered articles with working links, or "No recent news for this player."
- [ ] Forcing an error in one section leaves the other sections rendering (Step 4 check)
- [ ] Explore news no longer hardcoded
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- Step 1 shows the API key is missing/expired (401/403/null) — operator must fix env before this plan can proceed.
- The RapidAPI response shape doesn't match `newsArticleSchema` at all (API changed) — report the actual payload.
- Per-player filtering via `?player=first-last` returns obviously wrong articles (API matching too fuzzy) — report with examples instead of inventing client-side name matching.
- `page.tsx` sections don't match the expected structure (earlier plans changed it differently than described).

## Maintenance notes

- **Deferred: "Load more"** — requires converting the news section to a client component with TanStack Query and a `limit` state; do it when product actually asks for >10 articles. Flag for a follow-up Linear issue.
- The news API is rate-limited (RapidAPI plan-dependent); `noStore()` means every page view hits it. If quota becomes a problem, swap `noStore()` for `unstable_cache` with a ~15-min revalidate.
- `RAPID_API_KEY` exists only in `.env.local`/Vercel — CLAUDE.md table doesn't list it; operator should add it to the env-vars table when confirmed working.
- Reviewer: check every fallback Card carries the right grid-span classes; a missing span collapses the page grid.
