<script>
import { onMount } from "svelte";


  export let kill;

  const baseSteamStatic =
    'https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/icons/';
  const baseSteamStaticAbilities =
    'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/';
  const baseSteamStaticItems =
    'https://steamcdn-a.akamaihd.net/apps/dota2/images/items/';

  const inflictorIsAttack = kill.inflictor === 'dota_unknown';
  const inflictorIsItem = kill.inflictor.includes('item');
  
  const handleClickKill = () => {
    console.log(kill);
  }
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
