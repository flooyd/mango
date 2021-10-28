<script>
  import Players from './Players.svelte';

  export let matchSummary;
  export let matchId;
  $: if (matchSummary) {
    console.log(matchSummary.valvePlayers);
  }
</script>

<div>
  <div class="matchId">{matchId}</div>
  {#key matchSummary}
    {#if matchSummary}
      <Players players={matchSummary.valvePlayers} />
    {/if}
  {/key}
</div>

<style>
  .matchId {
    margin-bottom: 10px;
  }
</style>