<script>
  import Kill from './Kill.svelte';

  export let row;
  const kills = row.pvpKills;
</script>

<div class="kills">
  {#each kills as kill}
    <Kill kill={kill}/>
  {/each}
</div>

<style>
  .kills {
    border-top: 2px solid #333;
    padding: 13px 0px;
    padding-left: 13px;
    min-height: 50px;
    display: flex;
    align-items: center;
  }
</style>
