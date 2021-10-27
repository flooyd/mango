<script>
  import {onMount} from 'svelte';
  export let matchId;

  let error = '';

  onMount(async () => {
    try {
      const response = await fetch(`http://localhost:8080/matches/${matchId}`)
    const matchSummary = await response.json();
    } catch(err) {
      error = err;
    }
  })

  const parseReplay = async () => {
    console.log('parse')
  }
</script>

<div class="replay">
  {matchId}
  {#if error}
     <button on:click={parseReplay}>Parse Replay</button>
  {/if}
</div>

<style>
  .replay {
    border: 1px solid black;
    width: 600px;
    margin-bottom: 20px;
  }
</style>