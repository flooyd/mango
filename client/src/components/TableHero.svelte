<script lang="ts">
  import selectedHero from '../stores/selectedHero';
  export let row;
  export let col;

  const handleHeroClick = () => {
    $selectedHero = row;
    console.log($selectedHero)
  }
  //if(row.slot == 0) $selectedHero = row;
</script>

<div class='tableHero'>
  <img
    on:click={handleHeroClick}
    alt={row.unitValve}
    src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${row.unitValve}.png`}
  />
  <div class='hero'>{row.unitLocalized}</div>
</div>

<style>
  .tableHero {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  img {
    width: 64px;
    height: 36px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-primary);
    transition: all var(--transition-fast);
    cursor: pointer;
    box-shadow: var(--shadow-sm);
  }

  img:hover {
    transform: scale(1.05);
    border-color: var(--accent-blue);
    box-shadow: 0 0 15px rgba(88, 147, 223, 0.4);
  }

  .hero {
    display: inline-block;
    color: var(--text-primary);
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
  }
</style>
