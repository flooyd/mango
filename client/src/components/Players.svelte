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
    margin-top: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .vs {
    font-family: 'Crimson Pro', serif;
    font-weight: 900;
    font-size: var(--text-lg);
    color: var(--text-muted);
    padding: 0 var(--spacing-lg);
    letter-spacing: 2px;
  }

  .radiant,
  .dire {
    display: flex;
    gap: var(--spacing-xs);
  }
</style>
