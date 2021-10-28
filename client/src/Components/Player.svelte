<script>
  export let player;
</script>

<div class="player">
  <img
    alt={player.heroNameValve}
    src="{`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${player}.png`}"
  />
</div>

<style>
  img {
    width: 64px;
    height: 36px;
  }
</style>
