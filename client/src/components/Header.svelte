<script>
  import { onMount } from 'svelte';

  import selectedHero from '../stores/selectedHero';
  import selectedMatch from '../stores/selectedMatch';
  import dotaWindow from '../stores/dotaWindow';

  const handleClickTitle = () => {
    $selectedMatch = null;
    $selectedHero = null;
  };

  const handleClickBringToTop = async () => {
    const response = await fetch('http://localhost:8080/navigation/bring-to-top');
    const status = response.json();
  }

  onMount(async () => {
    const response = await fetch(`http://localhost:8080/navigation/get-window`);
    const dotaWindowJson = await response.json();
    console.log('hi');
    $dotaWindow = dotaWindowJson;
  });
</script>

<header>
  <div on:click={handleClickTitle} class="title">Dota Replays</div>
  {#if $dotaWindow && $dotaWindow.status === 'ok'}
    <div class="dota2Window">
      <div>Dota 2 is running - Main Menu</div>
      <button on:click={handleClickBringToTop}>Bring to top</button>
    </div>
  {:else if $dotaWindow && $dotaWindow.status === 'no dota'}
    <div>Dota 2 is not running.</div>
  {/if}
</header>

<style>
  header {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-primary);
    box-shadow: var(--shadow-lg);
    display: flex;
    padding: var(--spacing-lg) var(--spacing-xl);
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;
    backdrop-filter: blur(10px);
  }

  header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--accent-blue) 25%,
      var(--accent-purple) 75%,
      transparent 100%
    );
    opacity: 0.5;
  }

  .title {
    font-family: 'Crimson Pro', serif;
    font-size: var(--text-2xl);
    font-weight: 900;
    color: var(--text-primary);
    letter-spacing: -0.5px;
    transition: all var(--transition-base);
    cursor: pointer;
    position: relative;
    text-shadow: 0 0 20px rgba(88, 147, 223, 0.3);
  }

  .title:hover {
    color: var(--accent-blue);
    transform: translateY(-1px);
    text-shadow: 0 0 30px rgba(88, 147, 223, 0.6);
  }

  .dota2Window {
    font-size: var(--text-base);
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    color: var(--text-secondary);
    animation: fadeIn 0.5s ease-out;
  }

  button {
    background: var(--bg-elevated);
    border: 1px solid var(--accent-blue);
    color: var(--accent-blue);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: var(--text-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    display: flex;
    align-items: center;
    transition: all var(--transition-base);
    box-shadow: 0 0 10px rgba(88, 147, 223, 0.2);
  }

  button:hover {
    background: var(--accent-blue);
    color: var(--bg-primary);
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(88, 147, 223, 0.5);
  }

  button:active {
    transform: translateY(0);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
