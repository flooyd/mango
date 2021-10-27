<script lang="ts">
  import Header from './Components/Header.svelte';
  import Replays from './Components/Replays.svelte';
</script>

<main>
  <Header />
  <div class="content">
    <Replays />
  </div>
</main>

<style>
  .content {
    padding: 20px;
  }
</style>
