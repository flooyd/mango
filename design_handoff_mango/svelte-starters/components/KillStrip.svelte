<script lang="ts">
  import KillChip, { type Kill } from './KillChip.svelte';
  import { createEventDispatcher } from 'svelte';

  export let kills: Kill[] = [];

  const dispatch = createEventDispatcher<{ jump: Kill }>();
</script>

<div class="strip">
  <div class="header">
    <span class="label">Kills · {kills.length}</span>
    <span class="hint">Click any kill to jump in Dota 2 →</span>
  </div>
  <div class="chips">
    {#each kills as kill (kill.tick)}
      <KillChip {kill} on:jump={(e) => dispatch('jump', e.detail)} />
    {/each}
  </div>
</div>

<style>
  .strip {
    padding: 12px 18px 14px 92px;
    background: var(--bg-3);
    border-top: 1px solid var(--line);
  }
  .header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .label {
    font-family: var(--sans);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-3);
    font-weight: 600;
  }
  .hint {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--text-3);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
</style>
