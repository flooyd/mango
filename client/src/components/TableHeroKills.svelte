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
    border-top: 1px solid var(--border-primary);
    padding: var(--spacing-md);
    min-height: 50px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-sm);
    background: var(--bg-elevated);
    max-width: 100%;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 500px;
    }
  }
</style>
