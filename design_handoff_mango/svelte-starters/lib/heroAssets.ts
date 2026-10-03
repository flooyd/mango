// Steam CDN URL builders. Mirrors the patterns in `client/src/util/util.ts`.

const HEROES_BASE   = 'https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/';
const ICONS_BASE    = `${HEROES_BASE}icons/`;
const ITEMS_BASE    = 'https://steamcdn-a.akamaihd.net/apps/dota2/images/items/';
const ABILITY_BASE  = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/';

export function heroPortraitUrl(heroKey: string): string {
  return `${HEROES_BASE}${heroKey}.png`;
}

export function heroIconUrl(heroKey: string): string {
  return `${ICONS_BASE}${heroKey}.png`;
}

export function itemIconUrl(itemKey: string): string {
  return `${ITEMS_BASE}${itemKey}_lg.png`;
}

export function abilityIconUrl(abilityKey: string): string {
  return `${ABILITY_BASE}${abilityKey}.png`;
}

// Human-readable hero name from npc_dota_hero_<slug> or bare slug.
// Replace this with a real lookup from the existing hero metadata.
export function heroDisplayName(heroKey: string): string {
  const trimmed = heroKey.replace(/^npc_dota_hero_/, '');
  return trimmed.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
