<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { theme } from '../stores/theme';
  import HeroIcon from './HeroIcon.svelte';
  import Caret from './Caret.svelte';

  export let userName: string = 'philly';
  export let avatarHero: string = 'lion';
  export let steamId: string = '76561198…';

  const dispatch = createEventDispatcher<{ reparseAll: void }>();

  let open = false;
  function close() { open = false; }
  function toggleTheme() { theme.set($theme === 'dark' ? 'light' : 'dark'); }
  function reparseAll() { open = false; dispatch('reparseAll'); }
</script>

<svelte:window on:click={close} />

<div class="wrap" on:click|stopPropagation>
  <button class="chip" class:open on:click={() => (open = !open)}>
    <HeroIcon name={avatarHero} size={28} />
    <span class="name">{userName}</span>
    <Caret dir={open ? 'up' : 'down'} size={5} color="var(--text-3)" />
  </button>

  {#if open}
    <div class="dropdown">
      <div class="user">
        <HeroIcon name={avatarHero} size={36} />
        <div>
          <div class="userName">{userName}</div>
          <div class="userSub">{steamId}</div>
        </div>
      </div>

      <button class="row" on:click={toggleTheme}>
        <span class="glyph">{$theme === 'dark' ? '☾' : '☀'}</span>
        <span class="rowLabel">Theme</span>
        <span class="value">{$theme === 'dark' ? 'Dark' : 'Light'}</span>
      </button>

      <button class="row" on:click={reparseAll}>
        <span class="glyph">↻</span>
        <span class="rowLabel">Reparse all replays</span>
      </button>
    </div>
  {/if}
</div>

<style>
  .wrap { position: relative; display: inline-block; }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px 4px 4px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 150ms ease;
    font-family: inherit;
  }
  .chip.open { background: var(--bg-4); border-color: var(--line-strong); }
  .name {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-1);
    font-weight: 600;
  }
  .dropdown {
    position: absolute;
    top: 40px;
    right: 0;
    width: 232px;
    background: var(--bg-3);
    border: 1px solid var(--line-strong);
    border-radius: 6px;
    box-shadow: var(--shadow-lg);
    padding: 6px;
    z-index: 20;
  }
  .user {
    display: flex;
    gap: 10px;
    padding: 8px 8px 10px;
    border-bottom: 1px solid var(--line);
    margin-bottom: 4px;
  }
  .userName { font-family: var(--mono); font-size: 12px; font-weight: 700; color: var(--text-1); }
  .userSub  { font-family: var(--mono); font-size: 10px; color: var(--text-3); margin-top: 3px; }
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 7px 8px;
    border-radius: 3px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background 120ms ease;
    text-align: left;
    font-family: inherit;
  }
  .row:hover { background: var(--bg-4); }
  .glyph {
    display: inline-flex;
    width: 14px; height: 14px;
    align-items: center; justify-content: center;
    color: var(--text-2);
    font-family: var(--mono); font-size: 11px;
  }
  .rowLabel { font-size: 12px; color: var(--text-1); flex: 1; }
  .value { font-family: var(--mono); font-size: 10px; color: var(--text-3); }
</style>
