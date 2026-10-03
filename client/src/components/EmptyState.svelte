<script lang="ts">
  export let replayPath: string = 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/replays';
</script>

<div class="empty">
  <div class="cards">
    <div class="mini back2"></div>
    <div class="mini back1"></div>
    <div class="mini main">
      <div class="miniRow"></div>
      <div class="miniScore"></div>
      <div class="miniBar"></div>
      <div class="miniHeroes"></div>
    </div>
  </div>
  <h2 class="heading serif">No replays yet</h2>
  <p class="body">
    Drop Dota 2 replay files into your replays folder and they'll show up here, ready to parse and
    explore. Each replay is indexed locally — nothing leaves your machine.
  </p>
  <div class="pathChip">{replayPath}</div>
</div>

<style>
  .empty {
    max-width: 580px;
    margin: 80px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    animation: fadeIn 240ms ease-out;
  }
  .cards { position: relative; width: 260px; height: 150px; margin-bottom: 32px; }
  .mini {
    position: absolute;
    inset: 0;
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-radius: 6px;
    box-shadow: var(--shadow-md);
  }
  .back1 { transform: rotate(-6deg) translateY(6px); opacity: 0.55; }
  .back2 { transform: rotate(7deg) translateY(10px); opacity: 0.3; }
  .main { padding: 18px; display: flex; flex-direction: column; gap: 12px; }
  .miniRow { height: 12px; width: 50%; background: var(--bg-4); border-radius: 3px; }
  .miniScore { height: 24px; width: 35%; background: var(--bg-4); border-radius: 3px; }
  .miniBar { height: 4px; width: 100%; background: var(--bg-4); border-radius: 2px; }
  .miniHeroes { height: 24px; width: 80%; background: var(--bg-4); border-radius: 3px; }
  .heading { font-size: 28px; font-weight: 800; color: var(--text-1); margin-bottom: 12px; }
  .body { font-size: 14px; color: var(--text-2); max-width: 460px; line-height: 1.6; margin-bottom: 20px; }
  .pathChip {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-2);
    background: var(--bg-3);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    padding: 8px 12px;
    word-break: break-all;
  }
</style>
