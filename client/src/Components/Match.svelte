<script lang="ts">
  import Players from './Players.svelte';
  import util from '../util/util';
  import selectedMatch from '../stores/selectedMatch';

  export let matchSummary;
  export let matchId;

  let endDate: string | null = null;
  let endTime: string | null = null;

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

  const getEndDate = () => {
    console.log(matchSummary.endTime);
    const endTimeProcessed = util.getEndDateAndTime(matchSummary.endTime);
    return `Match ended on ${endTimeProcessed.endDate} at ${endTimeProcessed.endTime}`;
  };
</script>

<div class="match" on:click={getMatchDetails}>
  <div class="content">
    <div class="matchId">Match ID: {matchId}</div>
    {#if (matchSummary && matchSummary.gameWinner) === 2}
      <div class="winner radiant">Radiant Victory!</div>
      <div class="endDate" />
    {:else if matchSummary && matchSummary.gameWinner === 3}
      <div class="winner dire">Dire Victory!</div>
    {/if}
    {#if matchSummary}
      <div class="endDate">{getEndDate()}</div>
      <div class="kills">
        Radiant: {matchSummary.radiantKills} kills | Dire: {matchSummary.direKills}
        kills
      </div>
      <Players players={matchSummary.valvePlayers} />
    {/if}
  </div>
</div>

<style>
  
  .matchId,
  .winner,
  .endDate,
  .kills {
    margin-bottom: 10px;
  }

  .matchId {
    font-weight: bold;
  }

  .radiant {
    color: green;
  }

  .dire {
    color: red;
  }
</style>
