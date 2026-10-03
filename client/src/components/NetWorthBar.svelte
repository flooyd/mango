<script lang="ts">
  export let rad: number;
  export let dire: number;
  export let height: number = 4;
  $: total = (rad || 0) + (dire || 0);
  $: radPct = total > 0 ? ((rad || 0) / total) * 100 : 50;
  $: direPct = total > 0 ? ((dire || 0) / total) * 100 : 50;
</script>

<div class="bar" style="height: {height}px;">
  <div class="rad" style="width: {radPct}%;"></div>
  <div class="dire" style="width: {direPct}%;"></div>
</div>

<style>
  .bar {
    border-radius: 2px;
    background: var(--bg-3);
    overflow: hidden;
    display: flex;
  }
  .bar > div { height: 100%; transition: width 200ms ease; }
  .rad  { background: var(--radiant); }
  .dire { background: var(--dire); }
</style>
