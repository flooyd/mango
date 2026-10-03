<script lang="ts">
  import { theme } from './stores/theme';
  import selectedMatch from './stores/selectedMatch';
  import Header from './components/Header.svelte';
  import Replays from './components/Replays.svelte';
  import MatchDetails from './components/MatchDetails.svelte';

  // Ensure the persisted theme is reflected on <html> from first paint.
  $: if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', $theme);
  }
</script>

<main>
  <Header />
  <div class="content">
    {#if !$selectedMatch}
      <Replays />
    {:else if $selectedMatch === 'loading'}
      <div class="loading"><span class="spinner"></span> Loading match…</div>
    {:else}
      {#key $selectedMatch.matchSummary.match_id}
        <MatchDetails />
      {/key}
    {/if}
  </div>
</main>

<style>
  main { min-height: 100vh; }
  .content { animation: fadeIn 240ms ease-out; }
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 120px 28px;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 14px;
  }
  .spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid var(--bg-4); border-top-color: var(--blue);
    animation: spin 0.9s linear infinite;
  }
</style>
