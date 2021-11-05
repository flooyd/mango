<script lang="ts">
import Item from "./Item.svelte";

  export let row;
  
</script>

<div class="items">
  {#each row.items as item}
    <Item item={item}/>
  {/each}
</div>

<style>
  .items {
    min-width: 288px;
  }
</style>


