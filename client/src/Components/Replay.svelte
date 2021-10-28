<script>
  import { onMount } from 'svelte';
  import Match from '../Components/Match.svelte';
  import util from '../util/util';
  export let matchId;

  let error = '';
  let buttonDisabled = false;
  let matchSummary = null;

  onMount(async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/matches/summary/${matchId}`,
      );
      matchSummary = await response.json();
      matchSummary = { ...matchSummary, valvePlayers: [] };
      for (const key in matchSummary) {
        if (key.includes('Hero')) {
          matchSummary['valvePlayers'].push(
            util.getValveName(matchSummary[key]),
          );
        }
      }
      matchSummary = matchSummary;
      console.log(matchSummary);
    } catch (err) {
      console.error(err);
      error = err;
    }
  });

  const parseReplay = async () => {
    buttonDisabled = true;
    try {
      const response = await fetch(`http://localhost:8080/replays/${matchId}`, {
        method: 'POST',
      });

      matchSummary = await response.json();

      console.log(matchSummary);
    } catch (error) {
      console.error(error);
    }
  };
</script>

<div class="replay">
  <Match {matchId} {matchSummary} />
  {#if error}
    <button disabled={buttonDisabled} on:click={parseReplay}
      >Parse Replay</button
    >
  {/if}
</div>

<style>
  .replay {
    margin-bottom: 20px;
  }
</style>
