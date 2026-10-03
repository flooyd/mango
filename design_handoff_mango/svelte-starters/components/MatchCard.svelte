<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import HeroIcon     from './HeroIcon.svelte';
  import Pill         from './Pill.svelte';
  import NetWorthBar  from './NetWorthBar.svelte';

  export interface Match {
    id: string;
    winner: 'radiant' | 'dire';
    score: [number, number];        // [radiantKills, direKills]
    durationSec: number;
    mode: string;                   // "Ranked AP", "Turbo", ...
    fb: string;                     // first blood "MM:SS"
    ended: string;                  // formatted date string
    nw: [number, number];           // [radiantNW, direNW]
    radiantHeroes: string[];        // 5 keys
    direHeroes: string[];           // 5 keys
    parsed: 'parsed' | 'unparsed' | 'reparsing';
  }

  export let match: Match;

  let hover = false;
  const dispatch = createEventDispatcher<{ open: string; reparse: string }>();

  function fmtDur(s: number) {
    const m = Math.floor(s / 60); const r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  }
  function fmtK(n: number) {
    return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
  }
</script>

<button
  class="card"
  class:hover
  on:click={() => dispatch('open', match.id)}
  on:mouseenter={() => hover = true}
  on:mouseleave={() => hover = false}
>
  <!-- Top: ID + parse badge + reparse on hover -->
  <div class="topRow">
    <div>
      <div class="label">Match ID</div>
      <div class="matchId">{match.id}</div>
    </div>
    <div class="topRight">
      {#if match.parsed === 'unparsed'}
        <Pill variant="bare">UNPARSED</Pill>
      {:else if match.parsed === 'reparsing'}
        <Pill variant="blue">PARSING</Pill>
      {/if}
      {#if hover}
        <button class="btn sm" on:click|stopPropagation={() => dispatch('reparse', match.id)}>
          ↻ Reparse
        </button>
      {/if}
    </div>
  </div>

  <!-- Score row -->
  <div class="scoreRow">
    <div class="score">
      <span class="num" class:winner={match.winner === 'radiant'} class:loser={match.winner !== 'radiant'}>
        {match.score[0]}
      </span>
      <span class="dash">–</span>
      <span class="num" class:winner={match.winner === 'dire'} class:loser={match.winner !== 'dire'}>
        {match.score[1]}
      </span>
    </div>
    <span class="victoryLabel" class:rad={match.winner === 'radiant'} class:dire={match.winner === 'dire'}>
      {match.winner === 'radiant' ? 'RADIANT VICTORY' : 'DIRE VICTORY'}
    </span>
  </div>

  <!-- Meta -->
  <div class="meta">
    <Pill variant="blue">{fmtDur(match.durationSec)}</Pill>
    <Pill variant="bare">{match.mode}</Pill>
    <Pill variant="bare"><span class="t-3">FB</span> {match.fb}</Pill>
  </div>

  <!-- Net worth -->
  <div class="nw">
    <div class="nwLabels">
      <span class="nwRad">{fmtK(match.nw[0])}</span>
      <span class="label">NET WORTH</span>
      <span class="nwDire">{fmtK(match.nw[1])}</span>
    </div>
    <NetWorthBar rad={match.nw[0]} dire={match.nw[1]} />
  </div>

  <!-- Lineup -->
  <div class="lineup">
    <div class="side">
      {#each match.radiantHeroes as h (h)}
        <HeroIcon name={h} size={32} />
      {/each}
    </div>
    <span class="vs">VS</span>
    <div class="side">
      {#each match.direHeroes as h (h)}
        <HeroIcon name={h} size={32} />
      {/each}
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <span class="ended">Ended {match.ended}</span>
  </div>
</button>

<style>
  .card {
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-radius: 6px;
    box-shadow: var(--shadow-sm);
    padding: 16px;
    text-align: left;
    cursor: pointer;
    width: 100%;
    font-family: inherit;
    color: var(--text-1);
    transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  }
  .card.hover {
    border-color: var(--blue);
    box-shadow: 0 0 0 1px var(--blue), var(--shadow-md);
    transform: translateY(-1px);
  }
  .label {
    font-family: var(--sans);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-3);
    font-weight: 600;
  }
  .topRow {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 14px;
  }
  .topRight {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .matchId {
    font-family: var(--mono);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-top: 3px;
    font-variant-numeric: tabular-nums;
  }
  .scoreRow {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .score {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }
  .num {
    font-family: var(--mono);
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
  .num.winner { color: var(--radiant); }
  .num.winner.loser { color: var(--radiant); }
  .num.loser  { color: var(--text-2); }
  .score :global(.num.winner:nth-child(3)) { color: var(--dire); }
  .dash {
    font-family: var(--mono);
    font-size: 18px;
    color: var(--text-3);
    margin: 0 4px;
  }
  .victoryLabel {
    font-family: var(--mono);
    font-weight: 700;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .victoryLabel.rad  { color: var(--radiant); }
  .victoryLabel.dire { color: var(--dire); }
  .meta {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .nw {
    margin-bottom: 14px;
  }
  .nwLabels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .nwRad  { font-family: var(--mono); font-size: 10px; font-weight: 600; color: var(--radiant); }
  .nwDire { font-family: var(--mono); font-size: 10px; font-weight: 600; color: var(--dire); }
  .lineup {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .side { display: flex; gap: 3px; }
  .vs {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.15em;
    color: var(--text-3);
    padding: 0 2px;
  }
  .footer {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid var(--line);
  }
  .ended {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--text-3);
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--sans);
    font-weight: 600;
    background: var(--bg-3);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    color: var(--text-1);
    cursor: pointer;
  }
  .btn.sm { font-size: 10px; padding: 3px 8px; }
  .t-3 { color: var(--text-3); margin-right: 3px; }
</style>
