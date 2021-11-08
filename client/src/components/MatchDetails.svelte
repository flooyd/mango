<script lang="ts">
  import selectedHero from '../stores/selectedHero';
  import HeroDetails from './HeroDetails.svelte';
  import MatchDetailsTeams from './MatchDetailsTeams.svelte';
  import MatchHeader from './MatchHeader.svelte';
</script>

<MatchHeader />
{#if !$selectedHero}
  <div class="tableContainer tableContainerRadiant">
    <div class="tableName">Radiant</div>
    <MatchDetailsTeams team="radiant" />
  </div>
  <div class="tableContainer tableContainerDire">
    <div class="tableName">Dire</div>
    <MatchDetailsTeams team="dire" />
  </div>
{:else}
  <HeroDetails />
{/if}

<style>
  :global(.tableContainer.table) {
    text-align: left;
    overflow-x: auto;
    display: block;
    overflow-y: scroll;
    table-layout: fixed;
    margin: 0 auto;
    margin: 0 auto;
  }

  .tableContainer .tableName {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .tableContainer {
    border-radius: 4px;
    padding-top: 10px;
    padding: 13px;
    padding-left: 0px;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 25px;
    overflow-x: auto;
    padding-left: 13px;
  }

  :global(.tableContainerRadiant) {
    box-shadow: 2px 2px 5px 2px #008000;
    color: green;
  }

  :global(.tableContainerDire) {
    box-shadow: 2px 2px 5px 2px #ffb8b8;
    color: red;
  }
</style>
