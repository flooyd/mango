<script>
  export let kill;

  const baseSteamStatic =
    'https://steamcdn-a.akamaihd.net/apps/dota2/images/dota_react/heroes/icons/';
  const baseSteamStaticAbilities =
    'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/';
  const inflictorIsAttack = kill.inflictor === 'dota_unknown';
</script>

<div class="kill">
  {#if inflictorIsAttack}
  <div class="attack">
    Attack
  </div>
  {:else}
     <img alt={kill.inflictor} src={`${baseSteamStaticAbilities}${kill.inflictor}.png`}>
  {/if}
  <img
    alt={kill.targetname}
    src={`${baseSteamStatic}/${kill.targetname}.png?`}
  />
</div>

<style>
  .kill {
    display: flex;
    align-items: center;
    width: 100px;
    padding: 8px;
    margin-right: 13px;
    color:white;
  }

  .kill:hover{
    color: white;
    background: #333;
  }

  img, .attack {
    margin-right: 8px;
    height: 32px;
    width: 32px;
  }

  .attack {
    width: fit-content;
    display: flex;
    align-items: center;
  }
</style>
