<script>
  import selectedMatch from '../stores/selectedMatch';
  import selectedHero from '../stores/selectedHero';
  import OpenDotaLink from './OpenDotaLink.svelte';
  import dotaWindow from '../stores/dotaWindow';
  const { matchSummary } = $selectedMatch;

  const returnToReplays = () => {
    $selectedMatch = null;
  };

  const returnToDetails = () => {
    $selectedHero = null;
  };

  const handleOpenReplay = async () => {
    const response = await fetch(`http://localhost:8080/navigation/open-replay/${matchSummary.match_id}`);
    const json = await response.json();
  }
</script>

{#if !$selectedHero}
  <h1 class="title">Match Details - <OpenDotaLink /></h1>
{:else}
  <h1 class="title">
    Hero Details - {$selectedHero.unitLocalized} - <OpenDotaLink />
  </h1>
{/if}
<div class="summary">
  <div class={matchSummary.gameWinnerObject.class}>
    {matchSummary.gameWinnerObject.string}
  </div>
  <div>
    {`Ended ${matchSummary.endDateObject.endDate} at ${matchSummary.endDateObject.endTime}`}
  </div>
  {#if !$selectedHero}
    <div class="help">
      Click hero portrait to see details. Click row to see kills.
    </div>
    <button on:click={returnToReplays}>Return to replays</button>
  {:else}
    <button on:click={returnToDetails}>Return to match details</button>
  {/if}
  {#if $dotaWindow && $dotaWindow.status === 'ok'}
    <button on:click={handleOpenReplay}>Open Replay in Dota 2</button>
  {/if}
</div>

<style>
  .title {
    font-family: 'Crimson Pro', serif;
    font-size: var(--text-xl);
    color: var(--text-primary);
    font-weight: 700;
    padding: var(--spacing-lg) var(--spacing-xl);
    margin: 0;
  }

  .summary {
    padding: 0 var(--spacing-xl) var(--spacing-lg) var(--spacing-xl);
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
    animation: fadeIn 0.5s ease-out;
  }

  .summary > div {
    color: var(--text-secondary);
    font-size: var(--text-sm);
    font-family: 'JetBrains Mono', monospace;
  }

  .summary button {
    background: var(--bg-elevated);
    border: 1px solid var(--border-primary);
    color: var(--text-primary);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: var(--text-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    display: flex;
    align-items: center;
    transition: all var(--transition-base);
  }

  .summary button:hover {
    background: var(--accent-blue);
    color: var(--text-inverse);
    border-color: var(--accent-blue);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(88, 147, 223, 0.4);
  }

  .radiant {
    color: var(--radiant-accent) !important;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: var(--text-base) !important;
    text-shadow: 0 0 15px var(--radiant-glow);
  }

  .dire {
    color: var(--dire-accent) !important;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: var(--text-base) !important;
    text-shadow: 0 0 15px var(--dire-glow);
  }

  .help {
    color: var(--text-muted);
    font-weight: 600;
    font-style: italic;
    font-size: var(--text-xs);
    font-family: 'IBM Plex Sans', sans-serif;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
