<script>
  import { onMount } from 'svelte';

  import selectedHero from '../stores/selectedHero';
  import selectedMatch from '../stores/selectedMatch';

  const handleClickTitle = () => {
    $selectedMatch = null;
    $selectedHero = null;
  };

  const handleClickBringToTop = async () => {
    const response = await fetch('http://localhost:8080/navigation/bring-to-top');
    const status = response.json();
  }

  let dotaWindow = null;

  onMount(async () => {
    const response = await fetch(`http://localhost:8080/navigation/get-window`);
    dotaWindow = await response.json();
  });
</script>

<header>
  <div on:click={handleClickTitle} class="title">Dota Replays</div>
  {#if dotaWindow && dotaWindow.status === 'ok'}
    <div class="dota2Window">
      <div>Dota 2 is running - Main Menu</div>
      <button on:click={handleClickBringToTop}>Bring to top</button>
    </div>
  {:else if dotaWindow && dotaWindow.status === 'no dota'}
    <div>Dota 2 is not running.</div>
  {/if}
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

  .dota2Window {
    font-size: 20px;
    font-weight: 400;
    display: flex;
    align-items: center;
  }

  button {
    height: 25px;
    background: white;
    border: 1px solid #333;
    color: #333;
    border-radius: 5px;
    font-weight: bold;
    padding: 8px;
    display: flex;
    align-items: center;
    margin-left: 13px;
  }

  button:hover {
    background: blue;
    color: white;
  }

  .title:hover {
    color: blue;
    cursor: pointer;
  }
</style>
