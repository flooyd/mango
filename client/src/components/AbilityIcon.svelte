<script lang="ts">
  import { abilityIconUrl } from '../lib/heroAssets';

  export let name: string;
  export let size: number = 22;
</script>

<div
  class="abilityIcon"
  title={name}
  style="width: {size}px; height: {size}px; background-image: url({abilityIconUrl(name)});"
></div>

<style>
  .abilityIcon {
    background-color: var(--bg-3);
    background-size: cover;
    background-position: center;
    border-radius: 2px;
    display: inline-block;
    flex-shrink: 0;
    box-shadow: inset 0 0 0 1px var(--line);
  }
</style>
