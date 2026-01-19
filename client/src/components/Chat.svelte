<script>
  import selectedMatch from '../stores/selectedMatch';
  import selectedHero from '../stores/selectedHero';
  import Container from './Container.svelte';
  import util from '../util/util';

  const { matchDetails } = $selectedMatch;
  const { baseSteamStatic } = util;

  console.log(matchDetails);

  let chatMessages = [];
  if ($selectedHero) {
    console.log('hi');
    chatMessages = matchDetails.Chat.filter(
      (c) => c.slot === $selectedHero.slot,
    );
    console.log(chatMessages);
  }
</script>

<Container team={$selectedHero.slot < 5 ? 'radiant' : 'dire'}>
  <div class="chat">Chat</div>
  <div>
    {#if $selectedHero}
      {#each chatMessages as message}
        <div class="message">
          <div>At</div>
          <div class="time">{message.time}</div>
          <img
            alt={$selectedHero.unitLocalized}
            src={`${baseSteamStatic}/${$selectedHero.unitValve}.png?`}
            title={selectedHero.unitLocalized}
          />
          <div>said:</div>
          <div class="messageActual">{message.key}</div>
        </div>
      {/each}
    {/if}
  </div>
</Container>

<style>
  .chat {
    font-family: 'Crimson Pro', serif;
    font-size: var(--text-2xl);
    font-weight: 900;
    margin-bottom: var(--spacing-xl);
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .message {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
    background: var(--bg-elevated);
    border: 1px solid var(--border-secondary);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    transition: all var(--transition-fast);
    animation: slideIn 0.3s ease-out;
  }

  .message:hover {
    background: var(--bg-tertiary);
    border-color: var(--border-primary);
    transform: translateX(4px);
  }

  .message img {
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-primary);
    box-shadow: var(--shadow-sm);
  }

  .time {
    font-family: 'JetBrains Mono', monospace;
    min-width: 60px;
    color: var(--text-muted);
    font-weight: 700;
  }

  .messageActual {
    font-weight: 700;
    color: var(--text-primary);
    flex: 1;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
