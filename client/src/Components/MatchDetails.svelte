<script lang="ts">
  import selectedMatch from '../stores/selectedMatch';
  import SvelteTable from 'svelte-table';

  const {matchSummary, matchDetails} = $selectedMatch

  const rows = matchDetails.last10Intervals;
  console.log(rows);

  const returnToReplays = () => {
    $selectedMatch = null;
  }
</script>

<h1 class="title">Match Details</h1>
<div class="summary">
  <div>{`Ended ${matchSummary.endDateObject.endDate} at ${matchSummary.endDateObject.endTime}`}</div>
</div>
<br/>
<button on:click={returnToReplays}>Return to replays</button>


<style>
  .title {
    font-size: 31px;
  }

  .summary {
    margin-top: 10px;
  }
</style>