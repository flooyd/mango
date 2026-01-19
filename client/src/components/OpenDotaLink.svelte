<script>
  import selectedMatch from '../stores/selectedMatch';
</script>

<a target="__blank" title="View on OPENDOTA" href={`https://opendota.com/matches/${$selectedMatch.matchSummary.match_id}`}
  >{$selectedMatch.matchSummary.match_id}</a
>

<style>
  a {
    text-decoration: none;
    color: var(--accent-blue);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    transition: all var(--transition-fast);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    background: var(--bg-elevated);
    border: 1px solid var(--border-secondary);
  }

  a:hover {
    color: var(--accent-purple);
    border-color: var(--accent-purple);
    background: var(--bg-tertiary);
    transform: translateY(-1px);
    box-shadow: 0 0 15px rgba(199, 146, 234, 0.3);
  }

  a:visited {
    color: var(--accent-blue);
  }

  a:visited:hover {
    color: var(--accent-purple);
  }
</style>
