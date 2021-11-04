<script lang="ts">
  import selectedMatch from '../stores/selectedMatch';
  import SvelteTable from 'svelte-table';
  import TableHero from './TableHero.svelte';

  const { matchSummary, matchDetails } = $selectedMatch;

  console.log(matchDetails.firstBlood);

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
      key: 'unitLocalized',
      title: 'Hero',
      value: (v) => v.unitLocalized,
      class: 'tableCell',
      headerClass: 'tableCell',
      renderComponent: TableHero,
    },
    {
      key: 'kda',
      title: 'K / D / A',
      value: (v) => v.kills + ' / ' + v.deaths + ' / ' + v.assists,
      class: 'tableCell',
      headerClass: 'tableCell',
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
      value: (v) => v.items,
      class: 'tableCell',
      headerClass: 'tableCell',
    },
    {
      key: 'gold',
      title: 'Gold',
      value: (v) => v.gold,
      class: 'tableCell',
      headerClass: 'tableCell',
    },
    {
      key: 'firstblood',
      title: 'First Blood?',
      value: (v) => v.firstblood_claimed === 1 ? 'True' : '',
      class: 'tableCell',
      headerClass: 'tableCell',
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
<div class="summary">
  <div class={matchSummary.gameWinnerObject.class}>
    {matchSummary.gameWinnerObject.string}
  </div>
  <div>
    {`Ended ${matchSummary.endDateObject.endDate} at ${matchSummary.endDateObject.endTime}`}
  </div>
  <button on:click={returnToReplays}>Return to replays</button>
</div>
<div class="tableContainer tableContainerRadiant">
  <div class="tableName">Radiant</div>
<SvelteTable
  on:clickRow={handleClickRow}
  classNameRow="tableRow"
  classNameThead="tableHeader"
  classNameTable="table"
  classNameCell="tableCell"
  {columns}
  rows={rows.slice(0, 5)}
/>
</div>
<div class="tableContainer tableContainerDire">
  <div class="tableName">Dire</div>
<SvelteTable
  on:clickRow={handleClickRow}
  classNameRow="tableRow"
  classNameThead="tableHeader"
  classNameTable="table tableDire"
  {columns}
  rows={rows.slice(-5)}
/>
</div>


<style>
  .title {
    font-size: 20px;
    color: #333;
    font-weight: bold;
  }

  .summary {
    margin-top: 10px;
    font-size: 16px;
    display: flex;
    align-items: center;
    color: #333;
  }

  .summary > div {
    height: 25px;
    margin-right: 13px;
    color: #333;
  }

  .summary button {
    height: 25px;
    background: white;
    border: 1px solid #333;
    color: #333;
    border-radius: 5px;
    margin-top: -8px;
    font-weight: bold;
    font-size: 16px;
    padding: 8px;
    display: flex;
    align-items: center;
  }

  .summary button:hover {
    color: white;
    background: blue;
  }

  :global(.table) {
    text-align: left;
  }

  .tableContainer {
    border-radius: 3px;
    padding-top: 10px;
    padding: 13px;
    padding-left: 0px;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 13px;
    width: 1513px;
  }

  :global(.tableContainerRadiant) {
    box-shadow: 3px 3px 3px 0px #008000;
    color: green;
  }

  :global(.tableContainerDire) {
    box-shadow: 3px 3px 5px 0px #FFB8B8;
    color: red;
  }

  .radiant {
    color: green !important;
  }

  .dire {
    color: red !important;
  }

  .radiant,
  .dire {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  :global(td.tableCell) {
    width: 200px !important;
    max-width: 200px !important;
    overflow: hidden;
    padding-top: 8px;
    padding-left: 13px;
    color: #333;
    font-weight: 400;
  }

  :global(.tableHeader .tableCell) {
    font-weight: bold;
  }

  :global(.tableRow:hover) {
    background: #333;
    cursor: pointer;
  }

  :global(.tableRow:hover td) {
    color: white;
  }
</style>
