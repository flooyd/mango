<script lang="ts">
  import selectedMatch from '../stores/selectedMatch';
  import SvelteTable from 'svelte-table';
  import TableHero from './TableHero.svelte';

  const { matchSummary, matchDetails } = $selectedMatch;

  const rows = matchDetails.last10Intervals;
  for (const row of rows) {
    console.log('process row');
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
  }
  const columns = [
    {
      key: 'unitValve',
      title: 'Hero',
      value: (v) => v.unitLocalized,
      class: 'tableCell',
      headerClass: 'tableHeader',
      renderComponent: TableHero,
    },
    {
      key: 'lh/d',
      title: 'LH / D',
      value: (v) => v.lh + ' / ' + v.denies,
      class: 'tableCell',
      headerClass: 'tableHeader',
    },
    {
      key: 'kda',
      title: 'K / D / A',
      value: (v) => v.kills + ' / ' + v.deaths + ' / ' + v.assists,
      class: 'tableCell',
      headerClass: 'tableHeader',
    },
  ];

  const handleClickRow = (e) => {
    console.log(e.detail.row);
  };

  const returnToReplays = () => {
    $selectedMatch = null;
  };
</script>

<h1 class="title">Match Details - {matchSummary.match_id}</h1>
<div class={matchSummary.gameWinnerObject.class}>
  {matchSummary.gameWinnerObject.string}
</div>
<div class="summary">
  <div>
    {`Ended ${matchSummary.endDateObject.endDate} at ${matchSummary.endDateObject.endTime}`}
  </div>
</div>
<br />
<button on:click={returnToReplays}>Return to replays</button>
<SvelteTable
  on:clickRow={handleClickRow}
  classNameRow="tableRow"
  classNameThead="tableHeader"
  classNameTable="table"
  {columns}
  rows={rows.slice(0,5)}
/>
<SvelteTable
  on:clickRow={handleClickRow}
  classNameRow="tableRow"
  classNameThead="tableHeader"
  classNameTable="table"
  {columns}
  rows={rows.slice(-5)}
/>

<style>
  .title {
    font-size: 31px;
  }

  .summary {
    margin-top: 10px;
  }

  :global(.table) {
    margin-top: 20px;
    text-align: left;
    table-layout: fixed;
  }

  .radiant {
    color: green;
  }

  .dire {
    color: red;
  }

  .radiant,
  .dire {
    margin-top: 10px;
  }

  :global(td) {
    padding: 8px 0px;
    padding-left: 8px;
  }

  :global(.tableHeader) {
    padding-left: 8px;
    padding-bottoM: 8px;
    font-weight: bold;
  }

  :global(.tableRow:hover) {
    background: #333;
    color: white;
    cursor: pointer;
  }
</style>
