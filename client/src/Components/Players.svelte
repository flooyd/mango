<script>
  import Player from './Player.svelte';

  export let players;
  let radiantPlayers = players.slice(0, 5);
  let direPlayers = players.slice(5, 10)
</script>

<div class="players">
  <div class="radiant">
    {#each radiantPlayers as player, i (player)}
      <Player {player} />
    {/each}
  </div>
  <div class="vs">VS</div>
  <div class="dire">
    {#each direPlayers as player, i (player)}
      <Player {player} />
    {/each}
  </div>
</div>

<style>
  .players {
    margin-top: '10px';
    display: flex;
    align-items: center;
  }

  .vs {
    margin: 0px 20px;
  }

  .radiant, .dire {
    display: flex;
  }
</style>
