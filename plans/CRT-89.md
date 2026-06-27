# Plan CRT-89: Wire the watchlist button for real and stub the invest handoff

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat c70fb52..HEAD -- components/player/ app/(main)/players/ app/(main)/actions/ server/db/schema/ lib/data/`
> Diffs from CRT-84..88 are expected. Re-read `player-detail-static.tsx`,
> `player-ticker.tsx`, and `page.tsx` before editing.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED-HIGH (new DB table on a production database; migration application requires operator approval)
- **Depends on**: plans/CRT-84.md; CRT-88's sign-off recommended first (ticket ordering)
- **Category**: direction (feature)
- **Planned at**: commit `c70fb52`, 2026-06-10
- **Linear**: https://linear.app/ciceroapp/issue/CRT-89

## Why this matters

The player page is where investment decisions happen, and its two CTAs are currently dead: "Add to Watchlist" (`player-detail-static.tsx`) is a static button with no handler, and Buy/Sell (`player-ticker.tsx`) have no onClick at all. This plan ships the watchlist end-to-end (table → data layer → server action → optimistic button) and establishes the invest handoff contract — a modal stub that receives `playerId` + current PR Score, which CRT-90 (buy modal, not in this batch) will fill in.

**Scope honesty against the ticket's ACs:** "Invest button opens the buy modal" → opens the *stub* dialog with correct data plumbed (CRT-90 builds the real content). "Button shows Invested state if user holds a position" → **deferred to CRT-90** (the `transactions` table has 0 rows and no buy flow exists to create positions). "Disabled when not authenticated" → all routes under `app/(main)/` are already session-gated by `app/(main)/layout.tsx`, so an unauthenticated user never sees these buttons; the server action still re-checks the session (defense in depth, matching `followActions.ts`).

## Current state

- **No `watchlist` table exists** — verified against the live Neon DB (project `twilight-river-76263451`) on 2026-06-10. `transactions` exists (`server/db/schema/transactions.ts`) with 0 rows.
- The repo has an exact analog to copy for every layer of this feature — the follow system:
  - Schema with composite PK: `server/db/schema/follows.ts`

    ```ts
    export const follows = pgTable(
      'follows',
      {
        follower_id: text('follower_id').references(() => users.id).notNull(),
        following_id: text('following_id').references(() => users.id).notNull(),
        created_at: timestamp('created_at').defaultNow().notNull(),
      },
      (table) => [primaryKey({ columns: [table.follower_id, table.following_id] })],
    );
    ```
  - Server actions with session guard: `app/(main)/actions/followActions.ts` (`'use server'`, `auth.api.getSession({ headers: await headers() })`, throw `'Unauthorized'`, call data layer, `revalidatePath`).
  - Optimistic client button: `components/profile/follow-button.tsx` (`useState` + `useTransition`, flip state immediately, revert in catch).
  - Data layer: `lib/data/follows.ts`.
- The static button to replace, `components/player/player-detail-static.tsx:46-48`:

  ```tsx
  <Button variant={'secondary'} className="hover:bg-secondary/80">
    Add to Watchlist
  </Button>
  ```
- Buy/Sell buttons: `components/player/player-ticker.tsx` — `PlayerTicker({ lastGamePrScore })`, two `<Button>`s with no handlers. The ticker is rendered inside the stats chart card (CRT-86's `stats-chart.tsx` after that plan lands).
- The page (`app/(main)/players/[id]/page.tsx`) does not currently load the session — it will need it for the initial watchlist state. `users.id` is `text`; `players.id` is `integer`.
- The current PR Score for the invest payload: `player.cicero_score` (string | null — Postgres numeric) already fetched in `fetchPlayerDataByID`.
- Migrations: `npm run generate` writes SQL to `server/db/drizzle/`. **`npm run db:push` and applying migrations hit the production DB and require operator approval** (CLAUDE.md "Things to ask before doing"). Historical `db:push` use means `generate` may also emit catch-up DDL — inspect before committing.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Unit tests | `npm test` | all pass |
| Generate migration | `npm run generate` | new SQL file in `server/db/drizzle/` — INSPECT IT (Step 2) |
| Apply schema | `npm run db:push` | **NEVER run yourself — operator only** |
| Dev server | `npm run dev` | http://localhost:3000 (production DB) |

## Scope

**In scope**:
- `server/db/schema/watchlist.ts` (create)
- one new migration file via `npm run generate` (create only — never edit committed ones)
- `lib/data/watchlist.ts` (create)
- `app/(main)/actions/watchlistActions.ts` (create)
- `components/player/watchlist-button.tsx` (create)
- `components/player/invest-button.tsx` (create — stub dialog)
- `components/player/player-detail-static.tsx` (swap static button)
- `components/player/player-ticker.tsx` (wire Buy to InvestButton; Sell stays disabled with tooltip "Selling arrives with portfolio support")
- `app/(main)/players/[id]/page.tsx` (load session + initial watchlist state, pass props)
- `plans/README.md` (status row)

**Out of scope**:
- The real buy modal, position checks, "Invested"/"Add More" states — CRT-90.
- `components/profile/watchlist.tsx` / `watchlist-card.tsx` (profile-page portfolio display — separate backlog item; today they're placeholders reading nothing).
- `transactions` schema changes.
- Running `db:push` or any DDL against the DB yourself.

## Git workflow

- Branch: `crt-89-confirm-invest-and-watchlist-buttons-hand-off-correctly-to` off latest `main`.
- Commits: `feat(watchlist): schema and migration`, `feat(watchlist): data layer and toggle action`, `feat(player): watchlist and invest buttons`. No `Co-Authored-By`.
- Do not push without operator approval.

## Steps

### Step 1: Watchlist schema

Create `server/db/schema/watchlist.ts`, modeled field-for-field on `follows.ts`:

```ts
import { pgTable, text, integer, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';
import { players } from './players';

export const watchlist = pgTable(
  'watchlist',
  {
    user_id: text('user_id').references(() => users.id).notNull(),
    player_id: integer('player_id').references(() => players.id).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.user_id, table.player_id] })],
);
```

**Verify**: `npx tsc --noEmit` → exit 0

### Step 2: Generate the migration — inspect before committing

Run `npm run generate`. Open the new file in `server/db/drizzle/`. Expected contents: `CREATE TABLE "watchlist" ...` with the two FKs and composite PK, possibly plus `ALTER TABLE "player_stats" ALTER COLUMN "is_mock" SET NOT NULL;` (a known, harmless leftover if CRT-84 landed without generating).

If the file contains ANY other DDL (drops, alters of Combine-owned tables `players`/`player_stats`/`player_averages`/`teams`, etc.): delete the generated file and STOP — the snapshot has drifted from production and the operator must reconcile.

Then **ask the operator** to apply it (their call whether `npm run db:push` or SQL in the Neon console; production DB). Do not proceed to Step 5's live verification until they confirm. Steps 3–4 (pure code) may proceed meanwhile.

**Verify**: migration file reviewed; operator request sent; `git status` shows only the new migration file under `server/db/drizzle/`.

### Step 3: Data layer + server action

`lib/data/watchlist.ts` (`import 'server-only'`, model `lib/data/follows.ts`):
- `isOnWatchlist(userId: string, playerId: number): Promise<boolean>`
- `addToWatchlist(userId, playerId)` — insert with `.onConflictDoNothing()` (idempotent)
- `removeFromWatchlist(userId, playerId)` — delete by both keys

`app/(main)/actions/watchlistActions.ts` (`'use server'`, model `followActions.ts` exactly — session via `auth.api.getSession({ headers: await headers() })`, throw `Error('Unauthorized')` when absent):
- `toggleWatchlist(playerId: number): Promise<{ watching: boolean }>` — check `isOnWatchlist`, add/remove accordingly, `revalidatePath('/players/[id]', 'page')`, return the new state.

**Verify**: `npx tsc --noEmit` → exit 0

### Step 4: Buttons

`components/player/watchlist-button.tsx` — `'use client'`, props `{ playerId: number; initialIsWatching: boolean }`, modeled line-for-line on `components/profile/follow-button.tsx` (optimistic flip + `useTransition` + revert on catch). Labels: `+ Watchlist` / `✓ Watching`. Keep `variant="secondary"` to match the button it replaces.

`components/player/invest-button.tsx` — `'use client'`, props `{ playerId: number; currentPrice: number | null }`. A `Dialog` (from `components/ui/dialog.tsx`) whose trigger is the Buy button UI (primary, full-width — match the current ticker button styling: `className="w-full rounded-md text-lg md:h-10 md:text-base"`, `size="lg"`). Dialog content (the CRT-90 contract): title "Invest in this player", a line showing `Current PR price: {currentPrice?.toFixed(1) ?? 'unavailable'}`, body "The buy flow is coming soon (CRT-90).", and a disabled "Confirm purchase" button. When `currentPrice` is null, the trigger is disabled with a tooltip "No current PR Score — investing unavailable".

Wire-up:
- `player-detail-static.tsx`: replace the static button with `<WatchlistButton playerId={player.id} initialIsWatching={initialIsWatching} />`; add `initialIsWatching: boolean` to its props.
- `page.tsx`: load `const session = await auth.api.getSession({ headers: await headers() })` (import pattern from `app/(main)/users/[username]/page.tsx`), compute `const watching = session?.user ? await isOnWatchlist(session.user.id, playerId) : false`, pass down.
- `player-ticker.tsx`: replace the dead Buy `<Button>` with `<InvestButton playerId={playerId} currentPrice={...} />` — the ticker needs `playerId` and the price as new props; the stats chart (its host) already has both (`useParams` id + prScore data; pass `Number(player.cicero_score)` equivalent or `lastGamePrScore` — use `lastGamePrScore` since that's what the ticker already displays as the price-like number). Sell button: `disabled` + tooltip.

**Verify**: `npx tsc --noEmit` → exit 0; `grep -n "Add to Watchlist" -r components` → no matches.

### Step 5: Live verification (after operator applies the migration)

On `/players/1628983` signed in:
1. Click `+ Watchlist` → flips to `✓ Watching` instantly; reload the page → still `✓ Watching` (persisted).
2. Click again → reverts; reload → persisted off.
3. Confirm the row appears/disappears: ask the operator to check `SELECT * FROM watchlist;` (or use `npm run studio`).
4. Buy → dialog opens showing the correct PR price for the player; Confirm is disabled. Sell is disabled with tooltip.
5. No console errors.

**Verify**: all five observations hold.

## Test plan

- Pure-logic surface is thin (the action is session+DB glue); unit-test candidate per CLAUDE.md: none worth a DB mock — skip unit tests, rely on the live checks above. (Flag in the PR: once CRT-90 adds price math, that becomes the Vitest candidate.)
- Gate: `npx tsc --noEmit && npm run lint && npm test` → exit 0 (existing tests keep passing).

## Done criteria

- [ ] `npx tsc --noEmit`, `npm run lint`, `npm test` all exit 0
- [ ] Migration file contains only the expected DDL and the operator has applied it
- [ ] Watchlist toggle persists across reloads (Step 5.1–5.3)
- [ ] Invest stub opens with correct `playerId`/price plumbed; Sell disabled
- [ ] `git status` — no files outside the in-scope list
- [ ] `plans/README.md` status row updated (note CRT-90 deferred items)

## STOP conditions

Stop and report back if:

- `npm run generate` emits unexpected DDL (Step 2 — snapshot drift; operator must reconcile before any schema work continues).
- The operator hasn't applied the migration — do Steps 3–4, then mark BLOCKED in `plans/README.md`; never apply it yourself.
- A `watchlist` (or similarly-purposed) table already exists in the DB or schema dir — the plan's premise is stale; report.
- `player-ticker.tsx`'s host no longer supplies a usable price value after CRT-86 — report rather than threading new data through the page.

## Maintenance notes

- CRT-90 replaces the stub dialog's content and owns: position checks ("Invested"/"Add More"), writing `transactions`, and price-at-purchase semantics. The stub's props (`playerId`, `currentPrice`) are the agreed handoff contract — changing them breaks that ticket's assumption.
- The profile-page `watchlist.tsx` placeholder should eventually read this table (dashboard/portfolio backlog items reference it).
- Reviewer: check the optimistic revert path (kill the network in devtools, click toggle, confirm it reverts) and that `revalidatePath` doesn't fight the optimistic state visibly.
