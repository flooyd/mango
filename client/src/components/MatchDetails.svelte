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
  }

  .tableContainer {
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    overflow-x: auto;
    position: relative;
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    transition: all var(--transition-base);
    animation: slideIn 0.5s ease-out;
  }

  .tableContainer .tableName {
    font-family: 'Crimson Pro', serif;
    font-size: var(--text-2xl);
    font-weight: 900;
    margin-bottom: var(--spacing-lg);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  :global(.tableContainerRadiant) {
    border-color: var(--radiant-accent);
    box-shadow:
      inset 0 0 40px var(--radiant-shadow),
      0 4px 16px var(--radiant-shadow),
      0 0 60px -20px var(--radiant-glow);
  }

  :global(.tableContainerRadiant .tableName) {
    color: var(--radiant-accent);
    text-shadow: 0 0 20px var(--radiant-glow);
  }

  :global(.tableContainerDire) {
    border-color: var(--dire-accent);
    box-shadow:
      inset 0 0 40px var(--dire-shadow),
      0 4px 16px var(--dire-shadow),
      0 0 60px -20px var(--dire-glow);
  }

  :global(.tableContainerDire .tableName) {
    color: var(--dire-accent);
    text-shadow: 0 0 20px var(--dire-glow);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
