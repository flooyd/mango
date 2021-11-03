<script>
  import { onMount } from 'svelte';
  import Replay from './Replay.svelte';
  let replays = null;
  onMount(async () => {
    const response = await fetch('http://localhost:8080/replays');
    replays = await response.json()
    replays = replays.sort(function(a, b){return b-a});
  });
</script>

<div class="replays">
  {#if !replays}
    <div>
      Loading...if you continue to see this message, make sure your replay
      folder is not empty.
    </div>
    <div>
      Replays should be in <span
        >C:/Program Files (x86)/Steam/steamapps/common/dota 2
        beta/game/dota/replays</span
      >
    </div>
  {:else}
  <div class="replays">
    {#each replays as replay}
    <div class="replay">
      <Replay matchId={replay} />
    </div>
      
    {/each}
  </div>
  {/if}
</div>

<style>
  .replay {
    margin-right: 25px;
  }
  .replays {
    display: flex;
    flex-wrap: wrap;
  }
  div {
    margin-bottom: 20px;
  }
  span {
    font-weight: bold;
  }
</style>
