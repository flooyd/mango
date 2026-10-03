<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { MatchVM } from '../lib/matchVm';
  import { processDetails, type ProcessedDetails, type PlayerRowVM } from '../lib/details';
  import { API } from '../lib/nav';
  import { fmtDuration, fmtClock, fmtEndDate, gameModeLabel } from '../lib/heroAssets';
  import HeroIcon from './HeroIcon.svelte';
  import Pill from './Pill.svelte';
  import NetWorthBar from './NetWorthBar.svelte';
  import Caret from './Caret.svelte';

  export let match: MatchVM;
  export let summary: any; // raw summary entity (for lazy detail processing)

  const dispatch = createEventDispatcher<{ open: string; reparse: string }>();

  let expanded = false;
  let loadingDetails = false;
  let processed: ProcessedDetails | null = null;
  let topPerformers: PlayerRowVM[] = [];

  $: modeLabel = gameModeLabel(match.mode);

  async function toggle() {
    expanded = !expanded;
    if (expanded && !processed && match.state === 'parsed') {
      loadingDetails = true;
      try {
        const details = await fetch(`${API}/matches/details/${match.matchId}`).then((r) => r.json());
        processed = processDetails(summary, details);
        topPerformers = [...processed.radiant.players, ...processed.dire.players]
          .sort((a, b) => b.networth - a.networth)
          .slice(0, 2);
      } catch (err) {
        console.error('Failed to load match details', err);
      } finally {
        loadingDetails = false;
      }
    }
  }
</script>

<div class="card" class:expanded>
  <button class="strip" on:click={toggle}>
    <span class="accent {match.winner}"></span>
    <span class="result {match.winner}">{match.winner === 'radiant' ? 'RADIANT' : 'DIRE'}</span>
    <span class="mid">{match.matchId}</span>
    <span class="scoreCell">
      <span style="color: {match.winner === 'radiant' ? 'var(--radiant)' : 'var(--text-2)'};">{match.radScore}</span>
      <span class="dash">–</span>
      <span style="color: {match.winner === 'dire' ? 'var(--dire)' : 'var(--text-2)'};">{match.direScore}</span>
    </span>
    <Pill variant="blue">{fmtDuration(match.durationSec)}</Pill>
    {#if modeLabel}<Pill variant="bare">{modeLabel}</Pill>{/if}
    {#if match.fb != null}<Pill variant="bare"><span class="t-3">FB</span> {fmtClock(match.fb)}</Pill>{/if}
    <span class="lineup">
      {#each match.radiantHeroes as h}<HeroIcon name={h} size={22} />{/each}
      <span class="vs">VS</span>
      {#each match.direHeroes as h}<HeroIcon name={h} size={22} />{/each}
    </span>
    <span class="date">{fmtEndDate(match.endTimeUnix)}</span>
    <Caret dir={expanded ? 'up' : 'down'} size={6} color="var(--text-3)" />
  </button>

  {#if expanded}
    <div class="expansion">
      {#if loadingDetails}
        <div class="loading"><span class="spinner"></span> Loading…</div>
      {:else if processed}
        <div class="nwWrap">
          <div class="nwLabels">
            <span class="t-rad">{processed.radiant.networth.toLocaleString()}</span>
            <span class="label">NET WORTH</span>
            <span class="t-dire">{processed.dire.networth.toLocaleString()}</span>
          </div>
          <NetWorthBar rad={processed.radiant.networth} dire={processed.dire.networth} />
        </div>
        <div class="performers">
          {#each topPerformers as p}
            <div class="perf">
              <HeroIcon name={p.heroKey} size={28} />
              <div class="perfInfo">
                <div class="perfName">{p.heroName}</div>
                <div class="perfKda">{p.kills} / {p.deaths} / {p.assists}</div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      <div class="actions">
        <button class="btn sm" on:click={() => dispatch('reparse', match.matchId)}>↻ Reparse</button>
        <button class="btn primary sm" on:click={() => dispatch('open', match.matchId)}>Open match →</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .card {
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-radius: 6px;
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: border-color 150ms ease;
  }
  .card:hover { border-color: var(--blue); }
  .strip {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 12px 16px 12px 0;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: inherit;
    color: var(--text-1);
    position: relative;
    text-align: left;
  }
  .accent { width: 3px; align-self: stretch; opacity: 0.85; }
  .accent.radiant { background: var(--radiant); }
  .accent.dire { background: var(--dire); }
  .result { width: 70px; font-family: var(--mono); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; }
  .result.radiant { color: var(--radiant); }
  .result.dire { color: var(--dire); }
  .mid { width: 110px; font-family: var(--mono); font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .scoreCell { width: 78px; font-family: var(--mono); font-size: 15px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .dash { color: var(--text-3); margin: 0 3px; }
  .lineup { display: flex; align-items: center; gap: 3px; margin-left: auto; }
  .vs { font-family: var(--mono); font-size: 8px; color: var(--text-3); padding: 0 4px; }
  .date { width: 170px; text-align: right; font-family: var(--mono); font-size: 10px; color: var(--text-3); }
  .t-3 { color: var(--text-3); }
  .expansion {
    padding: 14px 22px;
    background: var(--bg-3);
    border-top: 1px dashed var(--line);
    display: flex;
    align-items: center;
    gap: 28px;
    flex-wrap: wrap;
  }
  .nwWrap { max-width: 320px; flex: 1; min-width: 220px; }
  .nwLabels { display: flex; justify-content: space-between; margin-bottom: 4px; font-family: var(--mono); font-size: 10px; }
  .performers { display: flex; gap: 18px; }
  .perf { display: flex; align-items: center; gap: 8px; }
  .perfInfo { display: flex; flex-direction: column; gap: 2px; }
  .perfName { font-family: var(--sans); font-size: 12px; font-weight: 600; }
  .perfKda { font-family: var(--mono); font-size: 10px; color: var(--text-3); }
  .actions { display: flex; gap: 8px; margin-left: auto; }
  .loading { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 11px; color: var(--text-3); }
  .spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid var(--bg-4); border-top-color: var(--blue);
    animation: spin 0.9s linear infinite;
  }
  .btn.sm { font-size: 11px; padding: 5px 10px; }
</style>
