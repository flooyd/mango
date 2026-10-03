<script lang="ts">
  import { theme, type Theme } from '../stores/theme';
</script>

<div class="toggle">
  {#each ['light', 'dark'] as t}
    <button
      class="seg"
      class:active={$theme === t}
      on:click={() => theme.set(t as Theme)}
    >
      <span class="glyph">{t === 'light' ? '☀' : '☾'}</span>
      {t.toUpperCase()}
    </button>
  {/each}
</div>

<style>
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    background: var(--bg-3);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    padding: 2px;
  }
  .seg {
    padding: 4px 9px;
    border-radius: 3px;
    background: transparent;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .seg.active {
    background: var(--bg-5);
    color: var(--text-1);
  }
  .glyph {
    display: inline-flex;
    width: 9px;
    height: 9px;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    line-height: 1;
  }
</style>
