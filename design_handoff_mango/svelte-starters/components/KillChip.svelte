<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import HeroIcon     from './HeroIcon.svelte';
  import ItemIcon     from './ItemIcon.svelte';
  import AbilityIcon  from './AbilityIcon.svelte';
  import Caret        from './Caret.svelte';

  export type KillInflictorType = 'attack' | 'ability' | 'item';
  export interface Kill {
    timeSec: number;
    tick: number;
    victim: string;          // hero key
    inflictor: string | null; // ability or item key (null for attack)
    inflictorType: KillInflictorType;
  }

  export let kill: Kill;

  const dispatch = createEventDispatcher<{ jump: Kill }>();

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }
</script>

<button
  class="chip"
  on:click={() => dispatch('jump', kill)}
  title="Click to jump in Dota 2"
>
  {#if kill.inflictorType === 'attack'}
    <span class="atk">ATK</span>
  {:else if kill.inflictorType === 'item' && kill.inflictor}
    <ItemIcon name={kill.inflictor} size={22} />
  {:else if kill.inflictorType === 'ability' && kill.inflictor}
    <AbilityIcon name={kill.inflictor} size={22} />
  {/if}
  <Caret dir="right" size={4} color="var(--text-3)" />
  <HeroIcon name={kill.victim} size={22} />
  <span class="time">{fmt(kill.timeSec)}</span>
</button>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 8px 5px 5px;
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-radius: 4px;
    cursor: pointer;
    transition: all 120ms ease;
    font-family: inherit;
  }
  .chip:hover {
    background: var(--bg-4);
    border-color: var(--blue);
    box-shadow: 0 0 0 2px var(--blue-soft), var(--shadow-sm);
  }
  .atk {
    width: 22px;
    height: 16.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-4);
    border-radius: 2px;
    font-family: var(--mono);
    font-size: 8px;
    font-weight: 700;
    color: var(--text-3);
  }
  .time {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--text-3);
    margin-left: 2px;
    font-variant-numeric: tabular-nums;
  }
</style>
