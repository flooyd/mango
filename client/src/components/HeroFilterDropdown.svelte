<script lang="ts">
  import { heroFilter } from '../stores/uiPrefs';
  import { heroDisplayName } from '../lib/heroAssets';
  import HeroIcon from './HeroIcon.svelte';
  import Caret from './Caret.svelte';

  export let heroes: string[] = []; // unique hero keys present in the list

  let open = false;
  function close() { open = false; }
  function pick(h: string) {
    heroFilter.set($heroFilter === h ? null : h);
    open = false;
  }
  function clear(e: MouseEvent) {
    e.stopPropagation();
    heroFilter.set(null);
  }
</script>

<svelte:window on:click={close} />

<div class="wrap" on:click|stopPropagation>
  <button class="pillBtn" class:active={$heroFilter} on:click={() => (open = !open)}>
    {#if $heroFilter}
      <HeroIcon name={$heroFilter} size={18} />
      <span class="val">{heroDisplayName($heroFilter)}</span>
      <span class="clear" on:click={clear}>✕</span>
    {:else}
      <span class="mag">⌕</span>
      <span class="key">HERO</span>
      <span class="val muted">All heroes</span>
    {/if}
    <Caret dir={open ? 'up' : 'down'} size={5} color="var(--text-3)" />
  </button>

  {#if open}
    <div class="dropdown">
      <div class="grid">
        {#each heroes as h (h)}
          <button class="heroBtn" class:sel={$heroFilter === h} on:click={() => pick(h)} title={heroDisplayName(h)}>
            <HeroIcon name={h} size={32} />
          </button>
        {/each}
      </div>
      {#if heroes.length === 0}
        <div class="empty">No heroes yet</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .wrap { position: relative; display: inline-block; }
  .pillBtn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 9px;
    background: var(--bg-3);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-2);
    transition: all 150ms ease;
  }
  .pillBtn:hover { border-color: var(--blue); }
  .pillBtn.active { border-color: var(--blue); color: var(--text-1); }
  .mag { font-size: 12px; color: var(--text-3); }
  .key { font-size: 10px; letter-spacing: 0.1em; color: var(--text-3); }
  .val { color: var(--text-1); }
  .val.muted { color: var(--text-2); }
  .clear {
    color: var(--text-3);
    font-size: 10px;
    padding: 0 2px;
    border-radius: 2px;
  }
  .clear:hover { color: var(--dire); }
  .dropdown {
    position: absolute;
    top: 38px;
    left: 0;
    width: 340px;
    background: var(--bg-3);
    border: 1px solid var(--line-strong);
    border-radius: 6px;
    box-shadow: var(--shadow-lg);
    padding: 10px;
    z-index: 20;
    max-height: 360px;
    overflow-y: auto;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
  }
  .heroBtn {
    padding: 1px;
    background: transparent;
    border: 2px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    line-height: 0;
  }
  .heroBtn:hover { border-color: var(--line-strong); }
  .heroBtn.sel { border-color: var(--blue); }
  .empty {
    padding: 16px;
    text-align: center;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 11px;
  }
</style>
