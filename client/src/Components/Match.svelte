<script>
  import Players from './Players.svelte';

  export let matchSummary;
  export let matchId;

  const getMatchDetails = async () => {
    const response = await fetch(
      `http://localhost:8080/matches/details/${matchId}`,
    );
    const matchDetails = await response.json();
    console.log(matchSummary);
  };
</script>

<div>
  <div on:click={getMatchDetails} class="matchId">Match ID: {matchId}</div>
    {#if (matchSummary && matchSummary.gameWinner) === 2}
    <div class="winner radiant">Radiant Victory!</div>
    {:else if (matchSummary && matchSummary.gameWinner === 3)}
    <div class="winner dire">Dire Victory!</div>
    {/if}
  {#if matchSummary}
    <Players players={matchSummary.valvePlayers} />
  {/if}
</div>

<style>
  .matchId {
    margin-bottom: 10px;
  }

  .winner {
    margin-bottom: 10px;
  }

  .radiant {
    color: green;
  }

  .dire {
    color: red;
  }
</style>
