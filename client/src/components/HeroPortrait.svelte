<script lang="ts">
  import { heroPortraitUrl, heroDisplayName } from '../lib/heroAssets';

  export let name: string;
  export let width: number = 44;
</script>

<div
  class="heroPortrait"
  title={heroDisplayName(name)}
  style="width: {width}px; background-image: url({heroPortraitUrl(name)});"
></div>

<style>
  .heroPortrait {
    background-color: var(--bg-3);
    background-size: cover;
    background-position: center;
    border-radius: 4px;
    display: inline-block;
    flex-shrink: 0;
    aspect-ratio: 5 / 3;
    box-shadow: inset 0 0 0 1px var(--line);
  }
</style>
