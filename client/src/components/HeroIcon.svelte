<script lang="ts">
  import { heroIconUrl, heroDisplayName } from '../lib/heroAssets';

  export let name: string;
  export let size: number = 32;
</script>

<div
  class="heroIcon"
  title={heroDisplayName(name)}
  style="width: {size}px; height: {size}px; background-image: url({heroIconUrl(name)});"
></div>

<style>
  .heroIcon {
    background-color: var(--bg-3);
    background-size: cover;
    background-position: center;
    border-radius: 3px;
    display: inline-block;
    flex-shrink: 0;
    box-shadow: inset 0 0 0 1px var(--line);
  }
</style>
