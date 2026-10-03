<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { PlayerRowVM, KillVM } from '../lib/details';
  import HeroPortrait from './HeroPortrait.svelte';
  import Pill from './Pill.svelte';
  import KpBar from './KpBar.svelte';
  import ItemSlots from './ItemSlots.svelte';
  import KillStrip from './KillStrip.svelte';
  import Caret from './Caret.svelte';
  import { fmtThousands } from '../lib/heroAssets';

  export let player: PlayerRowVM;

  let expanded = false;
  const dispatch = createEventDispatcher<{ jump: KillVM }>();
</script>

<tbody>
  <tr class="row" class:expanded on:click={() => (expanded = !expanded)}>
    <td class="hero">
      <div class="heroCell">
        <HeroPortrait name={player.heroKey} width={44} />
        <div class="names">
          <div class="heroName">{player.heroName}</div>
          {#if player.playerName}<div class="playerName">{player.playerName}</div>{/if}
        </div>
      </div>
    </td>
    <td class="num lvl">{player.level}</td>
    <td class="kda">
      <div class="kdaCell">
        <span class="kdaNums">
          {player.kills}<span class="slash"> / </span>{player.deaths}<span class="slash"> / </span>{player.assists}
        </span>
        {#if player.fb}<Pill variant="dire">FB</Pill>{/if}
      </div>
    </td>
    <td class="num lhdn">{player.lh}<span class="slash"> / </span><span class="dn">{player.dn}</span></td>
    <td class="num gpm">{player.gpm}</td>
    <td class="num xpm">{player.xpm}</td>
    <td class="num netw">{fmtThousands(player.networth)}</td>
    <td class="kp"><KpBar value={player.kp} /></td>
    <td class="items"><ItemSlots items={player.items} /></td>
    <td class="caret"><Caret dir={expanded ? 'up' : 'down'} size={6} color="var(--text-3)" /></td>
  </tr>
  {#if expanded}
    <tr class="expansion">
      <td colspan="10">
        <KillStrip kills={player.killList} on:jump={(e) => dispatch('jump', e.detail)} />
      </td>
    </tr>
  {/if}
</tbody>

<style>
  tbody { border: none; }
  .row { transition: background 120ms ease; cursor: pointer; }
  .row:hover td { background: var(--bg-3); }
  .row.expanded td { background: var(--bg-3); }
  td {
    padding: 10px 14px;
    color: var(--text-1);
    border-bottom: 1px solid var(--line);
    vertical-align: middle;
    font-family: var(--mono);
    font-size: 12px;
  }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .hero { width: 220px; }
  .lvl { width: 38px; font-weight: 600; }
  .kda { width: 110px; }
  .lhdn { width: 78px; }
  .gpm, .xpm { width: 60px; }
  .netw { width: 80px; font-weight: 600; }
  .kp { width: 110px; }
  .caret { width: 22px; text-align: center; }
  .heroCell { display: flex; align-items: center; gap: 10px; }
  .names { display: flex; flex-direction: column; gap: 3px; }
  .heroName { font-family: var(--sans); font-weight: 600; font-size: 13px; color: var(--text-1); }
  .playerName { font-family: var(--mono); font-size: 10px; color: var(--text-3); }
  .kdaCell { display: flex; align-items: center; gap: 8px; }
  .kdaNums { white-space: nowrap; }
  .slash { color: var(--text-3); }
  .dn { color: var(--text-3); }
  .expansion td { padding: 0; border-bottom: 1px solid var(--line); }
</style>
