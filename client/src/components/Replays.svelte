<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import selectedMatch from '../stores/selectedMatch';
  import { density, sortBy, heroFilter, type SortBy } from '../stores/uiPrefs';
  import { reparseAllNonce } from '../stores/signals';
  import { API } from '../lib/nav';
  import { deriveMatch, unparsedMatch, type MatchVM } from '../lib/matchVm';
  import MatchCard from './MatchCard.svelte';
  import MatchRow from './MatchRow.svelte';
  import HeroFilterDropdown from './HeroFilterDropdown.svelte';
  import EmptyState from './EmptyState.svelte';
  import LoadingState, { type QueueItem } from './LoadingState.svelte';
  import Caret from './Caret.svelte';

  interface Entry {
    matchId: string;
    summary: any | null;
    vm: MatchVM;
  }

  let loading = true;
  let entries: Entry[] = [];
  let parsingQueue: QueueItem[] | null = null;
  let cancelRequested = false;

  let sortOpen = false;
  const sortLabels: Record<SortBy, string> = { date: 'Date', duration: 'Duration', kills: 'Total kills' };

  async function fetchSummary(matchId: string): Promise<any | null> {
    try {
      const res = await fetch(`${API}/matches/summary/${matchId}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json && json.match_id ? json : null;
    } catch {
      return null;
    }
  }

  function toEntry(matchId: string, summary: any | null): Entry {
    return {
      matchId,
      summary,
      vm: summary ? deriveMatch(matchId, summary) : unparsedMatch(matchId),
    };
  }

  async function loadMatches() {
    loading = true;
    try {
      const ids: string[] = await fetch(`${API}/replays`).then((r) => r.json());
      const summaries = await Promise.all(ids.map((id) => fetchSummary(id)));
      entries = ids.map((id, i) => toEntry(id, summaries[i]));
    } catch (err) {
      console.error('Failed to load replays', err);
      entries = [];
    } finally {
      loading = false;
    }
  }

  onMount(loadMatches);

  // ----- Derived list (filter + sort) -----
  $: availableHeroes = [...new Set(entries.flatMap((e) => e.vm.allHeroes))].filter(Boolean);

  $: visible = (() => {
    let list = entries;
    if ($heroFilter) list = list.filter((e) => e.vm.allHeroes.includes($heroFilter));
    const parsed = list.filter((e) => e.vm.state === 'parsed');
    const unparsed = list.filter((e) => e.vm.state !== 'parsed');
    parsed.sort((a, b) => {
      if ($sortBy === 'duration') return b.vm.durationSec - a.vm.durationSec;
      if ($sortBy === 'kills') return b.vm.totalKills - a.vm.totalKills;
      return b.vm.endTimeUnix - a.vm.endTimeUnix; // date (newest)
    });
    return [...parsed, ...unparsed];
  })();

  $: matchCount = entries.filter((e) => e.vm.state === 'parsed').length;

  // ----- Open a match (load details) -----
  async function openMatch(matchId: string) {
    const entry = entries.find((e) => e.matchId === matchId);
    let summary = entry?.summary;
    $selectedMatch = 'loading';
    try {
      if (!summary) summary = await fetchSummary(matchId);
      const matchDetails = await fetch(`${API}/matches/details/${matchId}`).then((r) => r.json());
      $selectedMatch = { matchSummary: summary, matchDetails };
    } catch (err) {
      console.error('Failed to open match', err);
      $selectedMatch = null;
    }
  }

  // ----- Single parse / reparse -----
  async function reparseOne(matchId: string) {
    const idx = entries.findIndex((e) => e.matchId === matchId);
    if (idx >= 0) {
      entries[idx] = { ...entries[idx], vm: unparsedMatch(matchId, true) };
      entries = entries;
    }
    try {
      await fetch(`${API}/replays/${matchId}`, { method: 'POST' });
      const summary = await fetchSummary(matchId);
      if (idx >= 0) {
        entries[idx] = toEntry(matchId, summary);
        entries = entries;
      }
    } catch (err) {
      console.error('Parse failed', err);
      if (idx >= 0) {
        entries[idx] = toEntry(matchId, entries[idx].summary);
        entries = entries;
      }
    }
  }

  // ----- Reparse all (queue) -----
  async function runReparseAll() {
    if (parsingQueue) return; // already running
    cancelRequested = false;
    const ids = entries.map((e) => e.matchId);
    if (ids.length === 0) return;
    parsingQueue = ids.map((id) => ({ matchId: id, status: 'queued', stage: 'Waiting in queue…' }));

    for (let i = 0; i < ids.length; i++) {
      if (cancelRequested) break;
      parsingQueue[i] = { ...parsingQueue[i], status: 'parsing', stage: 'Reading replay header…' };
      parsingQueue = parsingQueue;
      try {
        const summary = await fetch(`${API}/replays/${ids[i]}`, { method: 'POST' }).then((r) => r.json());
        const idx = entries.findIndex((e) => e.matchId === ids[i]);
        if (idx >= 0) {
          entries[idx] = toEntry(ids[i], summary && summary.match_id ? summary : entries[idx].summary);
          entries = entries;
        }
        parsingQueue[i] = { ...parsingQueue[i], status: 'done', stage: 'Indexed · ready' };
      } catch {
        parsingQueue[i] = { ...parsingQueue[i], status: 'done', stage: 'Failed to parse' };
      }
      parsingQueue = parsingQueue;
    }

    await loadMatches();
    parsingQueue = null;
  }

  function cancelQueue() {
    cancelRequested = true;
    parsingQueue = null;
  }

  // React to "Reparse all replays" from the profile menu.
  // Seed from the current value so re-mounting the list doesn't replay a stale request.
  let lastNonce = get(reparseAllNonce);
  $: if ($reparseAllNonce > lastNonce) {
    lastNonce = $reparseAllNonce;
    runReparseAll();
  }

  function chooseSort(s: SortBy) {
    sortBy.set(s);
    sortOpen = false;
  }
</script>

{#if parsingQueue}
  <LoadingState queue={parsingQueue} on:cancel={cancelQueue} on:open={(e) => openMatch(e.detail)} />
{:else if loading}
  <div class="centerMsg">Loading replays…</div>
{:else if entries.length === 0}
  <EmptyState />
{:else}
  <div class="toolbar">
    <h1 class="title serif">Replays</h1>
    <div class="count">
      <span class="countNum">{matchCount}</span>
      <span class="countLabel">MATCHES</span>
    </div>
    <div class="vdivider"></div>

    <HeroFilterDropdown heroes={availableHeroes} />

    <div class="sortWrap" on:click|stopPropagation>
      <button class="pillBtn" on:click={() => (sortOpen = !sortOpen)}>
        <span class="key">SORT</span>
        <span class="val">{sortLabels[$sortBy]}</span>
        <Caret dir={sortOpen ? 'up' : 'down'} size={5} color="var(--text-3)" />
      </button>
      {#if sortOpen}
        <div class="sortMenu">
          {#each Object.entries(sortLabels) as [key, label]}
            <button class="sortItem" class:active={$sortBy === key} on:click={() => chooseSort(key)}>{label}</button>
          {/each}
        </div>
      {/if}
    </div>

    <div class="densityToggle">
      <button class="seg" class:active={$density === 'cards'} on:click={() => density.set('cards')}>▦ CARDS</button>
      <button class="seg" class:active={$density === 'rows'} on:click={() => density.set('rows')}>☰ ROWS</button>
    </div>
  </div>

  {#if visible.length === 0}
    <div class="centerMsg">No matches for this hero filter.</div>
  {:else if $density === 'cards'}
    <div class="grid">
      {#each visible as e (e.matchId)}
        <MatchCard match={e.vm} on:open={(ev) => openMatch(ev.detail)} on:reparse={(ev) => reparseOne(ev.detail)} />
      {/each}
    </div>
  {:else}
    <div class="rows">
      {#each visible as e (e.matchId)}
        <MatchRow
          match={e.vm}
          summary={e.summary}
          on:open={(ev) => openMatch(ev.detail)}
          on:reparse={(ev) => reparseOne(ev.detail)}
        />
      {/each}
    </div>
  {/if}
{/if}

<svelte:window on:click={() => (sortOpen = false)} />

<style>
  .toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 28px;
    height: 60px;
    border-bottom: 1px solid var(--line);
  }
  .title { font-size: 28px; font-weight: 700; }
  .count { display: flex; align-items: baseline; gap: 6px; }
  .countNum { font-family: var(--mono); font-size: 18px; font-weight: 700; }
  .countLabel { font-family: var(--sans); font-size: 10px; letter-spacing: 0.12em; color: var(--text-3); font-weight: 600; }
  .vdivider { width: 1px; height: 22px; background: var(--line-strong); }
  .sortWrap { position: relative; }
  .pillBtn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 9px;
    background: var(--bg-3);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-2);
    transition: all 150ms ease;
  }
  .pillBtn:hover { border-color: var(--blue); }
  .key { font-size: 10px; letter-spacing: 0.1em; color: var(--text-3); }
  .val { color: var(--text-1); }
  .sortMenu {
    position: absolute;
    top: 38px;
    left: 0;
    min-width: 150px;
    background: var(--bg-3);
    border: 1px solid var(--line-strong);
    border-radius: 6px;
    box-shadow: var(--shadow-lg);
    padding: 4px;
    z-index: 20;
  }
  .sortItem {
    display: block;
    width: 100%;
    text-align: left;
    padding: 7px 10px;
    border-radius: 3px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: var(--sans);
    font-size: 12px;
    color: var(--text-1);
  }
  .sortItem:hover { background: var(--bg-4); }
  .sortItem.active { color: var(--blue); }
  .densityToggle {
    margin-left: auto;
    display: inline-flex;
    background: var(--bg-3);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    padding: 2px;
  }
  .seg {
    padding: 5px 10px;
    border-radius: 3px;
    background: transparent;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    font-weight: 600;
    border: none;
    cursor: pointer;
  }
  .seg.active { background: var(--bg-5); color: var(--text-1); }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 20px 28px 40px;
  }
  .rows { display: flex; flex-direction: column; gap: 6px; padding: 20px 28px 40px; }
  .centerMsg {
    padding: 80px 28px;
    text-align: center;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 13px;
  }
  @media (max-width: 1100px) { .grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
</style>
