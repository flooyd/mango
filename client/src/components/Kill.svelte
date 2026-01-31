<script>
  import { onMount } from 'svelte';
  import util from '../util/util'
  import mapTime from '../stores/mapTime';

  export let kill;

  const inflictorIsAttack = kill.inflictor === 'dota_unknown';
  const inflictorIsItem = kill.inflictor.includes('item');

  const {baseSteamStatic, baseSteamStaticAbilities, baseSteamStaticItems} = util;

  const handleClickKill = () => {
    // Fire off Dota client navigation in the background (non-blocking)
    fetch(`http://localhost:8080/navigation/goto-tick/${kill.currentTick}`, {
      signal: AbortSignal.timeout(1000) // 1 second timeout
    }).catch(() => {
      // Dota client not available or timeout, ignore
    });

    // Immediately update map time store (jump to kill time and show map)
    mapTime.set({ time: kill.time, shouldShowMap: true, currentPlaybackTime: kill.time });
  };
</script>

<div class="kill" on:click={handleClickKill}>
  {#if inflictorIsAttack}
    <div class="attack">Attack</div>
  {:else if !inflictorIsItem}
    <img
      alt={kill.inflictor}
      src={`${baseSteamStaticAbilities}${kill.inflictor}.png`}
      title={kill.inflictor}
    />
  {:else}
    <img
      alt={kill.inflictor}
      src={`${baseSteamStaticItems}${kill.inflictor.replace(
        'item_',
        '',
      )}_lg.png`}
      title={kill.inflictor}
    />
  {/if}
  <img
    alt={kill.targetname}
    src={`${baseSteamStatic}/${kill.targetname}.png?`}
    title={kill.inflictor}
  />
</div>

<style>
  .kill {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
    width: 100px;
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-secondary);
    background: var(--bg-secondary);
    color: var(--text-primary);
    transition: all var(--transition-fast);
    cursor: pointer;
  }

  .kill:hover {
    background: var(--bg-tertiary);
    border-color: var(--accent-blue);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(88, 147, 223, 0.3);
  }

  img {
    height: 32px;
    width: 32px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-primary);
  }

  .attack {
    height: 32px;
    width: fit-content;
    display: flex;
    align-items: center;
    font-size: var(--text-xs);
    font-weight: 700;
    color: var(--text-muted);
  }
</style>
