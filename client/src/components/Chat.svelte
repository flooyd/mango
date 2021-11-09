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
    margin-bottom: 20px;
  }

  .message {
    display: flex;
    align-items: center;
    font-size: 16px;
  }

  .message * {
    margin-right: 8px;
  }

  .time {
    min-width: 40px;
  }
  .messageActual {
    font-weight: bold;
  }
</style>
