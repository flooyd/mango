# Handoff · Dota Replay Navigation

A redesign of the Mango replay navigator: matches list, match detail, kill log, plus polished theming, empty, and loading states.

This package is intended to be implemented in the existing **Svelte 3 + TypeScript + Rollup** client in `client/` (where today's `App.svelte`, `Header.svelte`, etc. live). It keeps the existing data model and Dota 2 navigation API and replaces the UI layer.

---

## 1 · About the design files

The files in `source/` are **HTML/JSX design references** — they are working prototypes that show the intended look, behavior, and interaction model, but they are **not production code to copy verbatim**. They use React + Babel-in-browser because that's the fastest way to mock interactive UI on a canvas.

Your task is to **recreate these screens as Svelte components** in the existing client codebase, reusing the existing API (`http://localhost:8080/...`) and stores (`selectedMatch`, `selectedHero`, `dotaWindow`, `mapTime`).

To run the prototype locally:
- `prototype-standalone.html` — self-contained, double-click to open in any browser. Use this for visual reference and to verify behavior.
- `source/Interactive Prototype.html` — same prototype, split into editable files. Open via a local server (`npx serve source/`).

---

## 2 · Fidelity

**High-fidelity.** Final colors, typography, spacing, and interactions are specified. Recreate pixel-faithfully using the existing `client/public/global.css` token system extended with the tokens in §7.

There are also wireframe and static hi-fi canvases (`source/Wireframes.html`, `source/Hi-fi Designs.html`) included for reference on design intent — they are not part of the implementation target.

---

## 3 · Scope

### In scope
- Matches list (replacing `Replays.svelte` / `Match.svelte`)
- Match detail · Teams tab (replacing `MatchDetails.svelte` / `MatchDetailsTeams.svelte` / `TableHero*`)
- Match detail · **Kill Log tab** (new)
- Header refresh + profile dropdown (replacing `Header.svelte`)
- Empty state (no replays)
- Loading state (parsing queue) — indeterminate per-row, NOT a realtime progress bar
- Light + dark theme + toggle (persisted)
- Hero filter on matches list
- Sort by date / duration / total kills

### Out of scope — DELETE these features
- `MapVisualization.svelte` (map / minimap view)
- `MiniMap.svelte`
- `Chat.svelte` (PiP / chat overlay)
- Any "Map View" / "Picture-in-Picture" UI surfaces
- Rank / MMR display in the profile (do not track it)

### Behavior unchanged
- Clicking a kill chip calls the existing `mapTime` → `console` bridge to jump Dota 2 to that tick.
- "Open in Dota 2" and "Bring to top" hit the same `/navigation/*` endpoints (`bring-to-top`, `get-window`).
- Parsing/reparsing uses whatever backend route exists today.

---

## 4 · Screens

### 4.1 — Header (always-visible)

**Layout:** 60px tall, full-width, bottom border. Brand left, status + controls right.

| Element | Spec |
|---|---|
| Brand `"Dota Replays"` | Crimson Pro 900, 22px, `linear-gradient(180deg, --text-1 → --text-2)` clipped to text |
| Version chip `"v 0.4.2"` next to brand | JetBrains Mono 10px, `--text-3`, letter-spacing 0.1em |
| Connection status | mono 11px, `--text-2`. Includes a 7px dot. Idle: gray dot. Connected: `--radiant` dot with a pulsing 3px box-shadow (`@keyframes pulse` 50% opacity at midway). |
| "Bring to top" button | Visible only when Dota 2 is running. `.btn.sm` style. POSTs to `/navigation/bring-to-top` |
| Vertical divider | 1px × 18px, `--line-strong` |
| Theme toggle | Segmented pill: `LIGHT` / `DARK`, with `☀`/`☾` glyphs. Active segment: `--bg-5` background, `--text-1` color. Inactive: `--text-3` color, transparent bg. Persisted to localStorage. |
| Profile chip | Hero portrait icon (28px, `philly`'s hero), name in mono 11px, dropdown caret. Click opens dropdown. |
| Profile dropdown (232px wide) | `--bg-3`, 1px `--line-strong` border, 6px radius, `--shadow-lg`. Contains: user block (avatar 36px + name + steam ID, **no rank**), then rows: Theme (with value), Settings, Reparse all, Replay folder…, Help & shortcuts. Divider. Log out (in `--dire` color). Each row 7px×8px padding, 3px radius, hover bg `--bg-4`. |

**Status text variants:**
- Idle: `"Dota 2 not running"`
- In menu: `"Dota 2 running · In Menu"`
- In replay: `"Dota 2 running · Watching Replay"` (automatically when route is `match/*`)

---

### 4.2 — Matches list

**Toolbar (60px tall, 20×28 padding):**
- Title "Replays" (Crimson Pro 700, 28px)
- Match count: bold mono 18px + `MATCHES` label (mono 10px, `--text-3`)
- Vertical divider
- **Hero filter pill**: `⌕ HERO  All heroes  ▾`. When a hero is selected, swap the magnifier for the hero icon and show the hero name. Includes `✕` to clear. Click opens 340px dropdown with 8-col grid of hero icons (32px each). Selected hero has 2px `--blue` outline.
- **Sort pill**: `SORT  Date  ▾`. Options: Date (newest), Duration, Total kills.
- Density toggle (right side): segmented `▦ CARDS` / `☰ ROWS`. Persisted.

**Density A · Cards (3-col grid, 16px gap):**

Each card (`.card`, 16px padding):
```
┌─────────────────────────────────────────┐
│ MATCH ID                  [parse badge] │
│ 8716431727        [reparse btn on hover]│
│                                         │
│ 38 – 24            RADIANT VICTORY      │
│ (28px mono, R/G/text-2)  (10px label)   │
│                                         │
│ [41:27] [Ranked AP] [FB 01:18]          │
│                                         │
│ 222.4K   NET WORTH        173.6K        │
│ ████████████████░░░░░░░░░░░░░░░░        │
│                                         │
│ [H][H][H][H][H]  VS  [H][H][H][H][H]    │
│                                         │
│ ─────────────────────────────────────── │
│ Ended 03-05-2026 03:21:35 AM            │
└─────────────────────────────────────────┘
```

- Hover: border becomes `--blue`, +1px outer ring, translateY(-1px), shadow-md. "Reparse" button appears in the top-right corner next to the parse badge.
- Click card → navigate to match detail.
- Winning team's score: `--radiant` or `--dire`. Loser's score: `--text-2`.
- Net worth bar: 4px tall, two `<div>`s flex-sized by `rad / (rad+dire)` and `dire / (rad+dire)`, colors `--radiant` and `--dire`.
- Lineup: 5 × 32px hero icons + `VS` (mono 9px, `--text-3`) + 5 × 32px hero icons. Hero icons from `https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/icons/<hero_key>.png` (already used in `util.ts`).

**Density C · Rows (vertical list, 6px gap):**

Each row (`.card`, 0 padding, accent bar on left):
- 3px wide accent bar on left edge, `--radiant` or `--dire` (winning team), 0.85 opacity
- Strip: result label (78px) → match ID (110px) → score (88px) → duration pill → mode pill → `FB <time>` → ml-auto → lineup → date (88px, right-aligned) → caret
- Click row toggles expanded state.
- Expanded: 14×22 padding, `--bg-3` background, dashed `--line` top border. Contains net-worth bar (max-width 320), top 2 performers (hero icon + name + KDA), and `[Reparse] [Open match →]` action buttons (right-aligned).
- "Open match →" navigates to detail.

---

### 4.3 — Match detail

**Match header (24×28 padding, bottom border):**
- `[← Back to replays]` ghost button, then divider, then `"Match"` (serif 26px) + blue ID pill.
- Right side: `[↻ Reparse]` and (if running) `[Open in Dota 2 →]` primary button.
- Below: summary line with VICTORY label, big score, divider, pills (duration, mode, FB), "Ended <timestamp>".

**Tabs (just below header):**
- `▤ Teams` (default)
- `☰ Kill Log` with a numeric badge showing kill count
- Active tab: `--text-1` color, 2px `--blue` underline. Inactive: `--text-3`.

#### Teams tab

Two cards stacked, 18px gap. Each card has a team header followed by a 10-column table.

**Team header (`.team-header.radiant` / `.dire`):**
- 14×18 padding, bottom border
- 3px left accent stripe (radiant/dire color, glowing box-shadow)
- Radiant: `linear-gradient(90deg, --radiant-soft 0%, transparent 60%)` background
- Contents: team name (Crimson Pro 800, 18px, color + uppercase), kill count (mono 22px), `KILLS` label
- Right: Net worth, Towers, GPM avg, XPM avg — each as a 2-line "label / value" stack

**Table columns (in order):**

| Column | Width | Format |
|---|---|---|
| Hero | 220 | 44px portrait + hero name (sans 600 13px) + player name (mono 10px, `--text-3`) |
| LVL | 38 | mono 12px, right-aligned, weight 600 |
| K / D / A | 110 | mono 12px, slashes in `--text-3`. Add `FB` pill (`.pill.dire`) when `row.fb === true` |
| LH / DN | 78 | mono 12px, DN in `--text-3` |
| GPM | 60 | mono 12px, right-aligned |
| XPM | 60 | mono 12px, right-aligned |
| Net W. | 80 | mono 12px, right-aligned, weight 600 |
| KP % | 110 | 4px bar + `<value>%`. Color: `--radiant` if ≥60, `--text-1` if ≥40, else `--dire`. |
| Items | flex | 6 × 24px item slots, 4px gap. Empty slot = striped placeholder. |
| (caret) | 22 | up/down indicator |

Row click → expand the row → inject a row below containing the **per-row kill strip** (see §4.4). Click again to collapse. Multiple rows can be expanded simultaneously.

#### Kill Log tab

A separate filterable, sortable table of every kill in the match.

**Filter bar (14×18 padding, bottom border):**
- Side toggle (segmented): `Both` / `Radiant` (colored `--radiant`) / `Dire` (colored `--dire`)
- `Killer` dropdown — hero picker (220px wide dropdown w/ scrollable hero list w/ R/D badge)
- `Victim` dropdown — same
- Inflictor type segmented toggle: `Any` / `Attack` / `Ability` / `Item`
- Far right: `"<filtered> of <total> kills"` then `Clear filters` button (visible only when any filter is set)

**Columns:**

| # | Time ↑/↓ | Killer | → | Victim | Inflictor | Side | Tick | (jump) |
|---|---|---|---|---|---|---|---|---|

- Time column is sortable (asc/desc, default asc). Click header to toggle.
- Killer/Victim columns also sortable by hero name.
- Each killer/victim cell: 26px hero icon + hero display name.
- First-blood kill gets a `FIRST BLOOD` red pill next to the killer.
- Inflictor cell shows the 22px ability/item icon or `ATK` chip + the slug in human-readable form (mono 10px, `--text-2`).
- Side pill: `RAD` / `DIRE` in team color.
- Tick: mono right-aligned, `--text-3`.
- Last column: `JUMP →` (mono 10px). `--text-3` at rest, `--blue` on row hover.
- Row click anywhere → jump Dota 2 to that tick (same action as the per-row kill chips).

Empty filter result: centered "No kills match these filters." message.

---

### 4.4 — Kill chips (used in Teams tab expansions)

When a player row is expanded, a strip injects below it showing every kill that hero made.

**Strip container:** `padding: 12px 18px 14px 92px` (left padding aligns chips with hero name), `--bg-3` background, top border.

**Chip anatomy:**
```
[inflictor]  →  [victim]   12:45
   22px         22px       mono 10px
```

- Inflictor is one of three types:
  - **ability**: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/<ability_key>.png`
  - **item**: existing item icon URL from `util.ts`
  - **attack**: gray `ATK` text chip (22×16.5, mono 8px, `--text-3`)
- Arrow: 4px caret pointing right, `--text-3`
- Victim: hero icon 22px
- Time: `MM:SS`, mono 10px, `--text-3`

**States:**
- Rest: `--bg-2` bg, 1px `--line` border, no shadow
- Hover: `--bg-4` bg, 1px `--blue` border, 2px `--blue-soft` outer ring + `--shadow-sm`

**Click:** Calls existing replay-jump action (whatever route Mango uses today — currently appears to be a console command via the local server).

---

### 4.5 — Empty state

Centered, ~580px max width.

- Decorative stack of 3 cards (1 main + 2 rotated behind it) showing a mini schematic of a match card
- Heading: Crimson Pro 800 28px "No replays yet"
- Body: sans 14px, `--text-2`, max 460px wide
- Path chip: mono 11px box showing the Steam replays folder path
- `[Choose replay folder…]` primary button + `[Scan default location]` secondary
- Divider, then "Or paste a Match ID" with an input + `[Fetch]` button

---

### 4.6 — Loading / parsing state

> **Critical:** This is NOT a realtime progress bar. We have no idea how long parsing will take. Each row is **indeterminate** — a spinner + stage label.

**Toolbar:**
- "Replays" title + status pill: `[spinner] PARSING REPLAYS · 1 of 6 done · 2 in progress`
- `[Cancel queue]` button on the right

**Each queued replay** is a `.card` row, 14×18 padding, 16px gap between elements:
- Status indicator (32px column):
  - Done: 22px circle, `--radiant-soft` bg, `--radiant` border + checkmark
  - Parsing: 18px CSS spinner (`@keyframes spin`)
  - Queued: 6px gray dot
- Match ID (130px) — "Match ID" label + mono 13px bold value
- Status (110px) — uppercase mono 11px in state color (rad/blue/text-3)
- Stage (flex) — current stage description in mono 11px. For parsing rows show `"Reading replay header…"`, `"Decoding game events…"`, etc. For done: `"Indexed 62 kills · ready"`. For queued: italic `"Waiting in queue…"`.
- Action: parsing → `[Cancel]` ghost; done → `[Open match →]` ghost; queued → `—`
- Parsing rows have `--blue` border + 1px outer ring AND a shimmer animation (`@keyframes shimmer`).

Below the list:
- Info banner: `[i] Parsing happens in the background — feel free to keep browsing. We'll surface each match as soon as it's ready.`
- 3 skeleton card placeholders at 50% opacity.

---

## 5 · Interactions & behavior

### Navigation
- Single-page; use Svelte's existing pattern (set `$selectedMatch` to switch views). The prototype uses hash routing — the Svelte app should keep using the existing store-based approach.
- "Back to replays" sets `$selectedMatch = null`.
- Clicking a card or row's "Open match" button sets `$selectedMatch = match`.

### Persistence (localStorage)
| Key | Value |
|---|---|
| `mango.theme` | `"dark"` \| `"light"` |
| `mango.density` | `"cards"` \| `"rows"` |
| `mango.sortBy` | `"date"` \| `"duration"` \| `"kills"` |

Hero filter and expanded-row state are session-only.

### Theme
- Apply `data-theme` attribute on `<html>` or `<body>`. CSS variables react. Toggle via header pill and via profile dropdown.

### Hover states
- Cards: see §4.2.
- Buttons: lift to `--bg-4` background; primary button uses `filter: brightness(1.08)`.
- Table rows: `--bg-3` background.
- Kill chips: see §4.4.
- All transitions: 120–180ms `ease`.

### Animations
- Status dot pulse: `@keyframes pulse { 50% { opacity: 0.55; } }`, 2s ease-in-out infinite.
- Spinner: `@keyframes spin { to { transform: rotate(360deg); } }`, 0.9s linear infinite.
- Shimmer (parsing card overlay): `@keyframes shimmer { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }`, 1.6s ease-in-out infinite, applied via `::after` with `linear-gradient(90deg, transparent, rgba(93,169,233,0.08), transparent)`.

### Click → jump Dota 2
Kill chips (Teams tab) and kill log rows (Kill Log tab) both call the same action: jump the running Dota client to that game tick. Use whatever endpoint exists today (current code uses a local Express server at `localhost:8080`).

---

## 6 · State

State variables needed at the app root:

```ts
theme: 'dark' | 'light'           // persisted
density: 'cards' | 'rows'         // persisted
sortBy: 'date' | 'duration' | 'kills'  // persisted
heroFilter: HeroKey | null         // session
expandedRows: Set<MatchID>         // session (for rows density)
selectedMatch: Match | null        // existing store
```

Per match detail view:
```ts
activeTab: 'teams' | 'log'
expandedPlayers: Set<HeroKey>      // multiple rows can be open
// Kill Log filters:
side: 'both' | 'rad' | 'dire'
killer: HeroKey | null
victim: HeroKey | null
inflictorType: 'any' | 'attack' | 'ability' | 'item'
sortCol: 'time' | 'killer' | 'victim'
sortDir: 'asc' | 'desc'
```

---

## 7 · Design tokens

Add these to `client/public/global.css`, or replace what's there. Full file: `source/hifi-tokens.css`.

### Palette — Dota R / B / G

**Dark:**
```css
--radiant:      #66BB6A;
--radiant-deep: #2E7D32;
--radiant-glow: rgba(102, 187, 106, 0.25);
--radiant-soft: rgba(102, 187, 106, 0.10);

--dire:         #E04E3F;
--dire-deep:    #A0392F;
--dire-glow:    rgba(224, 78, 63, 0.25);
--dire-soft:    rgba(224, 78, 63, 0.10);

--blue:         #5DA9E9;
--blue-deep:    #1F6FB4;
--blue-soft:    rgba(93, 169, 233, 0.12);
```

**Light (override R/B/G to more-saturated values for AA contrast):**
```css
--radiant:      #2D8A48;
--dire:         #C0392B;
--blue:         #2778C4;
```

### Surfaces

**Dark:**
```css
--bg-0: #0A0E14;  /* canvas */
--bg-1: #11161E;  /* page */
--bg-2: #161D27;  /* surface */
--bg-3: #1E2632;  /* surface raised */
--bg-4: #2A3441;  /* row hover */
--bg-5: #38465A;  /* control active */

--line:        rgba(255,255,255,0.06);
--line-strong: rgba(255,255,255,0.12);

--text-1: #E8EAEE;  --text-2: #A2A8B4;
--text-3: #6B7280;  --text-4: #3F4654;
```

**Light:**
```css
--bg-0: #EFF1F5;  --bg-1: #FAFBFC;
--bg-2: #FFFFFF;  --bg-3: #F4F6F9;
--bg-4: #E7EBF1;  --bg-5: #DAE0E9;

--line:        rgba(15,17,21,0.07);
--line-strong: rgba(15,17,21,0.14);

--text-1: #11161E;  --text-2: #4B5564;
--text-3: #7C8595;  --text-4: #B0B7C2;
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.40);
--shadow-md: 0 4px 16px rgba(0,0,0,0.32), 0 1px 2px rgba(0,0,0,0.40);
--shadow-lg: 0 12px 36px rgba(0,0,0,0.40), 0 2px 6px rgba(0,0,0,0.40);
/* Light theme uses softer, blue-tinted versions */
```

### Typography
```css
--serif: 'Crimson Pro', Georgia, serif;
--sans:  'IBM Plex Sans', system-ui, sans-serif;
--mono:  'JetBrains Mono', ui-monospace, monospace;
```

Use serif for headings ("Replays", "Match", "Radiant", "Dire", empty-state heading).
Use mono for IDs, times, numeric stats, labels.
Use sans for body, button labels, table headers, dropdown items.

Numeric stats should use `font-variant-numeric: tabular-nums`.

### Spacing & radii
- Card radius: 6px. Inner controls: 3–4px.
- Pills: 3px radius.
- Standard padding: 12–18px inside cards.
- Section padding: 28px horizontal.

### Pill style
Base: `.pill` — `--bg-3` bg, 1px `--line-strong` border, mono 10px, 2×7 padding, 3px radius. Variants:
- `.bare` — transparent bg
- `.blue` — `--blue` text, soft blue bg + border
- `.rad` — `--radiant` text, soft red-green bg + border
- `.dire` — `--dire` text, soft red bg + border

---

## 8 · Assets

All hero/item/ability icons load from Steam's CDN — the codebase already uses these URL patterns in `client/src/util/util.ts`:

```
Hero portrait: https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/<key>.png
Hero icon:     https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/icons/<key>.png
Item icon:     https://steamcdn-a.akamaihd.net/apps/dota2/images/items/<name>_lg.png
Ability icon:  https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/<key>.png
```

No new assets needed.

Fonts: load Crimson Pro, IBM Plex Sans, JetBrains Mono from Google Fonts (already used in current app).

---

## 9 · Svelte component map

Suggested re-org. Delete and replace where indicated.

| New Svelte component | Replaces | Notes |
|---|---|---|
| `Header.svelte` | itself | Major rewrite per §4.1 |
| `ThemeToggle.svelte` | (new) | |
| `ProfileChip.svelte` | (new) | Includes dropdown |
| `Replays.svelte` | itself | Becomes a toolbar + density switcher + grid |
| `MatchesToolbar.svelte` | (new) | |
| `HeroFilterDropdown.svelte` | (new) | |
| `MatchCard.svelte` | `Match.svelte` | The card density |
| `MatchRow.svelte` | (new) | The row density |
| `NetWorthBar.svelte` | (new) | |
| `MatchDetails.svelte` | itself | Owns tabs |
| `MatchHeader.svelte` | itself | Updated per §4.3 |
| `MatchTabs.svelte` | (new) | |
| `TeamsView.svelte` | `MatchDetailsTeams.svelte` | |
| `TeamCard.svelte` | (new) | Container for team header + table |
| `PlayerRow.svelte` | `TableHero.svelte` + `Player.svelte` | Expandable |
| `KpBar.svelte` | (new) | |
| `ItemSlots.svelte` | `TableHeroItems.svelte` | |
| `KillStrip.svelte` | `TableHeroKills.svelte` | List of `KillChip` |
| `KillChip.svelte` | `Kill.svelte` | Updated visual per §4.4 |
| `KillLog.svelte` | (new) | New tab |
| `KillLogFilters.svelte` | (new) | |
| `KillLogRow.svelte` | (new) | |
| `EmptyState.svelte` | (new) | |
| `LoadingState.svelte` | (new) | Per §4.6 — NOT a progress bar |
| `HeroIcon.svelte`, `ItemIcon.svelte`, `AbilityIcon.svelte` | (new) | Thin wrappers around the CDN URLs in `util.ts` |
| **Delete:** `MapVisualization.svelte`, `MiniMap.svelte`, `Chat.svelte` | | Map & PiP removed from product |

A starter scaffold for the most important components is included in `svelte-starters/`.

---

## 10 · Stores

Keep the existing stores; add `theme`, `density`, `sortBy` as new persisted stores. A reusable `persistedStore.ts` helper:

```ts
// client/src/stores/persisted.ts
import { writable } from 'svelte/store';
export function persisted<T>(key: string, initial: T) {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  const store = writable<T>(stored ? JSON.parse(stored) : initial);
  store.subscribe(v => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  });
  return store;
}
```

Then:
```ts
// client/src/stores/theme.ts
import { persisted } from './persisted';
export const theme = persisted<'dark' | 'light'>('mango.theme', 'dark');
```

And in `App.svelte`:
```svelte
<script lang="ts">
  import { theme } from './stores/theme';
  $: typeof document !== 'undefined' && document.documentElement.setAttribute('data-theme', $theme);
</script>
```

---

## 11 · Backend touches

Two endpoints likely already exist; verify and reuse:

- `GET  /navigation/get-window` → polled on load to populate `dotaWindow`
- `POST /navigation/bring-to-top` → header button
- (whatever route) → kill jump

If a route for jumping to a tick doesn't exist, add one that accepts `{ matchId, tick }` and runs the appropriate Dota console command via the existing console-bridge utility.

---

## 12 · Files in this bundle

```
prototype-standalone.html        ← Self-contained working prototype. Open in any browser.
README.md                         ← This file.
svelte-starters/                  ← Scaffold Svelte components to seed your implementation.
source/
  Interactive Prototype.html      ← Multi-file version of the prototype.
  Hi-fi Designs.html              ← Static hi-fi mockups (design canvas).
  Wireframes.html                 ← Mid-fi wireframes (early exploration).
  hifi-tokens.css                 ← The full token system. Lift directly into global.css.
  hifi-primitives.jsx             ← Atom components in JSX (HeroIcon, ItemIcon, AppHeader, etc).
  hifi-list.jsx                   ← Static hi-fi list screens.
  hifi-detail.jsx                 ← Static hi-fi match detail.
  hifi-states.jsx                 ← Static hi-fi header system + empty + loading.
  interactive-list.jsx            ← Interactive list (filter, sort, density).
  interactive-detail.jsx          ← Interactive detail + Kill Log tab.
  interactive-app.jsx             ← App root w/ theme, routing, profile.
```

To run the JSX-split version: `npx serve source/` and open `Interactive Prototype.html`.

---

## 13 · Definition of done

- [ ] All design tokens in `global.css`; old custom colors removed.
- [ ] Theme toggle in header + profile dropdown; persisted; `data-theme` on `<html>`.
- [ ] Matches list renders with both Cards and Rows densities; persisted.
- [ ] Hero filter dropdown works; clearing works; "no matches" state works.
- [ ] Sort by Date / Duration / Total kills works; persisted.
- [ ] Match card hover shows Reparse button; click opens detail.
- [ ] Row density: expand/collapse works; "Open match" navigates.
- [ ] Match detail: Teams tab matches spec; rows expand independently to show kill chips.
- [ ] Match detail: Kill Log tab implemented per §4.3, with all four filter controls + sorting.
- [ ] Kill chip hover shows blue border + soft glow; click jumps Dota 2.
- [ ] Empty state shown when 0 replays indexed.
- [ ] Loading state uses spinner + stage labels (no fake progress bar).
- [ ] `MapVisualization`, `MiniMap`, and `Chat` components deleted.
- [ ] No rank/MMR displayed anywhere.
- [ ] Light + dark themes both pass eyeball test on every screen.
