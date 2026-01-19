<script>
  export let item;
  const baseSteamStatic =
    'https://steamcdn-a.akamaihd.net/apps/dota2/images/items/';
</script>

{#if item.itemslot < 6}
<img alt={item.valuename} src={`${baseSteamStatic}${item.valuename}_lg.png`} />
{/if}


<style>
  img {
    width: 43px;
    height: 32px;
    margin-right: var(--spacing-xs);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-primary);
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-sm);
  }

  img:hover {
    transform: scale(1.05);
    border-color: var(--accent-gold);
    box-shadow: 0 0 10px rgba(255, 203, 107, 0.4);
  }
</style>