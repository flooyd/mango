<script lang="ts">
  // Kill Log tab — filterable + sortable list of every kill in the match.
  //
  // TODO scaffolding — fill in with your real kill data shape.
  // See §4.3 "Kill Log tab" in the README for the full spec.
  import { createEventDispatcher } from 'svelte';
  import HeroIcon    from './HeroIcon.svelte';
  import ItemIcon    from './ItemIcon.svelte';
  import AbilityIcon from './AbilityIcon.svelte';
  import Pill        from './Pill.svelte';
  import { heroDisplayName } from '../lib/heroAssets';
  import type { Kill } from './KillChip.svelte';

  export interface LogEntry extends Kill {
    n: number;
    killer: string;             // hero key
    side: 'rad' | 'dire';
    firstBlood?: boolean;
  }

  export let kills: LogEntry[] = [];
  export let allHeroKeys: string[] = [];

  // Filter state
  let side: 'both' | 'rad' | 'dire' = 'both';
  let killer: string | null = null;
  let victim: string | null = null;
  let inflictorType: 'any' | 'attack' | 'ability' | 'item' = 'any';

  // Sort state
  let sortCol: 'time' | 'killer' | 'victim' = 'time';
  let sortDir: 'asc' | 'desc' = 'asc';

  const dispatch = createEventDispatcher<{ jump: LogEntry }>();

  $: filtered = (() => {
    let arr = kills;
    if (side !== 'both')           arr = arr.filter(k => k.side === side);
    if (killer)                    arr = arr.filter(k => k.killer === killer);
    if (victim)                    arr = arr.filter(k => k.victim === victim);
    if (inflictorType !== 'any')   arr = arr.filter(k => k.inflictorType === inflictorType);

    const sorted = [...arr].sort((a, b) => {
      let cmp = 0;
      if      (sortCol === 'time')   cmp = a.timeSec - b.timeSec;
      else if (sortCol === 'killer') cmp = a.killer.localeCompare(b.killer);
      else if (sortCol === 'victim') cmp = a.victim.localeCompare(b.victim);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  })();

  function sortBy(col: 'time' | 'killer' | 'victim') {
    if (sortCol === col) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortCol = col; sortDir = 'asc'; }
  }
  function clearFilters() {
    side = 'both'; killer = null; victim = null; inflictorType = 'any';
  }
  function fmt(s: number) {
    const m = Math.floor(s / 60); const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }
</script>

<div class="wrap">
  <div class="card">
    <!-- Filter bar -->
    <div class="filterBar">
      <!-- Side segmented -->
      <div class="seg">
        {#each [{v:'both', l:'Both'}, {v:'rad', l:'Radiant'}, {v:'dire', l:'Dire'}] as o}
          <button
            class="segBtn"
            class:active={side === o.v}
            on:click={() => side = o.v as 'both' | 'rad' | 'dire'}
          >{o.l}</button>
        {/each}
      </div>

      <!--
        TODO: HeroDropdown component — for now use a plain select.
        Spec is in README §4.3 "Killer" / "Victim" — 220px popover with hero list.
      -->
      <select bind:value={killer}>
        <option value={null}>Killer: Any</option>
        {#each allHeroKeys as h}
          <option value={h}>{heroDisplayName(h)}</option>
        {/each}
      </select>
      <select bind:value={victim}>
        <option value={null}>Victim: Any</option>
        {#each allHeroKeys as h}
          <option value={h}>{heroDisplayName(h)}</option>
        {/each}
      </select>

      <div class="seg">
        {#each [{v:'any', l:'Any'}, {v:'attack', l:'Attack'}, {v:'ability', l:'Ability'}, {v:'item', l:'Item'}] as o}
          <button
            class="segBtn"
            class:active={inflictorType === o.v}
            on:click={() => inflictorType = o.v as 'any' | 'attack' | 'ability' | 'item'}
          >{o.l}</button>
        {/each}
      </div>

      <span class="count">{filtered.length} of {kills.length} kills</span>
      {#if side !== 'both' || killer || victim || inflictorType !== 'any'}
        <button class="btn ghost sm" on:click={clearFilters}>Clear filters</button>
      {/if}
    </div>

    <!-- Table -->
    <table class="tbl">
      <thead>
        <tr>
          <th style="width:44px;padding-left:18px;">#</th>
          <th style="cursor:pointer;width:80px;" on:click={() => sortBy('time')}>
            Time {sortCol === 'time' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </th>
          <th style="cursor:pointer;" on:click={() => sortBy('killer')}>
            Killer {sortCol === 'killer' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </th>
          <th style="width:28px;"></th>
          <th style="cursor:pointer;" on:click={() => sortBy('victim')}>
            Victim {sortCol === 'victim' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </th>
          <th>Inflictor</th>
          <th style="width:64px;">Side</th>
          <th style="width:100px;text-align:right;">Tick</th>
          <th style="width:80px;text-align:right;"></th>
        </tr>
      </thead>
      <tbody>
        {#if filtered.length === 0}
          <tr><td colspan="9" class="emptyMsg">No kills match these filters.</td></tr>
        {/if}
        {#each filtered as k (k.n)}
          <tr on:click={() => dispatch('jump', k)} class="logRow">
            <td class="t-3" style="padding-left:18px;">{String(k.n).padStart(2, '0')}</td>
            <td style="font-weight:700;">{fmt(k.timeSec)}</td>
            <td>
              <div class="heroCell">
                <HeroIcon name={k.killer} size={26} />
                <span>{heroDisplayName(k.killer)}</span>
                {#if k.firstBlood}
                  <Pill variant="dire">FIRST BLOOD</Pill>
                {/if}
              </div>
            </td>
            <td class="t-3">→</td>
            <td>
              <div class="heroCell">
                <HeroIcon name={k.victim} size={26} />
                <span>{heroDisplayName(k.victim)}</span>
              </div>
            </td>
            <td>
              <div class="infCell">
                {#if k.inflictorType === 'attack'}
                  <span class="atk">ATK</span>
                {:else if k.inflictorType === 'item' && k.inflictor}
                  <ItemIcon name={k.inflictor} size={22} />
                {:else if k.inflictorType === 'ability' && k.inflictor}
                  <AbilityIcon name={k.inflictor} size={22} />
                {/if}
                <span class="infName">
                  {k.inflictorType === 'attack' ? 'basic attack' : (k.inflictor || '').replace(/_/g, ' ')}
                </span>
              </div>
            </td>
            <td>
              <Pill variant={k.side === 'rad' ? 'rad' : 'dire'}>
                {k.side === 'rad' ? 'RAD' : 'DIRE'}
              </Pill>
            </td>
            <td class="num t-3" style="text-align:right;">{k.tick.toLocaleString()}</td>
            <td style="text-align:right;padding-right:18px;">
              <span class="jump">JUMP →</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .wrap { padding: 18px 28px 28px; }
  .card {
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-radius: 6px;
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .filterBar {
    padding: 14px 18px;
    border-bottom: 1px solid var(--line);
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
  .seg {
    display: inline-flex;
    background: var(--bg-3);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    padding: 2px;
  }
  .segBtn {
    padding: 4px 10px;
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
  .segBtn.active { background: var(--bg-5); color: var(--text-1); }
  select {
    background: var(--bg-3);
    color: var(--text-1);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    padding: 5px 8px;
    font-family: var(--mono);
    font-size: 11px;
  }
  .count {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-3);
    margin-left: auto;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--sans);
    font-weight: 600;
    background: var(--bg-3);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    color: var(--text-1);
    cursor: pointer;
  }
  .btn.ghost { background: transparent; border-color: transparent; color: var(--text-2); }
  .btn.sm    { font-size: 11px; padding: 5px 10px; }

  .tbl {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-family: var(--mono);
    font-size: 12px;
  }
  .tbl thead th {
    text-align: left;
    font-family: var(--sans);
    font-weight: 600;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-3);
    padding: 12px 14px;
    background: var(--bg-2);
    border-bottom: 1px solid var(--line);
  }
  .tbl tbody td {
    padding: 10px 14px;
    color: var(--text-1);
    border-bottom: 1px solid var(--line);
    vertical-align: middle;
  }
  .logRow { cursor: pointer; transition: background 120ms ease; }
  .logRow:hover td { background: var(--bg-3); }
  .logRow:hover .jump { color: var(--blue); opacity: 1; }

  .heroCell { display: flex; align-items: center; gap: 8px; }
  .heroCell :global(span) {
    font-family: var(--sans);
    font-size: 12px;
  }
  .infCell { display: flex; align-items: center; gap: 6px; }
  .atk {
    width: 22px; height: 16.5px;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg-4); border-radius: 2px;
    font-family: var(--mono); font-size: 8px; font-weight: 700; color: var(--text-3);
  }
  .infName { font-family: var(--mono); font-size: 10px; color: var(--text-2); }
  .num { font-variant-numeric: tabular-nums; }
  .t-3 { color: var(--text-3); }
  .jump {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--text-3);
    font-weight: 700;
    opacity: 0.6;
  }
  .emptyMsg {
    padding: 40px;
    text-align: center;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 12px;
  }
</style>
