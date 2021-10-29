<script lang="ts">
  import Players from './Players.svelte';
  import util from '../util/util';

  export let matchSummary;
  export let matchId;

  let endDate: string | null = null;
  let endTime: string | null = null;

  const getMatchDetails = async () => {
    const response = await fetch(
      `http://localhost:8080/matches/details/${matchId}`,
    );
    const matchDetails = await response.json();
  };

  const getEndDate = () => {
    console.log(matchSummary.endTime)
    const endTimeProcessed = util.getEndDateAndTime(matchSummary.endTime);
    return `Match ended on ${endTimeProcessed.endDate} at ${endTimeProcessed.endTime}`;
  }
</script>

<div>
  <div on:click={getMatchDetails} class="matchId">Match ID: {matchId}</div>
    {#if (matchSummary && matchSummary.gameWinner) === 2}
    <div class="winner radiant">Radiant Victory!</div>
    <div class="endDate"></div>
    {:else if (matchSummary && matchSummary.gameWinner === 3)}
    <div class="winner dire">Dire Victory!</div>
    {/if}
  {#if matchSummary}
  {#if matchSummary}
     <div class="endDate">{getEndDate()}</div>
     <div class="kills">Radiant: {matchSummary.radiantKills} kills | Dire: {matchSummary.direKills} kills</div>
  {/if}
    <Players players={matchSummary.valvePlayers} />
  {/if}
</div>

<style>
  .matchId, .winner, .endDate, .kills {
    margin-bottom: 10px;
  }

  .radiant {
    color: green;
  }

  .dire {
    color: red;
  }
</style>
