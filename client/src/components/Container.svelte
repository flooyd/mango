<script>
  export let team;
</script>

<div class={`container ${team}`}>
  <slot></slot>
</div>

<style>
  .container {
    height: calc(100vh - 180px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--spacing-lg);
    position: relative;
    border-radius: var(--radius-lg);
    margin: var(--spacing-md);
    transition: all var(--transition-slow);
  }

  .container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.03;
    pointer-events: none;
    background-image:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.03) 2px,
        rgba(255, 255, 255, 0.03) 4px
      );
  }

  .radiant {
    background:
      radial-gradient(ellipse at top left, var(--radiant-primary) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(29, 77, 46, 0.6) 0%, transparent 50%),
      var(--bg-secondary);
    border: 1px solid var(--radiant-accent);
    box-shadow:
      inset 0 0 60px var(--radiant-shadow),
      0 8px 32px var(--radiant-shadow),
      0 0 80px -20px var(--radiant-glow);
  }

  .dire {
    background:
      radial-gradient(ellipse at top left, var(--dire-primary) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(77, 26, 26, 0.6) 0%, transparent 50%),
      var(--bg-secondary);
    border: 1px solid var(--dire-accent);
    box-shadow:
      inset 0 0 60px var(--dire-shadow),
      0 8px 32px var(--dire-shadow),
      0 0 80px -20px var(--dire-glow);
  }

  .container::-webkit-scrollbar-thumb {
    background: var(--bg-elevated);
  }

  .radiant::-webkit-scrollbar-thumb {
    background: var(--radiant-secondary);
  }

  .dire::-webkit-scrollbar-thumb {
    background: var(--dire-secondary);
  }
</style>
