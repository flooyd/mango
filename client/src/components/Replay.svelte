<script lang="ts">
  import { onMount } from 'svelte';
  import Match from './Match.svelte';
  import util from '../util/util';
  export let matchId;

  let error = '';
  let buttonDisabled = false;
  let matchSummary = null;
  let isHovered = false;
  let isParsing = false;

  onMount(async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/matches/summary/${matchId}`,
      );
      matchSummary = await response.json();
      processMatchSummary();
    } catch (err) {
      console.error(err);
      error = err;
    }
  });

  const processMatchSummary = () => {
    matchSummary = { ...matchSummary, valvePlayers: [] };
    for (const key in matchSummary) {
      if (key.includes('Hero')) {
        matchSummary['valvePlayers'].push(util.getValveName(matchSummary[key]));
      }
    }
    matchSummary = matchSummary;
  };

  const parseReplay = async (event) => {
    event.stopPropagation();
    buttonDisabled = true;
    isParsing = true;
    try {
      const response = await fetch(`http://localhost:8080/replays/${matchId}`, {
        method: 'POST',
      });

      matchSummary = await response.json();
      processMatchSummary();
      error = '';

    } catch (error) {
      console.error(error);
    } finally {
      isParsing = false;
      buttonDisabled = false;
    }
  };
</script>

<div
  class={matchSummary ? "replay special" : "replay"}
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
>
  <Match {matchId} {matchSummary} />
  {#if error && !buttonDisabled}
    <button class="parseButton" on:click={parseReplay}
      >Parse Replay</button
    >
  {:else if matchSummary && isHovered}
    <button class="reparseButton" on:click={parseReplay} disabled={isParsing}>
      {isParsing ? 'Reparsing...' : 'Reparse'}
    </button>
  {/if}
</div>

<style>
  .replay {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
    min-width: fit-content;
  }

  .replay::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--accent-blue) 0%,
      var(--accent-purple) 50%,
      var(--accent-blue) 100%
    );
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .special {
    border-color: var(--border-secondary);
  }

  .special:hover {
    cursor: pointer;
    background: var(--bg-tertiary);
    border-color: var(--accent-blue);
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg), 0 0 30px rgba(88, 147, 223, 0.2);
  }

  .special:hover::before {
    opacity: 1;
  }

  .parseButton {
    margin-top: var(--spacing-md);
    width: 100%;
    background: var(--dire-secondary);
    border: 1px solid var(--dire-accent);
    color: var(--dire-accent);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: var(--text-sm);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .parseButton:hover {
    background: var(--dire-accent);
    color: var(--text-inverse);
    box-shadow: 0 0 20px var(--dire-glow);
  }

  .reparseButton {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    background: var(--accent-blue);
    border: 1px solid var(--accent-blue);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: var(--text-xs);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    z-index: 10;
    box-shadow: var(--shadow-md);
    animation: slideInRight 0.2s ease-out;
  }

  .reparseButton:hover:not(:disabled) {
    background: var(--accent-purple);
    border-color: var(--accent-purple);
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
  }

  .reparseButton:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
