// Steam CDN URL builders + small formatting helpers shared across the UI.
// Mirrors the URL patterns originally in `client/src/util/util.ts`.

const HEROES_BASE  = 'https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/';
const ICONS_BASE   = `${HEROES_BASE}icons/`;
const ITEMS_BASE   = 'https://steamcdn-a.akamaihd.net/apps/dota2/images/items/';
const ABILITY_BASE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/';

/** Strip the `npc_dota_hero_` prefix (and any CDOTA_Unit_Hero_ form) to a bare key. */
export function heroKey(name: string): string {
  if (!name) return '';
  return name
    .replace(/^npc_dota_hero_/, '')
    .replace(/^CDOTA_Unit_Hero_?/i, '')
    .toLowerCase();
}

export function heroPortraitUrl(key: string): string {
  return `${HEROES_BASE}${heroKey(key)}.png`;
}
export function heroIconUrl(key: string): string {
  return `${ICONS_BASE}${heroKey(key)}.png`;
}
export function itemIconUrl(item: string): string {
  return `${ITEMS_BASE}${item.replace(/^item_/, '')}_lg.png`;
}
export function abilityIconUrl(ability: string): string {
  return `${ABILITY_BASE}${ability}.png`;
}

/** Human-readable hero name from `npc_dota_hero_<slug>` or a bare slug. */
export function heroDisplayName(name: string): string {
  return heroKey(name)
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Human-readable item name from `item_black_king_bar` / `black_king_bar`. */
export function itemDisplayName(item: string): string {
  return item
    .replace(/^item_/, '')
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export type InflictorType = 'attack' | 'ability' | 'item';
export function inflictorType(inflictor: string | null | undefined): InflictorType {
  if (!inflictor || inflictor === 'dota_unknown') return 'attack';
  if (inflictor.includes('item')) return 'item';
  return 'ability';
}

// ===== Formatters =====

/** Seconds → `M:SS` (e.g. 41:27). */
export function fmtDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Seconds → `MM:SS` (zero-padded minutes) for kill timestamps. */
export function fmtClock(seconds: number): string {
  const sign = seconds < 0 ? '-' : '';
  const abs = Math.abs(Math.floor(seconds));
  const m = Math.floor(abs / 60);
  const s = abs % 60;
  return `${sign}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** 222400 → "222.4K". */
export function fmtThousands(n: number): string {
  if (n == null) return '—';
  return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
}

/** Unix seconds → "MM-DD-YYYY hh:mm:ss AM". */
export function fmtEndDate(unixSeconds: number | string): string {
  const ts = typeof unixSeconds === 'string' ? parseInt(unixSeconds, 10) : unixSeconds;
  if (!ts) return 'Unknown';
  const d = new Date(ts * 1000);
  const pad = (x: number) => String(x).padStart(2, '0');
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return (
    `${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${d.getFullYear()} ` +
    `${pad(h)}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}`
  );
}

const GAME_MODE_LABELS: { [key: number]: string } = {
  1: 'All Pick',
  2: 'Captains Mode',
  3: 'Random Draft',
  4: 'Single Draft',
  5: 'All Random',
  12: 'Least Played',
  16: 'Captains Draft',
  18: 'Ability Draft',
  22: 'Ranked AP',
  23: 'Turbo',
};
export function gameModeLabel(mode: number | null | undefined): string | null {
  if (mode == null) return null;
  return GAME_MODE_LABELS[mode] ?? `Mode ${mode}`;
}
