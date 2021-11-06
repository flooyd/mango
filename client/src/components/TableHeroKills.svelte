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
    padding: 5px 0px;
    padding-left: 13px;
    min-height: 50px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background: #ccc;
    max-width: 100%;
  }
</style>
