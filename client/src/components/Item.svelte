<script>
  export let item;
  const baseSteamStatic =
    'https://steamcdn-a.akamaihd.net/apps/dota2/images/items/';
  console.log(item);
</script>

{#if item.itemslot < 6}
<img alt={item.valuename} src={`${baseSteamStatic}${item.valuename}_lg.png`} />
{/if}


<style>
  img {
    width: 43px;
    height: 32px;
    margin-right: 5px;
  }
</style>