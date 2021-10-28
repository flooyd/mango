<script>
  import Player from './Player.svelte';
  import { afterUpdate } from 'svelte';
  export let players;
  let radiantPlayers = null;
  let direPlayers = null;
  afterUpdate(() => {
    radiantPlayers = players?.slice(0, 5);
    direPlayers = players?.slice(5, 10);
  });
</script>

{#if players && players.length > 0 && radiantPlayers && direPlayers}
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
{/if}

<style>
  .players {
    margin-top: '10px';
    display: flex;
    align-items: center;
  }

  .vs {
    margin: 0px 20px;
  }

  .radiant,
  .dire {
    display: flex;
  }
</style>
