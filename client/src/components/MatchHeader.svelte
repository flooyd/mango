<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { MatchVM } from '../lib/matchVm';
  import dotaWindow from '../stores/dotaWindow';
  import { openReplay } from '../lib/nav';
  import { fmtDuration, fmtClock, fmtEndDate, gameModeLabel } from '../lib/heroAssets';
  import Pill from './Pill.svelte';

  export let match: MatchVM;

  const dispatch = createEventDispatcher<{ back: void; reparse: void }>();
  $: running = $dotaWindow && $dotaWindow.status === 'ok';
  $: modeLabel = gameModeLabel(match.mode);
</script>

<div class="matchHeader">
  <div class="topLine">
    <button class="btn ghost" on:click={() => dispatch('back')}>← Back to replays</button>
    <div class="vdivider"></div>
    <span class="matchWord serif">Match</span>
    <Pill variant="blue">{match.matchId}</Pill>
    <div class="spacer"></div>
    <button class="btn" on:click={() => dispatch('reparse')}>↻ Reparse</button>
    {#if running}
      <button class="btn primary" on:click={() => openReplay(match.matchId)}>Open in Dota 2 →</button>
    {/if}
  </div>

  <div class="summary">
    <span class="victory" class:rad={match.winner === 'radiant'} class:dire={match.winner === 'dire'}>
      {match.winner === 'radiant' ? 'RADIANT VICTORY' : 'DIRE VICTORY'}
    </span>
    <span class="score">
      <span style="color: {match.winner === 'radiant' ? 'var(--radiant)' : 'var(--text-2)'};">{match.radScore}</span>
      <span class="dash">–</span>
      <span style="color: {match.winner === 'dire' ? 'var(--dire)' : 'var(--text-2)'};">{match.direScore}</span>
    </span>
    <div class="vdivider"></div>
    <Pill variant="blue">{fmtDuration(match.durationSec)}</Pill>
    {#if modeLabel}<Pill variant="bare">{modeLabel}</Pill>{/if}
    {#if match.fb != null}<Pill variant="bare"><span class="t-3">FB</span> {fmtClock(match.fb)}</Pill>{/if}
    <span class="ended">Ended {fmtEndDate(match.endTimeUnix)}</span>
  </div>
</div>

<style>
  .matchHeader { padding: 24px 28px; border-bottom: 1px solid var(--line); }
  .topLine { display: flex; align-items: center; gap: 12px; }
  .vdivider { width: 1px; height: 18px; background: var(--line-strong); }
  .matchWord { font-size: 26px; font-weight: 700; color: var(--text-1); }
  .spacer { flex: 1; }
  .summary { display: flex; align-items: center; gap: 14px; margin-top: 16px; flex-wrap: wrap; }
  .victory {
    font-family: var(--mono);
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.16em;
  }
  .victory.rad { color: var(--radiant); }
  .victory.dire { color: var(--dire); }
  .score { font-family: var(--mono); font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .dash { color: var(--text-3); margin: 0 4px; }
  .ended { font-family: var(--mono); font-size: 11px; color: var(--text-3); }
  .t-3 { color: var(--text-3); }
</style>
