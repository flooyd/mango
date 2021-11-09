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
    width: 100px;
    padding: 8px;
    margin-right: 13px;
    color: #333;
  }

  .kill:hover {
    color: white;
    background: #333;
  }

  img,
  .attack {
    height: 32px;
    width: 32px;
  }

  .attack {
    width: fit-content;
    display: flex;
    align-items: center;
  }
</style>
