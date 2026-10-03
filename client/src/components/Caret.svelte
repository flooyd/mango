<script lang="ts">
  export let dir: 'up' | 'down' | 'right' = 'down';
  export let size: number = 6;
  export let color: string = 'currentColor';
  $: rotate = dir === 'down' ? 'rotate(45deg)' : dir === 'up' ? 'rotate(-135deg)' : 'rotate(-45deg)';
</script>

<span
  class="caret"
  style="
    width: {size}px;
    height: {size}px;
    border-right: 1.5px solid {color};
    border-bottom: 1.5px solid {color};
    transform: {rotate};
    margin-bottom: {dir === 'down' ? '2px' : '0'};
  "
></span>

<style>
  .caret { display: inline-block; }
</style>
