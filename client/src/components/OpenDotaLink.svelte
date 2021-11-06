<script>
  import selectedMatch from '../stores/selectedMatch';
</script>

<a target="__blank" title="View on OPENDOTA" href={`https://opendota.com/matches/${$selectedMatch.matchSummary.match_id}`}
  >{$selectedMatch.matchSummary.match_id}</a
>

<style>
  a {
    text-decoration: none;
  }

  a:visited {
    color: blue;
  }
</style>
