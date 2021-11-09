<script lang="ts">
  import Players from './Players.svelte';
  import util from '../util/util';
  import selectedMatch from '../stores/selectedMatch';
  import { onMount } from 'svelte';

  export let matchSummary;
  export let matchId;

  $: if (matchSummary) {
    matchSummary.endDateObject = util.getEndDateAndTimeObject(
      matchSummary.endTime,
    );
    matchSummary.gameWinnerObject = util.getGameWinnerObject(
      matchSummary.gameWinner,
    );
    //getMatchDetails();
  }

  const getMatchDetails = async () => {
    $selectedMatch = 'loading';
    const response = await fetch(
      `http://localhost:8080/matches/details/${matchId}`,
    );
    const matchDetails = await response.json();
    $selectedMatch = {
      matchSummary,
      matchDetails,
    };
    console.log($selectedMatch);
  };
</script>

<div class="match" on:click={getMatchDetails}>
  <div class="content">
    <div class="matchId">Match ID: {matchId}</div>
    {#if matchSummary}
      <div class={matchSummary.gameWinnerObject.class}>
        {matchSummary.gameWinnerObject.string}
      </div>
      <div class="endDate">
        {`Ended ${matchSummary.endDateObject.endDate} at ${matchSummary.endDateObject.endTime}`}
      </div>
      <Players players={matchSummary.valvePlayers} />
    {/if}
  </div>
</div>

<style>
  .matchId,
  .radiant,
  .dire,
  .endDate,
  .kills {
    margin-bottom: 10px;
    font-size: 16px;
  }

  .matchId {
    font-weight: bold;
    font-size: 20px;
  }

  .radiant {
    color: green;
  }

  .dire {
    color: red;
  }

</style>
