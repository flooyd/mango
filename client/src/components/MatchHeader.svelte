<script>
  import selectedMatch from '../stores/selectedMatch';
  import selectedHero from '../stores/selectedHero';
import OpenDotaLink from './OpenDotaLink.svelte';
  const { matchSummary } = $selectedMatch;

  const returnToReplays = () => {
    $selectedMatch = null;
  };

  const returnToDetails = () => {
    $selectedHero = null;
  };
</script>

{#if !$selectedHero}
  <h1 class="title">Match Details - <OpenDotaLink/></h1>
{:else}
  <h1 class="title">
    Hero Details - {$selectedHero.unitLocalized} - <OpenDotaLink/>
  </h1>
{/if}
<div class="summary">
  <div class={matchSummary.gameWinnerObject.class}>
    {matchSummary.gameWinnerObject.string}
  </div>
  <div>
    {`Ended ${matchSummary.endDateObject.endDate} at ${matchSummary.endDateObject.endTime}`}
  </div>
  {#if !$selectedHero}
    <div class="help">
      Click hero portrait to see details. Click row to see kills.
    </div>
    <button on:click={returnToReplays}>Return to replays</button>
  {:else}
    <button on:click={returnToDetails}>Return to match details</button>
  {/if}
</div>

<style>
  .title {
    font-size: 20px;
    color: #333;
    font-weight: bold;
  }

  .summary {
    margin-top: 10px;
    font-size: 16px;
    display: flex;
    align-items: center;
    color: #333;
  }

  .summary > div {
    height: 25px;
    margin-right: 13px;
    color: #333;
  }

  .summary button {
    height: 25px;
    background: white;
    border: 1px solid #333;
    color: #333;
    border-radius: 5px;
    margin-top: -8px;
    font-weight: bold;
    font-size: 16px;
    padding: 8px;
    display: flex;
    align-items: center;
  }

  .summary button:hover {
    color: white;
    background: blue;
  }

  .radiant {
    color: green !important;
  }

  .dire {
    color: red !important;
  }

  .radiant,
  .dire {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .help {
    font-weight: bold;
  }
</style>
