<script lang="ts">
  import Item from './Item.svelte';

  export let row;
  export let col;
</script>

<div class="items">
  {#each row.items as item}
    <Item {item} />
  {/each}
</div>

<style>
  .items {
    min-width: 288px;
    max-width: 288px;
  }
</style>
