<script lang="ts">
  import Header from './Components/Header.svelte';
  import MatchDetails from './Components/MatchDetails.svelte';
  import Replays from './Components/Replays.svelte';
  import selectedMatch from './stores/selectedMatch';
</script>

<main>
  <Header />
  <div class="content">
    {#if !$selectedMatch}
      <Replays />
    {:else}
      <MatchDetails />
    {/if}
  </div>
</main>

<style>
  .content {
    padding: 20px;
    font-size: 20px;
  }
</style>
