<script lang="ts">
  export let row;
  export let col;
  const heroClass = row.slot > 4 ? 'direHero' : 'radiantHero';
  const lastRadiant = row.slot === 4 ? 'lastRadiant' : '';
</script>

<div class={`tableHero ${lastRadiant}`}>
  <img
    alt={row.unitValve}
    src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${row.unitValve}.png`}
  />
  <div class={heroClass}>{row.unitLocalized}</div>
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
  .direHero {
    display: inline-block;
  }
  .radiantHero {
    display: inline-block;
  }
</style>
