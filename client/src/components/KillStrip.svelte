<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { KillVM, MultiKillVM } from '../lib/details';
  import { multiKillLabel } from '../lib/details';
  import KillChip from './KillChip.svelte';

  export let kills: KillVM[] = [];
  const dispatch = createEventDispatcher<{ jump: KillVM }>();

  // Cluster consecutive kills that belong to the same multi-kill so they render as one group.
  $: groups = kills.reduce((acc: { mk: MultiKillVM | null; kills: KillVM[] }[], kill) => {
    const last = acc[acc.length - 1];
    if (kill.multiKill && last?.mk?.id === kill.multiKill.id) last.kills.push(kill);
    else acc.push({ mk: kill.multiKill, kills: [kill] });
    return acc;
  }, []);
</script>

<div class="strip">
  <div class="header">
    <span class="label">Kills · {kills.length}</span>
    <span class="hint">Click any kill to jump in Dota 2 →</span>
  </div>
  {#if kills.length}
    <div class="chips">
      {#each groups as g (g.kills[0].tick)}
        {#if g.mk}
          <div class="mkGroup">
            <span class="mkLabel">{multiKillLabel(g.mk.size)}</span>
            {#each g.kills as kill (kill.tick)}
              <KillChip {kill} on:jump={(e) => dispatch('jump', e.detail)} />
            {/each}
          </div>
        {:else}
          {#each g.kills as kill (kill.tick)}
            <KillChip {kill} on:jump={(e) => dispatch('jump', e.detail)} />
          {/each}
        {/if}
      {/each}
    </div>
  {:else}
    <div class="none">No hero kills.</div>
  {/if}
</div>

<style>
  .strip {
    padding: 12px 18px 14px 92px;
    background: var(--bg-3);
    border-top: 1px solid var(--line);
  }
  .header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .label {
    font-family: var(--sans);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-3);
    font-weight: 600;
  }
  .hint { font-family: var(--mono); font-size: 10px; color: var(--text-3); }
  .chips { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 6px; }
  .mkGroup {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 14px 6px 5px;
    margin-top: 6px;
    background: var(--gold-soft);
    border: 1px solid var(--gold);
    border-radius: 5px;
  }
  .mkLabel {
    position: absolute;
    top: 3px;
    left: 7px;
    font-family: var(--sans);
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--gold);
    white-space: nowrap;
    pointer-events: none;
  }
  .none { font-family: var(--mono); font-size: 11px; color: var(--text-3); }
</style>
