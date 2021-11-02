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
  .content {
    padding: 20px;
    font-size: 20px;
  }
</style>
