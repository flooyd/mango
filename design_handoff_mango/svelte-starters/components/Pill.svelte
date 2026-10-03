<script lang="ts">
  export let variant: 'default' | 'bare' | 'blue' | 'rad' | 'dire' = 'default';
</script>

<span class="pill {variant}">
  <slot />
</span>

<style>
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: var(--mono);
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 3px;
    border: 1px solid var(--line-strong);
    color: var(--text-2);
    background: var(--bg-3);
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .bare {
    background: transparent;
    border-color: var(--line);
  }
  .blue {
    color: var(--blue);
    border-color: rgba(93, 169, 233, 0.35);
    background: var(--blue-soft);
  }
  .rad {
    color: var(--radiant);
    border-color: rgba(102, 187, 106, 0.35);
    background: var(--radiant-soft);
  }
  .dire {
    color: var(--dire);
    border-color: rgba(224, 78, 63, 0.35);
    background: var(--dire-soft);
  }
</style>
