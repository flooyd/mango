<script lang="ts">
  import ItemIcon from './ItemIcon.svelte';
  export let items: string[] = [];
  // Always render 6 slots; pad with empties.
  $: slots = [...items.slice(0, 6), ...Array(Math.max(0, 6 - items.length)).fill(null)];
</script>

<div class="slots">
  {#each slots as item}
    <ItemIcon name={item} size={24} />
  {/each}
</div>

<style>
  .slots { display: flex; gap: 4px; align-items: center; }
</style>
