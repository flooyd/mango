<script lang="ts">
  import selectedMatch from '../stores/selectedMatch';
  import { deriveMatch } from '../lib/matchVm';
  import { processDetails } from '../lib/details';
  import { API } from '../lib/nav';
  import MatchHeader from './MatchHeader.svelte';
  import TeamsView from './TeamsView.svelte';
  import KillLog from './KillLog.svelte';

  const { matchSummary, matchDetails } = $selectedMatch;
  const match = deriveMatch(matchSummary.match_id, matchSummary);
  const data = processDetails(matchSummary, matchDetails);

  let activeTab: 'teams' | 'log' = 'teams';

  function back() {
    $selectedMatch = null;
  }

  async function reparse() {
    const matchId = matchSummary.match_id;
    $selectedMatch = 'loading';
    try {
      await fetch(`${API}/replays/${matchId}`, { method: 'POST' });
      const [s, d] = await Promise.all([
        fetch(`${API}/matches/summary/${matchId}`).then((r) => r.json()),
        fetch(`${API}/matches/details/${matchId}`).then((r) => r.json()),
      ]);
      $selectedMatch = { matchSummary: s, matchDetails: d };
    } catch (err) {
      console.error('Reparse failed', err);
      // Restore previous view
      $selectedMatch = { matchSummary, matchDetails };
    }
  }
</script>

<MatchHeader {match} on:back={back} on:reparse={reparse} />

<div class="tabs">
  <button class="tab" class:active={activeTab === 'teams'} on:click={() => (activeTab = 'teams')}>
    ▤ Teams
  </button>
  <button class="tab" class:active={activeTab === 'log'} on:click={() => (activeTab = 'log')}>
    ☰ Kill Log
    <span class="badge" class:activeBadge={activeTab === 'log'}>{data.log.length}</span>
  </button>
</div>

{#if activeTab === 'teams'}
  <TeamsView {data} />
{:else}
  <KillLog kills={data.log} allHeroes={data.allHeroes} />
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
  .tab.active { color: var(--text-1); border-bottom-color: var(--blue); }
  .badge {
    font-family: var(--mono);
    font-size: 10px;
    padding: 1px 6px;
    background: var(--bg-3);
    color: var(--text-3);
    border-radius: 10px;
    font-weight: 700;
  }
  .badge.activeBadge { background: var(--blue-soft); color: var(--blue); }
</style>
