<script lang="ts">
  import { itemIconUrl } from '../lib/heroAssets';

  export let name: string | null = null;
  export let size: number = 26;
</script>

{#if name}
  <div
    class="itemIcon"
    title={name}
    style="width: {size}px; background-image: url({itemIconUrl(name)});"
  ></div>
{:else}
  <div class="itemSlotEmpty" style="width: {size}px; height: {size * 0.75}px;"></div>
{/if}

<style>
  .itemIcon {
    background-color: var(--bg-3);
    background-size: cover;
    background-position: center;
    border-radius: 3px;
    aspect-ratio: 4 / 3;
    display: inline-block;
    flex-shrink: 0;
    box-shadow: inset 0 0 0 1px var(--line);
  }
  .itemSlotEmpty {
    background: repeating-linear-gradient(
      135deg,
      var(--bg-3) 0px, var(--bg-3) 3px,
      var(--bg-2) 3px, var(--bg-2) 4px
    );
    border-radius: 3px;
    display: inline-block;
    flex-shrink: 0;
    box-shadow: inset 0 0 0 1px var(--line);
  }
</style>
