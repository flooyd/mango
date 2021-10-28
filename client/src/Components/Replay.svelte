<script>
  import { onMount } from 'svelte';
  export let matchId;

  let error = '';
  let buttonDisabled = false;
  let matchSummary = null;

  onMount(async () => {
    try {
      const response = await fetch(`http://localhost:8080/matches/summary/${matchId}`);
      const matchSummary = await response.json();
      console.log(matchSummary);
    } catch (err) {
      error = err;
    }
  });

  const parseReplay = async () => {
    buttonDisabled = true;
    try {
      const response = await fetch(`http://localhost:8080/replays/${matchId}`, {
      method: 'POST'
    });

    matchSummary = await response.json();
    console.log(matchSummary)
    } catch (error) {
      console.error(error);
    }
  };
</script>

<div class="replay">
  {matchId}
  {#if error}
    <button disabled={buttonDisabled} on:click={parseReplay}
      >Parse Replay</button
    >
  {/if}
</div>

<style>
  .replay {
    border: 1px solid black;
    width: 600px;
    margin-bottom: 20px;
  }
</style>
