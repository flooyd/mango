<script lang="ts">
  import selectedHero from '../stores/selectedHero';
  export let row;
  export let col;

  const handleHeroClick = () => {
    $selectedHero = row;
    console.log($selectedHero)
  }
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
  * {
    color: 333;
  }
  img {
    width: 64px;
    height: 36px;
    margin-right: 13px;
  }
  .hero {
    display: inline-block;
  }
</style>
