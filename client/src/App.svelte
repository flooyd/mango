<script lang="ts">
  import Header from './components/Header.svelte';
  import MatchDetails from './components/MatchDetails.svelte';
  import Replays from './components/Replays.svelte';
  import selectedMatch from './stores/selectedMatch';
</script>

<main>
  <Header />
  <div class="content">
    {#if !$selectedMatch}
      <Replays />
    {/if}
    {#if $selectedMatch && $selectedMatch !== 'loading'}
      <MatchDetails />
    {/if}
    {#if $selectedMatch == 'loading'}
      <img src="../giphy.gif" alt="loading gif"/>
    {/if}
  </div>
</main>

<style>
  main {
    position: relative;
    min-height: 100vh;
    z-index: 1;
  }

  .content {
    padding: var(--spacing-lg);
    font-size: var(--text-base);
    animation: fadeIn 0.5s ease-out;
  }

  .content img {
    display: block;
    margin: var(--spacing-2xl) auto;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.02);
    }
  }
</style>
