<script lang="ts">
  // Shell that owns the tab switch between Teams and Kill Log.
  // Wire to your existing $selectedMatch store.
  //
  // TODO: extract Teams view into its own TeamsView.svelte that
  // takes a Match and renders the two team tables + player rows.
  import KillLog from './KillLog.svelte';

  export let matchId: string;
  export let kills: any[] = [];
  export let allHeroKeys: string[] = [];

  let activeTab: 'teams' | 'log' = 'teams';

  function handleJump(event: CustomEvent<any>) {
    // TODO: hit your jump-to-tick API
    console.log('Jump to tick', event.detail);
  }
</script>

<div class="tabs">
  <button
    class="tab"
    class:active={activeTab === 'teams'}
    on:click={() => activeTab = 'teams'}
  >
    ▤ Teams
  </button>
  <button
    class="tab"
    class:active={activeTab === 'log'}
    on:click={() => activeTab = 'log'}
  >
    ☰ Kill Log
    <span class="badge" class:activeBadge={activeTab === 'log'}>{kills.length}</span>
  </button>
</div>

{#if activeTab === 'teams'}
  <!-- TODO: <TeamsView ... /> -->
  <div class="placeholder">Teams view goes here — see source/interactive-detail.jsx · TeamsView for spec.</div>
{:else}
  <KillLog {kills} {allHeroKeys} on:jump={handleJump} />
{/if}

<style>
  .tabs {
    padding: 14px 28px 0;
    display: flex;
    gap: 4px;
    align-items: center;
    border-bottom: 1px solid var(--line);
  }
  .tab {
    padding: 10px 14px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 120ms ease;
  }
  .tab.active {
    color: var(--text-1);
    border-bottom-color: var(--blue);
  }
  .badge {
    font-family: var(--mono);
    font-size: 10px;
    padding: 1px 6px;
    background: var(--bg-3);
    color: var(--text-3);
    border-radius: 10px;
    font-weight: 700;
  }
  .badge.activeBadge {
    background: var(--blue-soft);
    color: var(--blue);
  }
  .placeholder {
    padding: 60px 28px;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 12px;
    text-align: center;
  }
</style>
