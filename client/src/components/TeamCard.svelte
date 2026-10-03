<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { TeamVM, KillVM } from '../lib/details';
  import { fmtThousands } from '../lib/heroAssets';
  import PlayerRow from './PlayerRow.svelte';

  export let team: TeamVM;

  const dispatch = createEventDispatcher<{ jump: KillVM }>();
  $: name = team.side === 'radiant' ? 'Radiant' : 'Dire';
</script>

<div class="card">
  <div class="team-header {team.side}">
    <div class="left">
      <span class="teamName {team.side}">{name}</span>
      <span class="kills">{team.kills}</span>
      <span class="killsLabel">KILLS</span>
    </div>
    <div class="stats">
      <div class="stat"><span class="label">Net Worth</span><span class="val">{fmtThousands(team.networth)}</span></div>
      <div class="stat"><span class="label">Towers</span><span class="val">{team.towers}</span></div>
      <div class="stat"><span class="label">GPM avg</span><span class="val">{team.gpm}</span></div>
      <div class="stat"><span class="label">XPM avg</span><span class="val">{team.xpm}</span></div>
    </div>
  </div>

  <table class="tbl">
    <thead>
      <tr>
        <th style="width:220px;">Hero</th>
        <th style="width:38px;text-align:right;">LVL</th>
        <th style="width:110px;">K / D / A</th>
        <th style="width:78px;text-align:right;">LH / DN</th>
        <th style="width:60px;text-align:right;">GPM</th>
        <th style="width:60px;text-align:right;">XPM</th>
        <th style="width:80px;text-align:right;">Net W.</th>
        <th style="width:110px;">KP %</th>
        <th>Items</th>
        <th style="width:22px;"></th>
      </tr>
    </thead>
    {#each team.players as player (player.slot)}
      <PlayerRow {player} on:jump={(e) => dispatch('jump', e.detail)} />
    {/each}
  </table>
</div>

<style>
  .card {
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-radius: 6px;
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .team-header {
    position: relative;
    padding: 14px 18px;
    border-bottom: 1px solid var(--line);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .team-header.radiant {
    background: linear-gradient(90deg, var(--radiant-soft) 0%, transparent 60%), var(--bg-2);
  }
  .team-header.dire {
    background: linear-gradient(90deg, var(--dire-soft) 0%, transparent 60%), var(--bg-2);
  }
  .team-header::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
  }
  .team-header.radiant::before { background: var(--radiant); box-shadow: 0 0 10px var(--radiant-glow); }
  .team-header.dire::before { background: var(--dire); box-shadow: 0 0 10px var(--dire-glow); }
  .left { display: flex; align-items: baseline; gap: 12px; }
  .teamName {
    font-family: var(--serif);
    font-weight: 800;
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  .teamName.radiant { color: var(--radiant); }
  .teamName.dire { color: var(--dire); }
  .kills { font-family: var(--mono); font-size: 22px; font-weight: 700; color: var(--text-1); }
  .killsLabel { font-family: var(--sans); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-3); font-weight: 600; }
  .stats { display: flex; gap: 24px; }
  .stat { display: flex; flex-direction: column; gap: 3px; text-align: right; }
  .stat .val { font-family: var(--mono); font-size: 14px; font-weight: 600; color: var(--text-1); }
  .tbl { width: 100%; border-collapse: separate; border-spacing: 0; }
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
</style>
