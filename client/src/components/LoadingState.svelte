<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export interface QueueItem {
    matchId: string;
    status: 'done' | 'parsing' | 'queued';
    stage: string;
  }

  export let queue: QueueItem[] = [];

  const dispatch = createEventDispatcher<{ cancel: void; open: string }>();

  $: done = queue.filter((q) => q.status === 'done').length;
  $: inProgress = queue.filter((q) => q.status === 'parsing').length;

  function statusLabel(s: QueueItem['status']) {
    return s === 'done' ? 'DONE' : s === 'parsing' ? 'PARSING' : 'QUEUED';
  }
  function statusColor(s: QueueItem['status']) {
    return s === 'done' ? 'var(--radiant)' : s === 'parsing' ? 'var(--blue)' : 'var(--text-3)';
  }
</script>

<div class="loadingWrap">
  <div class="toolbar">
    <h1 class="title serif">Replays</h1>
    <div class="statusPill">
      <span class="spinner"></span>
      PARSING REPLAYS · {done} of {queue.length} done · {inProgress} in progress
    </div>
    <button class="btn sm" on:click={() => dispatch('cancel')}>Cancel queue</button>
  </div>

  <div class="list">
    {#each queue as item (item.matchId)}
      <div class="card row" class:parsing={item.status === 'parsing'} class:shimmer={item.status === 'parsing'}>
        <div class="indicator">
          {#if item.status === 'done'}
            <span class="check">✓</span>
          {:else if item.status === 'parsing'}
            <span class="spinner big"></span>
          {:else}
            <span class="dot"></span>
          {/if}
        </div>
        <div class="idCol">
          <div class="label">Match ID</div>
          <div class="idVal">{item.matchId}</div>
        </div>
        <div class="statusCol" style="color: {statusColor(item.status)};">{statusLabel(item.status)}</div>
        <div class="stage" class:queued={item.status === 'queued'}>{item.stage}</div>
        <div class="action">
          {#if item.status === 'done'}
            <button class="btn ghost sm" on:click={() => dispatch('open', item.matchId)}>Open match →</button>
          {:else if item.status === 'parsing'}
            <button class="btn ghost sm" on:click={() => dispatch('cancel')}>Cancel</button>
          {:else}
            <span class="dashMark">—</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="banner">
    <span class="i">i</span>
    Parsing happens in the background — feel free to keep browsing. We'll surface each match as soon as it's ready.
  </div>

  <div class="skeletons">
    {#each Array(3) as _}
      <div class="card skel"></div>
    {/each}
  </div>
</div>

<style>
  .loadingWrap { padding: 0 0 32px; }
  .toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 28px;
    border-bottom: 1px solid var(--line);
  }
  .title { font-size: 28px; font-weight: 700; }
  .statusPill {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--blue);
    background: var(--blue-soft);
    border: 1px solid rgba(93, 169, 233, 0.35);
    border-radius: 4px;
    padding: 6px 10px;
  }
  .btn.sm { font-size: 11px; padding: 5px 10px; margin-left: auto; }
  .statusPill + .btn.sm { margin-left: auto; }
  .list { display: flex; flex-direction: column; gap: 16px; padding: 20px 28px; }
  .card {
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-radius: 6px;
    box-shadow: var(--shadow-sm);
  }
  .row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 18px;
    position: relative;
  }
  .row.parsing { border-color: var(--blue); box-shadow: 0 0 0 1px var(--blue), var(--shadow-sm); }
  .indicator { width: 32px; display: flex; justify-content: center; }
  .check {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--radiant-soft);
    border: 1px solid var(--radiant);
    color: var(--radiant);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-3); }
  .idCol { width: 130px; }
  .idVal { font-family: var(--mono); font-size: 13px; font-weight: 700; margin-top: 3px; }
  .statusCol { width: 110px; font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: 0.06em; }
  .stage { flex: 1; font-family: var(--mono); font-size: 11px; color: var(--text-2); }
  .stage.queued { font-style: italic; color: var(--text-3); }
  .dashMark { color: var(--text-3); }
  .spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid var(--bg-4); border-top-color: var(--blue);
    animation: spin 0.9s linear infinite;
    display: inline-block;
  }
  .spinner.big { width: 18px; height: 18px; }
  .banner {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 28px;
    padding: 12px 16px;
    background: var(--bg-3);
    border: 1px solid var(--line);
    border-radius: 6px;
    font-size: 12px;
    color: var(--text-2);
  }
  .i {
    width: 16px; height: 16px; border-radius: 50%;
    background: var(--blue-soft); color: var(--blue);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 10px; font-weight: 700;
    flex-shrink: 0;
  }
  .skeletons { display: flex; flex-direction: column; gap: 16px; padding: 16px 28px; opacity: 0.5; }
  .skel { height: 64px; }
</style>
