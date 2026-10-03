<script lang="ts">
  import { onMount } from 'svelte';
  import dotaWindow from '../../stores/dotaWindow'; // <- existing store
  import ThemeToggle from './ThemeToggle.svelte';
  import ProfileChip from './ProfileChip.svelte';

  export let runningContext: string = 'In Menu';

  $: running = $dotaWindow?.status === 'ok';

  async function bringToTop() {
    await fetch('http://localhost:8080/navigation/bring-to-top');
  }

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:8080/navigation/get-window');
      $dotaWindow = await response.json();
    } catch (err) {
      console.error('Could not reach Mango daemon:', err);
    }
  });
</script>

<header class="appHeader">
  <div class="brandWrap">
    <span class="brand">Dota Replays</span>
    <span class="version">v 0.4.2</span>
  </div>
  <div class="right">
    <div class="status" class:running>
      <span class="dot"></span>
      <span>
        {#if running}
          Dota 2 running · {runningContext}
        {:else}
          Dota 2 not running
        {/if}
      </span>
    </div>
    {#if running}
      <button class="btn sm" on:click={bringToTop}>Bring to top</button>
    {/if}
    <div class="divider"></div>
    <ThemeToggle />
    <ProfileChip />
  </div>
</header>

<style>
  .appHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 28px;
    background: linear-gradient(180deg, var(--bg-2) 0%, var(--bg-1) 100%);
    border-bottom: 1px solid var(--line);
    position: relative;
    z-index: 4;
  }
  .appHeader::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: -1px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(93,169,233,0.4), transparent);
    opacity: 0.5;
  }
  .brandWrap {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
  .brand {
    font-family: var(--serif);
    font-weight: 900;
    font-size: 22px;
    letter-spacing: -0.015em;
    background: linear-gradient(180deg, var(--text-1) 0%, var(--text-2) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .version {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--text-3);
    letter-spacing: 0.1em;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .status {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-2);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .status .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-3);
  }
  .status.running .dot {
    background: var(--radiant);
    box-shadow: 0 0 0 3px var(--radiant-glow), 0 0 8px var(--radiant-glow);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 50% { opacity: 0.55; } }
  .divider {
    width: 1px;
    height: 18px;
    background: var(--line-strong);
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
    transition: all 150ms ease;
  }
  .btn:hover {
    background: var(--bg-4);
    border-color: var(--blue);
  }
  .btn.sm { font-size: 11px; padding: 5px 10px; }
</style>
