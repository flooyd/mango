<script lang="ts">
  import selectedHero from '../stores/selectedHero';
  import mapTime from '../stores/mapTime';
  import HeroDetails from './HeroDetails.svelte';
  import MatchDetailsTeams from './MatchDetailsTeams.svelte';
  import MatchHeader from './MatchHeader.svelte';
  import MapVisualization from './MapVisualization.svelte';
  import MiniMap from './MiniMap.svelte';

  let showMap = false;
  let showPip = false;

  // React to kill clicks - auto-switch to map view
  $: if ($mapTime.shouldShowMap && !showMap) {
    showMap = true;
  }

  // Explicit click handlers that also update the mapTime store
  function showTeamsView(e: MouseEvent) {
    e.stopPropagation();
    // Reset mapTime store to prevent reactive statement from overriding
    mapTime.update(s => ({ ...s, shouldShowMap: false }));
    showMap = false;
  }

  function showMapView(e: MouseEvent) {
    e.stopPropagation();
    mapTime.update(s => ({ ...s, shouldShowMap: true }));
    showMap = true;
  }

  function togglePip(e: MouseEvent) {
    e.stopPropagation();
    showPip = !showPip;
  }

</script>

<MatchHeader />

<div class="viewToggle">
  <button class:active={!showMap} on:click={showTeamsView}>
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
    </svg>
    Teams
  </button>
  <button class:active={showMap} on:click={showMapView}>
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
    </svg>
    Map
  </button>
  <button class="pipToggle" class:active={showPip} on:click={togglePip} title="Picture-in-Picture Map">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
    </svg>
    PiP
  </button>
</div>

{#if showMap}
  <MapVisualization />
{/if}

{#if !$selectedHero && !showMap}
  <div class="tableContainer tableContainerRadiant">
    <div class="tableName">Radiant</div>
    <MatchDetailsTeams team="radiant" />
  </div>
  <div class="tableContainer tableContainerDire">
    <div class="tableName">Dire</div>
    <MatchDetailsTeams team="dire" />
  </div>
{:else if !showMap}
  <HeroDetails />
{/if}

<!-- Floating mini-map for PiP mode -->
{#if showPip && !showMap}
  <div class="pipContainer">
    <MiniMap on:expand={() => { showMap = true; showPip = false; }} />
  </div>
{/if}

<style>
  .viewToggle {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
    margin: var(--spacing-lg);
    position: relative;
    z-index: 1000 !important;
    animation: slideIn 0.5s ease-out;
    isolation: isolate;
  }

  .viewToggle button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-weight: 600;
    transition: all var(--transition-fast);
    cursor: pointer !important;
    pointer-events: auto !important;
    user-select: none;
    touch-action: manipulation;
    position: relative;
    z-index: 1;
  }

  .viewToggle button:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
    border-color: var(--accent-blue);
  }

  .viewToggle button.active {
    background: var(--accent-blue);
    border-color: var(--accent-blue);
    color: var(--text-primary);
  }

  .viewToggle button svg {
    opacity: 0.8;
  }

  .viewToggle button.active svg {
    opacity: 1;
  }

  :global(.tableContainer.table) {
    text-align: left;
    overflow-x: auto;
    display: block;
    overflow-y: scroll;
    table-layout: fixed;
    margin: 0 auto;
  }

  .tableContainer {
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    overflow-x: auto;
    position: relative;
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    transition: all var(--transition-base);
    animation: slideIn 0.5s ease-out;
  }

  .tableContainer .tableName {
    font-family: 'Crimson Pro', serif;
    font-size: var(--text-2xl);
    font-weight: 900;
    margin-bottom: var(--spacing-lg);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  :global(.tableContainerRadiant) {
    border-color: var(--radiant-accent);
    box-shadow:
      inset 0 0 40px var(--radiant-shadow),
      0 4px 16px var(--radiant-shadow),
      0 0 60px -20px var(--radiant-glow);
  }

  :global(.tableContainerRadiant .tableName) {
    color: var(--radiant-accent);
    text-shadow: 0 0 20px var(--radiant-glow);
  }

  :global(.tableContainerDire) {
    border-color: var(--dire-accent);
    box-shadow:
      inset 0 0 40px var(--dire-shadow),
      0 4px 16px var(--dire-shadow),
      0 0 60px -20px var(--dire-glow);
  }

  :global(.tableContainerDire .tableName) {
    color: var(--dire-accent);
    text-shadow: 0 0 20px var(--dire-glow);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .hidden {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .viewToggle,
    .tableContainer {
      animation: none;
    }
  }

  .pipToggle {
    margin-left: var(--spacing-md);
  }

  .pipContainer {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg), 0 0 30px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease-out;
  }
</style>
