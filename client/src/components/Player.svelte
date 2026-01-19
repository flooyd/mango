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
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-primary);
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-sm);
  }

  img:hover {
    transform: scale(1.05);
    border-color: var(--accent-blue);
    box-shadow: 0 0 15px rgba(88, 147, 223, 0.3);
  }
</style>
