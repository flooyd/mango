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
  .replays {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    animation: fadeIn 0.6s ease-out;
  }

  .replay {
    min-width: 600px;
    max-width: 900px;
  }

  div {
    color: var(--text-secondary);
    font-size: var(--text-lg);
    line-height: 1.8;
  }

  span {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    color: var(--accent-gold);
    background: var(--bg-elevated);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
