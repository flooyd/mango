<script>
  export let team;
  import selectedMatch from '../stores/selectedMatch';
  import SvelteTable from 'svelte-table';
  import TableHero from './TableHero.svelte';
  import TableHeroItems from './TableHeroItems.svelte';
  import TableHeroKills from './TableHeroKills.svelte';

  const { matchSummary, matchDetails } = $selectedMatch;

  const rows = matchDetails.Last10Intervals;
  const items = matchDetails.EndGameItems;
  console.log(items);
  const pvpKills = matchDetails.pvpKills;

  let direExpandedRows = [];
  let radiantExpandedRows = [];

  for (const row of rows) {
    row.unitValve = '';
    if (row.slot < 5) {
      row.unitValve = matchSummary[`radiantHero${row.slot}`].replace(
        'npc_dota_hero_',
        '',
      );
      row.unitLocalized = row.unitValve
        .split('_')
        .map((name) => {
          return name[0].toUpperCase() + name.substring(1);
        })
        .join(' ');
    } else if (row.slot < 10) {
      row.unitValve = matchSummary[`direHero${row.slot - 5}`].replace(
        'npc_dota_hero_',
        '',
      );
      row.unitLocalized = row.unitValve
        .split('_')
        .map((name) => {
          return name[0].toUpperCase() + name.substring(1);
        })
        .join(' ');
    }
    console.log(row.unitValve, row.unitLocalized);
    row.items = items.filter((item) => item.targetname === row.unitValve);
    row.pvpKills = pvpKills.filter(
      (kill) => kill.attackername === row.unitValve,
    );
  }
  matchDetails.rows = rows;
  const cols = [
    {
      key: 'unitLocalized',
      title: 'Hero',
      value: (v) => v.unitLocalized,
      class: 'tableCell',
      headerClass: 'tableCell tableHero',
      renderComponent: TableHero,
    },
    {
      key: 'level',
      title: 'LVL',
      value: (v) => v.level,
      class: 'tableCell',
      headerClass: 'tableCell',
    },
    {
      key: 'kda',
      title: 'K / D / A',
      value: (v) => v.kills + ' / ' + v.deaths + ' / ' + v.assists + (v.firstblood_claimed === 1 ? ' - FB' : ''),
      class: 'tableCell kda ',
      headerClass: 'tableCell kda',
    },
    {
      key: 'lh/d',
      title: 'LH / D',
      value: (v) => v.lh + ' / ' + v.denies,
      class: 'tableCell',
      headerClass: 'tableCell',
    },
    {
      key: 'items',
      title: 'Items',
      value: '',
      class: 'tableCell',
      headerClass: 'tableCell',
      renderComponent: TableHeroItems,
    },
    {
      key: 'gold',
      title: 'Gold',
      value: (v) => v.gold,
      class: 'tableCell',
      headerClass: 'tableCell',
    },
  ];

  const handleClickRow = (e, team) => {
    const row = e.detail.row;
    if (!row.$expanded) {
      if (team === 'radiant') {
        radiantExpandedRows = [...radiantExpandedRows, row.unitLocalized];
      } else {
        direExpandedRows = [...direExpandedRows, row.unitLocalized];
      }
    } else {
      if (team === 'radiant') {
        radiantExpandedRows = radiantExpandedRows.filter(
          (unitLocalized) => unitLocalized !== row.unitLocalized,
        );
      } else {
        direExpandedRows = direExpandedRows.filter(
          (unitLocalized) => unitLocalized !== row.unitLocalized,
        );
      }
    }
  };
</script>

<SvelteTable
  on:clickRow={(e) => handleClickRow(e, 'radiant')}
  classNameRow="tableRow"
  classNameThead="tableHeader"
  classNameTable="table"
  columns={cols}
  rows={team === 'radiant' ? rows.slice(0, 5) : rows.slice(-5)}
  expandRowKey="unitLocalized"
  bind:expanded={radiantExpandedRows}
>
  <svelte:fragment slot="expanded" let:row
    ><TableHeroKills {row} /></svelte:fragment
  >
</SvelteTable>

<style>
  :global(.tableCell) {
    min-width: 100px;
    padding: var(--spacing-md) var(--spacing-lg);
    color: var(--text-primary);
    font-weight: 600;
    border-top: 1px solid var(--border-primary);
    border-right: 1px solid var(--border-secondary);
    display: table-cell;
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--text-sm);
    transition: all var(--transition-fast);
  }

  :global(.tableCell.kda) {
    max-width: fit-content;
    display: table-cell;
    color: var(--text-primary);
  }

  :global(.tableHero) {
    width: 220px;
    font-family: 'IBM Plex Sans', sans-serif;
  }

  :global(.tableHeader .tableCell) {
    font-weight: 700;
    padding-bottom: var(--spacing-lg);
    border: none;
    min-width: 150px;
    text-align: left;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: var(--text-xs);
    font-family: 'IBM Plex Sans', sans-serif;
  }

  :global(.tableRow) {
    transition: all var(--transition-fast);
    background: transparent;
  }

  :global(.tableRow:hover) {
    cursor: pointer;
    background: var(--bg-tertiary);
  }

  :global(.tableRow:hover .tableCell) {
    color: var(--accent-blue);
  }
</style>
