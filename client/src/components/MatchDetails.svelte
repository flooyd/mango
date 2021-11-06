<script lang="ts">
  import selectedMatch from '../stores/selectedMatch';
import MatchDetailsTeams from './MatchDetailsTeams.svelte';

  const { matchSummary } = $selectedMatch;

  const returnToReplays = () => {
    $selectedMatch = null;
  };
</script>

<h1 class="title">Match Details - {matchSummary.match_id}</h1>
<div class="summary">
  <div class={matchSummary.gameWinnerObject.class}>
    {matchSummary.gameWinnerObject.string}
  </div>
  <div>
    {`Ended ${matchSummary.endDateObject.endDate} at ${matchSummary.endDateObject.endTime}`}
  </div>
  <button on:click={returnToReplays}>Return to replays</button>
</div>
<div class="tableContainer tableContainerRadiant">
  <div class="tableName">Radiant</div>
  <MatchDetailsTeams team='radiant'/>
</div>
<div class="tableContainer tableContainerDire">
  <div class="tableName">Dire</div>
  <MatchDetailsTeams team='dire'/>
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

  :global(.tableContainer.table) {
    text-align: left;
    overflow-x: auto;
    display: block;
    overflow-y: scroll;
    table-layout: fixed;
    margin: 0 auto;
    margin: 0 auto;
  }

  .tableContainer .tableName {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .tableContainer {
    border-radius: 4px;
    padding-top: 10px;
    padding: 13px;
    padding-left: 0px;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 13px;
    overflow-x: auto;
    padding-left: 13px;
  }

  :global(.tableContainerRadiant) {
    box-shadow: 2px 2px 5px 2px #008000;
    color: green;
  }

  :global(.tableContainerDire) {
    box-shadow: 2px 2px 5px 2px #ffb8b8;
    color: red;
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
</style>
