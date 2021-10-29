<script lang="ts">
  import selectedMatch from '../stores/selectedMatch';

  const returnToReplays = () => {
    $selectedMatch = null;
  }
</script>

<h1>Match Details</h1>
<br/>
<button on:click={returnToReplays}>Return to replays</button>