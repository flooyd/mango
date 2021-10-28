<script>
  import Players from './Players.svelte';

  export let matchSummary;
  export let matchId;

  const getMatchDetails = async () => {
    const response = await fetch(
      `http://localhost:8080/matches/details/${matchId}`,
    );
    const matchDetails = await response.json();
    console.log(matchDetails);
  };
</script>

<div>
  <div on:click={getMatchDetails} class="matchId">{matchId}</div>
  {#if matchSummary}
    <Players players={matchSummary.valvePlayers} />
  {/if}
</div>

<style>
  .matchId {
    margin-bottom: 10px;
  }
</style>
