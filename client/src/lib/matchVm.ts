import { heroKey } from './heroAssets';

export type ParseState = 'parsed' | 'unparsed' | 'parsing';

export interface MatchVM {
  matchId: string;
  state: ParseState;
  winner: 'radiant' | 'dire';
  radScore: number;
  direScore: number;
  totalKills: number;
  durationSec: number;
  endTimeUnix: number;
  mode: number | null;
  fb: number | null; // first-blood seconds
  radNW: number | null;
  direNW: number | null;
  radiantHeroes: string[]; // bare keys
  direHeroes: string[]; // bare keys
  allHeroes: string[];
}

/** Build a parsed view-model from a raw /matches/summary entity. */
export function deriveMatch(matchId: string, s: any): MatchVM {
  const radiantHeroes = [0, 1, 2, 3, 4].map((i) => heroKey(s[`radiantHero${i}`] || ''));
  const direHeroes = [0, 1, 2, 3, 4].map((i) => heroKey(s[`direHero${i}`] || ''));
  const radScore = parseInt(s.radiantKills, 10) || 0;
  const direScore = parseInt(s.direKills, 10) || 0;
  return {
    matchId,
    state: 'parsed',
    winner: s.gameWinner === 2 ? 'radiant' : 'dire',
    radScore,
    direScore,
    totalKills: radScore + direScore,
    durationSec: Math.round(s.duration || 0),
    endTimeUnix: parseInt(s.endTime, 10) || 0,
    mode: s.gameMode ?? null,
    fb: s.firstBloodTime ?? null,
    radNW: s.radiantNetWorth ?? null,
    direNW: s.direNetWorth ?? null,
    radiantHeroes,
    direHeroes,
    allHeroes: [...radiantHeroes, ...direHeroes].filter(Boolean),
  };
}

export function unparsedMatch(matchId: string, parsing = false): MatchVM {
  return {
    matchId,
    state: parsing ? 'parsing' : 'unparsed',
    winner: 'radiant',
    radScore: 0,
    direScore: 0,
    totalKills: 0,
    durationSec: 0,
    endTimeUnix: 0,
    mode: null,
    fb: null,
    radNW: null,
    direNW: null,
    radiantHeroes: [],
    direHeroes: [],
    allHeroes: [],
  };
}
