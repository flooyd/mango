<script lang="ts">
  export let value: number; // 0-100
  $: color = value >= 60 ? 'var(--radiant)' : value >= 40 ? 'var(--text-1)' : 'var(--dire)';
</script>

<div class="kp">
  <div class="track">
    <div class="fill" style="width: {Math.min(value, 100)}%; background: {color};"></div>
  </div>
  <span class="num" style="color: {color};">{value}%</span>
</div>

<style>
  .kp { display: flex; align-items: center; gap: 8px; }
  .track {
    flex: 1;
    height: 4px;
    background: var(--bg-3);
    border-radius: 2px;
    overflow: hidden;
  }
  .fill { height: 100%; transition: width 200ms ease; }
  .num {
    font-family: var(--mono);
    font-size: 11px;
    width: 34px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
</style>
