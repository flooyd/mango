<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { MatchVM } from '../lib/matchVm';
  import { fmtDuration, fmtClock, fmtThousands, fmtEndDate, gameModeLabel } from '../lib/heroAssets';
  import HeroIcon from './HeroIcon.svelte';
  import Pill from './Pill.svelte';
  import NetWorthBar from './NetWorthBar.svelte';

  export let match: MatchVM;

  let hover = false;
  const dispatch = createEventDispatcher<{ open: string; reparse: string }>();

  $: hasNW = match.radNW != null && match.direNW != null;
  $: modeLabel = gameModeLabel(match.mode);
</script>

<button
  class="card"
  class:hover
  on:click={() => dispatch('open', match.matchId)}
  on:mouseenter={() => (hover = true)}
  on:mouseleave={() => (hover = false)}
>
  <div class="topRow">
    <div>
      <div class="label">Match ID</div>
      <div class="matchId">{match.matchId}</div>
    </div>
    <div class="topRight">
      {#if match.state === 'unparsed'}
        <Pill variant="bare">UNPARSED</Pill>
      {:else if match.state === 'parsing'}
        <Pill variant="blue">PARSING…</Pill>
      {/if}
      {#if hover && match.state !== 'parsing'}
        <button class="btn sm" on:click|stopPropagation={() => dispatch('reparse', match.matchId)}>
          ↻ {match.state === 'unparsed' ? 'Parse' : 'Reparse'}
        </button>
      {/if}
    </div>
  </div>

  {#if match.state === 'parsed'}
    <div class="scoreRow">
      <div class="score">
        <span class="num" style="color: {match.winner === 'radiant' ? 'var(--radiant)' : 'var(--text-2)'};">
          {match.radScore}
        </span>
        <span class="dash">–</span>
        <span class="num" style="color: {match.winner === 'dire' ? 'var(--dire)' : 'var(--text-2)'};">
          {match.direScore}
        </span>
      </div>
      <span class="victoryLabel" class:rad={match.winner === 'radiant'} class:dire={match.winner === 'dire'}>
        {match.winner === 'radiant' ? 'RADIANT VICTORY' : 'DIRE VICTORY'}
      </span>
    </div>

    <div class="meta">
      <Pill variant="blue">{fmtDuration(match.durationSec)}</Pill>
      {#if modeLabel}<Pill variant="bare">{modeLabel}</Pill>{/if}
      {#if match.fb != null}<Pill variant="bare"><span class="t3">FB</span> {fmtClock(match.fb)}</Pill>{/if}
    </div>

    <div class="nw">
      <div class="nwLabels">
        <span class="nwRad">{hasNW ? fmtThousands(match.radNW) : '—'}</span>
        <span class="label">NET WORTH</span>
        <span class="nwDire">{hasNW ? fmtThousands(match.direNW) : '—'}</span>
      </div>
      <NetWorthBar rad={match.radNW || 0} dire={match.direNW || 0} />
    </div>

    <div class="lineup">
      <div class="side">
        {#each match.radiantHeroes as h}
          <HeroIcon name={h} size={32} />
        {/each}
      </div>
      <span class="vs">VS</span>
      <div class="side">
        {#each match.direHeroes as h}
          <HeroIcon name={h} size={32} />
        {/each}
      </div>
    </div>

    <div class="footer">
      <span class="ended">Ended {fmtEndDate(match.endTimeUnix)}</span>
    </div>
  {:else}
    <div class="unparsedBody">
      {match.state === 'parsing' ? 'Parsing replay…' : 'Not parsed yet — click Parse to index this replay.'}
    </div>
  {/if}
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
  .topRow {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 14px;
  }
  .topRight { display: flex; gap: 6px; align-items: center; }
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
  .score { display: flex; align-items: baseline; gap: 4px; }
  .num {
    font-family: var(--mono);
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
  .dash { font-family: var(--mono); font-size: 18px; color: var(--text-3); margin: 0 4px; }
  .victoryLabel {
    font-family: var(--mono);
    font-weight: 700;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .victoryLabel.rad { color: var(--radiant); }
  .victoryLabel.dire { color: var(--dire); }
  .meta { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
  .t3 { color: var(--text-3); }
  .nw { margin-bottom: 14px; }
  .nwLabels { display: flex; justify-content: space-between; margin-bottom: 4px; align-items: center; }
  .nwRad { font-family: var(--mono); font-size: 10px; font-weight: 600; color: var(--radiant); }
  .nwDire { font-family: var(--mono); font-size: 10px; font-weight: 600; color: var(--dire); }
  .lineup { display: flex; align-items: center; gap: 10px; }
  .side { display: flex; gap: 3px; }
  .vs { font-family: var(--mono); font-size: 9px; letter-spacing: 0.15em; color: var(--text-3); padding: 0 2px; }
  .footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--line); }
  .ended { font-family: var(--mono); font-size: 10px; color: var(--text-3); }
  .unparsedBody {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-3);
    padding: 8px 0 4px;
    line-height: 1.6;
  }
  .btn.sm { font-size: 10px; padding: 3px 8px; }
</style>
