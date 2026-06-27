# Plan CRT-78: Settings dialog — theme preference and account settings

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat c70fb52..HEAD -- components/profile/user-settings-dialog.tsx components/theme/ components/layout/nav.tsx components/layout/mobile-nav.tsx app/(main)/users/`
> If these changed since the plan was written, compare the "Current state"
> excerpts before proceeding; on a mismatch, STOP.

## Status

- **Priority**: P3 (independent of the player-page chain; schedule anytime)
- **Effort**: S-M
- **Risk**: LOW (UI-only; no DB, no schema)
- **Depends on**: none
- **Category**: dx/UX
- **Planned at**: commit `c70fb52`, 2026-06-10
- **Linear**: https://linear.app/ciceroapp/issue/CRT-78

## Why this matters

A settings dialog exists (`components/profile/user-settings-dialog.tsx`) but it's skeletal — a single "Appearence" (sic) row with a light/dark dropdown (system option commented out) and a logout button — and it's only reachable from your own profile page via an unlabeled `MoreVertical` icon. The ticket wants: light/dark/**system** selection that persists, an Account section (email read-only, link to profile editing, sign out), and the dialog reachable from the nav. Everything needed already exists in the repo; this is assembly work.

## Current state

- `components/profile/user-settings-dialog.tsx` — `'use client'`, exports `UserSettings({ user }: { user: User })`. Radix `Dialog` whose `DialogTrigger` is a hardcoded-styled `MoreVertical` icon button; content holds one labeled row ("Appearence" — typo to fix) with `<ModeToggle />`, then `<LogoutButton>Logout</LogoutButton>`. Everything sits inside `DialogHeader` (structurally wrong — content rows belong outside the header).
- `components/theme/dark-mode-toggle.tsx` — `ModeToggle`: dropdown with Light/Dark items; the System item is commented out (lines 38-40).
- Theme plumbing: `ThemeProvider` (next-themes) is mounted in `app/(main)/layout.tsx`, `app/(public)/layout.tsx`, and `app/(public)/(with-nav)/layout.tsx` with `attribute="class" defaultTheme="system" enableSystem` — so `setTheme('system')` already works and next-themes persists to localStorage natively. No new persistence code needed.
- `User` type (`lib/definitions.ts`) = `InferSelectModel<typeof users>`; `users.email` is `text NOT NULL` — `user.email` is available for the read-only display.
- `EditProfileDialog` (`components/profile/edit-profile-dialog.tsx`) — existing self-triggering dialog for profile editing (CRT-77, Done). On the profile page it renders as a sibling of `UserSettings` (`app/(main)/users/[username]/page.tsx:100-103`, own-profile branch).
- `LogoutButton` (`components/auth/logout-button.tsx`) — existing.
- Nav: `components/layout/nav.tsx` — server component; `DynamicUserProfile` loads the session + `getCiceroUser(user.id)` (a full `User` row) and renders the avatar. There's also `components/layout/mobile-nav.tsx` (read it before editing — it receives the user section as props/children from `nav.tsx`).
- **No Tabs component exists** in `components/ui/` and `@radix-ui/react-tabs` is not installed; installing needs operator approval. The ticket says "tabbed layout"; this plan uses two titled sections separated by `Separator` (`components/ui/separator.tsx`, already present) — same user value, zero new dependencies. Radio group for theme: `components/ui/radio-group.tsx` already exists (`@radix-ui/react-radio-group` installed).
- Conventions: semantic Tailwind colors only; kebab-case files; named exports; `'use client'` only where needed.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Dev server | `npm run dev` | http://localhost:3000 |

## Scope

**In scope**:
- `components/profile/user-settings-dialog.tsx` (rework)
- `components/theme/theme-radio-group.tsx` (create)
- `components/layout/nav.tsx`, `components/layout/mobile-nav.tsx` (add Settings entry point)
- `components/theme/dark-mode-toggle.tsx` (un-comment the System item — it remains used elsewhere, keep it consistent)
- `plans/README.md` (status row)

**Out of scope**:
- A `/settings` page (ticket explicitly wants dialog-only).
- Server-side theme persistence (next-themes localStorage is the ticket's stated mechanism).
- `EditProfileDialog` internals; auth flows; any new dependency (no radix-tabs).
- `app/(main)/users/[username]/page.tsx` — the profile-page trigger keeps working unchanged via the default trigger.

## Git workflow

- Branch: `crt-78-implement-settings-dialog-theme-preference-and-account` off latest `main`.
- Commits: `feat(settings): theme radio group with system option`, `feat(settings): account section and nav entry point`. No `Co-Authored-By`.
- Do not push without operator approval.

## Steps

### Step 1: Theme radio group

Create `components/theme/theme-radio-group.tsx` — `'use client'`, named export `ThemeRadioGroup`. Use `RadioGroup`/`RadioGroupItem` from `components/ui/radio-group.tsx` with options Light / Dark / System bound to `useTheme()`:

```tsx
const { theme, setTheme } = useTheme();
// guard hydration: render after mounted (copy the mounted-state idiom from components/theme/theme-provider.tsx)
<RadioGroup value={theme} onValueChange={setTheme} className="flex gap-4">
  {/* one RadioGroupItem + Label per option: light / dark / system */}
</RadioGroup>
```

Also un-comment the System `DropdownMenuItem` in `components/theme/dark-mode-toggle.tsx`.

**Verify**: `npx tsc --noEmit` → exit 0

### Step 2: Rework the settings dialog

Rework `components/profile/user-settings-dialog.tsx`:

- Props: `{ user: User; trigger?: ReactNode }`. Render `<DialogTrigger asChild>{trigger}</DialogTrigger>` when provided; otherwise keep the current `MoreVertical` trigger markup exactly (the profile page keeps working without changes).
- Structure: `DialogHeader` holds only title "Settings" + description "Make changes to your Prospect Portfolio experience."; below it, two sections separated by `<Separator />`:
  - **Appearance** (fix the "Appearence" typo): section heading, helper text "Choose your color theme", `<ThemeRadioGroup />`. Theme applies immediately on selection; no save button.
  - **Account**: rows for Email — `<span className="text-muted-foreground text-sm">{user.email}</span>` (read-only); Profile — render `<EditProfileDialog user={user} />` (it brings its own trigger; nested Radix dialog roots are independent and this works); Sign out — the existing `<LogoutButton>Logout</LogoutButton>`.

Accessibility comes free from Radix Dialog (focus trap, Escape, outside-click) — verify rather than build.

**Verify**: `npx tsc --noEmit` → exit 0; on your own profile page (`/users/<your-username>`) the dialog opens with both sections, theme switches live, email shows.

### Step 3: Nav entry point

In `components/layout/nav.tsx` `DynamicUserProfile`: the section already fetches `ciceroUser`. Wrap the avatar area in a `DropdownMenu` (from `components/ui/dropdown-menu.tsx`) with items "Profile" (Link to `/users/${ciceroUser.username}`) and "Settings" — where Settings renders `<UserSettings user={ciceroUser} trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Settings</DropdownMenuItem>} />`. (The `onSelect` preventDefault stops the dropdown from closing-and-unmounting the dialog — the standard shadcn dialog-in-dropdown pattern.) Mirror an equivalent entry in `mobile-nav.tsx` after reading how it receives the user section. If `ciceroUser` is null (unauthed public nav case), render nothing new.

Note: a `DropdownMenuItem` as a `DialogTrigger` child requires the trigger to use `asChild` — already handled in Step 2's `trigger` prop implementation.

**Verify**: `npx tsc --noEmit` → exit 0; in the browser, avatar dropdown → Settings opens the dialog from `/dashboard` (a page that isn't the profile page); Escape closes it; theme choice survives a hard reload (`localStorage.theme` set by next-themes).

### Step 4: Full acceptance pass

- Light → Dark → System each apply instantly and persist across reload (System follows the OS setting — toggle the OS theme to confirm).
- Account section: email correct, EditProfileDialog opens from inside Settings, Logout signs out and redirects.
- Keyboard: Tab cycles within the dialog (focus trap), Escape closes.
- Both light and dark renderings look right (semantic color classes only — no `bg-white`/`text-black` in any touched file).

**Verify**: all pass; `npm run lint` → exit 0.

## Test plan

UI assembly — no unit-test candidates per CLAUDE.md's bar (no pure logic). Gate: `npx tsc --noEmit && npm run lint` → exit 0 plus the Step 4 manual matrix.

## Done criteria

- [ ] `npx tsc --noEmit` and `npm run lint` exit 0
- [ ] Theme light/dark/system selectable in the dialog and persists on reload
- [ ] Account section shows email, opens profile editing, signs out
- [ ] Dialog reachable from the nav avatar dropdown on any `(main)` page AND still from the profile page
- [ ] `grep -n "Appearence" -r components` → no matches (typo fixed)
- [ ] No new dependencies (`git diff package.json` → empty)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- Nesting `EditProfileDialog` inside the settings dialog misbehaves (focus fights, scroll lock leaks) — fall back to a plain Link to the profile page and note the deviation.
- `mobile-nav.tsx`'s structure can't host the dropdown without restructuring it — ship the desktop entry point and report the mobile gap instead of refactoring mobile-nav.
- You're tempted to install `@radix-ui/react-tabs` — don't; sections are the approved layout. If the operator insists on literal tabs, that's their dependency call.
- `getCiceroUser` in the nav doesn't actually return a full `User` row (check `lib/data/users.ts` first) — report what it returns.

## Maintenance notes

- If account settings grow (email change, deletion, notification prefs), that's when the dialog graduates to real tabs or a `/settings` page — revisit the no-tabs decision then.
- The `trigger` prop makes `UserSettings` reusable; future entry points should pass their own trigger rather than duplicating the dialog.
- Ticket deviation to note in the PR: "tabbed layout" implemented as two titled sections to avoid a new dependency; all ACs still met.
