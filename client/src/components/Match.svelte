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
    matchSummary.durationFormatted = util.formatMatchDuration(
      matchSummary.duration,
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
      <div class="matchInfo">
        <div class="endDate">
          {`Ended ${matchSummary.endDateObject.endDate} at ${matchSummary.endDateObject.endTime}`}
        </div>
        <div class="duration">
          Duration: {matchSummary.durationFormatted}
        </div>
      </div>
      <Players players={matchSummary.valvePlayers} />
    {/if}
  </div>
</div>

<style>
  .match {
    transition: all var(--transition-base);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .matchId {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: var(--text-lg);
    color: var(--text-primary);
    letter-spacing: -0.3px;
  }

  .radiant {
    color: var(--radiant-accent);
    font-weight: 700;
    font-size: var(--text-lg);
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 0 15px var(--radiant-glow);
  }

  .dire {
    color: var(--dire-accent);
    font-weight: 700;
    font-size: var(--text-lg);
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 0 15px var(--dire-glow);
  }

  .matchInfo {
    display: flex;
    gap: var(--spacing-lg);
    align-items: center;
    flex-wrap: wrap;
  }

  .endDate {
    color: var(--text-secondary);
    font-size: var(--text-sm);
    font-family: 'JetBrains Mono', monospace;
  }

  .duration {
    color: var(--accent-blue);
    font-size: var(--text-sm);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    padding: var(--spacing-xs, 4px) var(--spacing-sm);
    background: rgba(88, 147, 223, 0.1);
    border-radius: var(--radius-sm);
    border: 1px solid rgba(88, 147, 223, 0.3);
  }

  .kills {
    margin-bottom: var(--spacing-sm);
    font-size: var(--text-base);
  }
</style>
