<script>
  import selectedHero from '../stores/selectedHero';
  import selectedMatch from '../stores/selectedMatch';

  const handleClickTitle = () => {
    $selectedMatch = null;
    $selectedHero = null;
  };
</script>

<header>
  <div on:click={handleClickTitle} class="title">Dota Replays</div>
  <div class="about">About</div>
</header>

<style>
  header {
    box-shadow: rgba(0, 0, 255, 0.5) 0px -4px 9px 2px;
    display: flex;
    padding: 20px;
    font-size: 25px;
    justify-content: space-between;
    align-items: center;
    color: #333;
    font-weight: bold;
  }

  .about {
    font-size: 20px;
    font-weight: 400;
  }

  .about:hover,
  .title:hover {
    color: blue;
    cursor: pointer;
  }
</style>
