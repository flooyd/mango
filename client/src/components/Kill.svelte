<script>
  import { onMount } from 'svelte';
  import util from '../util/util'

  export let kill;

  const inflictorIsAttack = kill.inflictor === 'dota_unknown';
  const inflictorIsItem = kill.inflictor.includes('item');

  const {baseSteamStatic, baseSteamStaticAbilities, baseSteamStaticItems} = util;

  const handleClickKill = async () => {
    const response = await fetch(`http://localhost:8080/navigation/goto-tick/${kill.currentTick}`);
    const json = await response.json();
    console.log(json);
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
