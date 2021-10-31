<script>
  import { onMount } from 'svelte';
  import Replay from './Replay.svelte';
  let replays = null;
  onMount(async () => {
    const response = await fetch('http://localhost:8080/replays');
    replays = await response.json();
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
    {#each replays as replay}
      <Replay matchId={replay} />
    {/each}
  {/if}
</div>

<style>
  div {
    margin-bottom: 20px;
  }
  span {
    font-weight: bold;
  }
</style>
