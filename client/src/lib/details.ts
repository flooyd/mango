import { heroKey, heroDisplayName, inflictorType, type InflictorType } from './heroAssets';

export interface MultiKillVM {
  id: number; // groups kills belonging to the same multi-kill
  size: number; // total kills in the multi-kill (2 = double, 3 = triple, ...)
  seq: number; // 1-based position of this kill within the multi-kill
}

export interface KillVM {
  killer: string; // hero key
  victim: string; // hero key
  inflictor: string | null; // ability/item key, null for attack
  inflictorType: InflictorType;
  timeSec: number;
  tick: number;
  multiKill: MultiKillVM | null;
}

export interface LogEntry extends KillVM {
  n: number;
  side: 'rad' | 'dire';
  firstBlood: boolean;
}

export interface PlayerRowVM {
  slot: number;
  side: 'radiant' | 'dire';
  heroKey: string;
  heroName: string;
  playerName: string;
  level: number;
  kills: number;
  deaths: number;
  assists: number;
  fb: boolean;
  lh: number;
  dn: number;
  gpm: number;
  xpm: number;
  networth: number;
  towersKilled: number;
  kp: number; // 0-100
  items: string[]; // up to 6 item keys
  killList: KillVM[];
}

export interface TeamVM {
  side: 'radiant' | 'dire';
  players: PlayerRowVM[];
  kills: number;
  networth: number;
  towers: number;
  gpm: number; // average
  xpm: number; // average
}

export interface ProcessedDetails {
  radiant: TeamVM;
  dire: TeamVM;
  log: LogEntry[];
  allHeroes: string[];
}

function round(n: number): number {
  return Math.round(n || 0);
}

// Dota 2 counts kills toward a multi-kill while they land within 18s of the previous one.
const MULTI_KILL_WINDOW_SEC = 18;

export function multiKillLabel(size: number): string {
  if (size >= 5) return 'Rampage';
  if (size === 4) return 'Ultra Kill';
  if (size === 3) return 'Triple Kill';
  return 'Double Kill';
}

// Maps each raw kill that is part of a multi-kill to its group info.
function computeMultiKills(pvpKills: any[]): Map<any, MultiKillVM> {
  const byKiller = new Map<string, any[]>();
  for (const k of pvpKills) {
    const key = heroKey(k.attackername);
    if (!byKiller.has(key)) byKiller.set(key, []);
    byKiller.get(key)!.push(k);
  }

  const result = new Map<any, MultiKillVM>();
  let id = 0;
  const flush = (run: any[]) => {
    if (run.length < 2) return;
    id++;
    run.forEach((k, i) => result.set(k, { id, size: run.length, seq: i + 1 }));
  };
  for (const kills of byKiller.values()) {
    kills.sort((a, b) => (a.time || 0) - (b.time || 0));
    let run: any[] = [];
    for (const k of kills) {
      if (run.length && (k.time || 0) - (run[run.length - 1].time || 0) > MULTI_KILL_WINDOW_SEC) {
        flush(run);
        run = [];
      }
      run.push(k);
    }
    flush(run);
  }
  return result;
}

export function processDetails(summary: any, details: any): ProcessedDetails {
  const intervals: any[] = details.Last10Intervals || [];
  const items: any[] = details.EndGameItems || [];
  const pvpKills: any[] = details.pvpKills || [];

  // Map summary hero keys by slot 0-9.
  const heroForSlot = (slot: number): string =>
    slot < 5 ? heroKey(summary[`radiantHero${slot}`] || '') : heroKey(summary[`direHero${slot - 5}`] || '');
  const playerForSlot = (slot: number): string =>
    slot < 5 ? summary[`radiantPlayer${slot}`] || '' : summary[`direPlayer${slot - 5}`] || '';

  const multiKills = computeMultiKills(pvpKills);

  // Latest interval entry per slot.
  const bySlot: { [slot: number]: any } = {};
  for (const e of intervals) {
    if (e.slot == null) continue;
    if (!bySlot[e.slot] || e.time >= bySlot[e.slot].time) bySlot[e.slot] = e;
  }

  const players: PlayerRowVM[] = [];
  for (let slot = 0; slot < 10; slot++) {
    const e = bySlot[slot] || {};
    const key = heroForSlot(slot);
    const side: 'radiant' | 'dire' = slot < 5 ? 'radiant' : 'dire';
    const minutes = e.time > 0 ? e.time / 60 : 0;
    const myKills = pvpKills
      .filter((k) => heroKey(k.attackername) === key)
      .sort((a, b) => (a.currentTick || 0) - (b.currentTick || 0))
      .map((k) => toKill(k, multiKills));
    players.push({
      slot,
      side,
      heroKey: key,
      heroName: heroDisplayName(key),
      playerName: playerForSlot(slot),
      level: e.level || 0,
      kills: e.kills || 0,
      deaths: e.deaths || 0,
      assists: e.assists || 0,
      fb: e.firstblood_claimed === 1,
      lh: e.lh || 0,
      dn: e.denies || 0,
      gpm: minutes ? round((e.gold || 0) / minutes) : 0,
      xpm: minutes ? round((e.xp || 0) / minutes) : 0,
      networth: e.networth || 0,
      towersKilled: e.towers_killed || 0,
      kp: 0,
      items: items
        .filter((it) => it.targetname === key)
        .map((it) => it.valuename)
        .slice(0, 6),
      killList: myKills,
    });
  }

  const radiantPlayers = players.filter((p) => p.side === 'radiant');
  const direPlayers = players.filter((p) => p.side === 'dire');

  const buildTeam = (side: 'radiant' | 'dire', ps: PlayerRowVM[]): TeamVM => {
    const teamKills = ps.reduce((a, p) => a + p.kills, 0);
    for (const p of ps) {
      p.kp = teamKills > 0 ? round(((p.kills + p.assists) / teamKills) * 100) : 0;
    }
    return {
      side,
      players: ps,
      kills: teamKills,
      networth: ps.reduce((a, p) => a + p.networth, 0),
      towers: ps.reduce((a, p) => a + p.towersKilled, 0),
      gpm: ps.length ? round(ps.reduce((a, p) => a + p.gpm, 0) / ps.length) : 0,
      xpm: ps.length ? round(ps.reduce((a, p) => a + p.xpm, 0) / ps.length) : 0,
    };
  };

  const radiant = buildTeam('radiant', radiantPlayers);
  const dire = buildTeam('dire', direPlayers);

  // Build the full kill log. Determine each kill's side from the radiant hero set.
  const radiantSet = new Set(radiantPlayers.map((p) => p.heroKey));
  const sortedKills = [...pvpKills].sort((a, b) => (a.currentTick || 0) - (b.currentTick || 0));
  const fbTick = sortedKills.length ? sortedKills[0].currentTick : null;
  const log: LogEntry[] = sortedKills.map((k, i) => {
    const killerKey = heroKey(k.attackername);
    return {
      ...toKill(k, multiKills),
      n: i + 1,
      side: radiantSet.has(killerKey) ? 'rad' : 'dire',
      firstBlood: fbTick != null && k.currentTick === fbTick,
    };
  });

  return {
    radiant,
    dire,
    log,
    allHeroes: players.map((p) => p.heroKey).filter(Boolean),
  };
}

function toKill(k: any, multiKills: Map<any, MultiKillVM>): KillVM {
  const type = inflictorType(k.inflictor);
  return {
    killer: heroKey(k.attackername),
    victim: heroKey(k.targetname),
    inflictor: type === 'attack' ? null : type === 'item' ? k.inflictor.replace(/^item_/, '') : k.inflictor,
    inflictorType: type,
    timeSec: k.time || 0,
    tick: k.currentTick || 0,
    multiKill: multiKills.get(k) || null,
  };
}
