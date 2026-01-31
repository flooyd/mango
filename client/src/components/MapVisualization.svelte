<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import selectedMatch from '../stores/selectedMatch';
  import mapTime from '../stores/mapTime';

  const { matchSummary, matchDetails } = $selectedMatch;

  // Audio cues for kills
  const killTimes = new Set(matchDetails.pvpKills?.map((k: any) => k.time) || []);
  let playedKills = new Set<number>();
  let audioContext: AudioContext | null = null;

  function playKillSound() {
    if (!audioContext) audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
  }
  const intervals: any[] = matchDetails.Intervals || [];

  // Get unique times and create a map of positions by time
  // Also track coordinate bounds for auto-scaling
  const timeMap = new Map<number, any[]>();
  let minTime = Infinity;
  let maxTime = -Infinity;
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const interval of intervals) {
    if (interval.x != null && interval.y != null) {
      const time = interval.time;
      if (!timeMap.has(time)) {
        timeMap.set(time, []);
      }
      timeMap.get(time)!.push(interval);
      minTime = Math.min(minTime, time);
      maxTime = Math.max(maxTime, time);

      // Track coordinate bounds
      minX = Math.min(minX, interval.x);
      maxX = Math.max(maxX, interval.x);
      minY = Math.min(minY, interval.y);
      maxY = Math.max(maxY, interval.y);
    }
  }

  // Handle edge case where no position data exists
  if (minTime === Infinity) minTime = 0;
  if (maxTime === -Infinity) maxTime = 0;

  // Initialize from persisted time if available, otherwise use minTime
  const initialTime = $mapTime.currentPlaybackTime !== null ? $mapTime.currentPlaybackTime : minTime;
  let currentTime = Math.max(minTime, Math.min(maxTime, initialTime));
  let isPlaying = false;
  let playInterval: number | null = null;
  let playbackSpeed = 1;

  // Map dimensions
  const MAP_SIZE = 400;

  // Calculate coordinate ranges from actual data with padding
  // Fallback to typical Dota 2 map ranges if no data
  const padding = 5;
  const coordMinX = minX !== Infinity ? minX - padding : 64;
  const coordMaxX = maxX !== -Infinity ? maxX + padding : 192;
  const coordMinY = minY !== Infinity ? minY - padding : 64;
  const coordMaxY = maxY !== -Infinity ? maxY + padding : 192;

  // Use square bounds (largest range) to maintain aspect ratio
  const rangeX = coordMaxX - coordMinX;
  const rangeY = coordMaxY - coordMinY;
  const maxRange = Math.max(rangeX, rangeY);

  // Center the smaller dimension
  const offsetX = (maxRange - rangeX) / 2;
  const offsetY = (maxRange - rangeY) / 2;

  // Convert game coordinates to canvas coordinates
  function gameToCanvas(x: number, y: number): { cx: number; cy: number } {
    const cx = ((x - coordMinX + offsetX) / maxRange) * MAP_SIZE;
    // Y is inverted (game Y increases upward, canvas Y increases downward)
    const cy = MAP_SIZE - ((y - coordMinY + offsetY) / maxRange) * MAP_SIZE;
    return { cx, cy };
  }

  // Get players at current time
  $: playersAtTime = timeMap.get(currentTime) || [];

  // Audio cue: detect kills at current time
  $: if (killTimes.has(currentTime) && !playedKills.has(currentTime) && isPlaying) {
    playedKills.add(currentTime);
    playKillSound();
  }

  // Reset played kills when rewinding
  $: {
    const minPlayed = Math.min(...playedKills);
    if (playedKills.size > 0 && currentTime < minPlayed) {
      playedKills = new Set();
    }
  }

  // Subscribe to external time changes from kill clicks
  $: if ($mapTime.time !== null && $mapTime.time !== currentTime) {
    currentTime = $mapTime.time;
    // Reset the time trigger but preserve currentPlaybackTime
    // Use setTimeout to avoid blocking the render cycle
    setTimeout(() => {
      mapTime.update(s => ({ ...s, time: null, shouldShowMap: false }));
    }, 0);
  }

  // Get hero info for a slot
  function getHeroName(slot: number): string {
    if (slot < 5) {
      return matchSummary[`radiantHero${slot}`]?.replace('npc_dota_hero_', '') || `Player ${slot + 1}`;
    } else {
      return matchSummary[`direHero${slot - 5}`]?.replace('npc_dota_hero_', '') || `Player ${slot + 1}`;
    }
  }

  // Format time as MM:SS
  function formatTime(seconds: number): string {
    const negative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${negative ? '-' : ''}${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Playback controls
  function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playInterval = window.setInterval(() => {
        if (currentTime < maxTime) {
          currentTime += 1;
        } else {
          isPlaying = false;
          if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
          }
        }
      }, 1000 / playbackSpeed);
    } else if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
    }
  }

  function resetPlayback() {
    currentTime = minTime;
    if (isPlaying) {
      togglePlay();
    }
  }

  let mapContainer: HTMLDivElement;

  // Keyboard controls
  function handleKeydown(e: KeyboardEvent) {
    // Only handle keyboard shortcuts when the map is focused or mouse is over it
    if (!mapContainer) return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        currentTime = Math.max(minTime, currentTime - (e.shiftKey ? 10 : 1));
        break;
      case 'ArrowRight':
        e.preventDefault();
        currentTime = Math.min(maxTime, currentTime + (e.shiftKey ? 10 : 1));
        break;
      case 'Home':
        e.preventDefault();
        currentTime = minTime;
        break;
      case 'End':
        e.preventDefault();
        currentTime = maxTime;
        break;
    }
  }

  // Cleanup on unmount
  onMount(() => {
    // Add keyboard listener to the map container instead of window
    if (mapContainer) {
      mapContainer.addEventListener('keydown', handleKeydown);
      mapContainer.setAttribute('tabindex', '0');
    }
    return () => {
      if (mapContainer) {
        mapContainer.removeEventListener('keydown', handleKeydown);
      }
      if (playInterval) {
        clearInterval(playInterval);
      }
    };
  });

  // Save current time when navigating away
  onDestroy(() => {
    mapTime.update(s => ({ ...s, currentPlaybackTime: currentTime }));
  });

  // Team colors
  const radiantColor = '#4ecca3';
  const direColor = '#ff6b6b';

  // Hovered player
  let hoveredPlayer: any = null;
</script>

<div class="mapContainer" bind:this={mapContainer}>
  <div class="mapHeader">
    <h3>Player Positions</h3>
    <div class="timeDisplay">{formatTime(currentTime)}</div>
  </div>

  <div class="mapWrapper">
    <svg
      class="map"
      viewBox="0 0 {MAP_SIZE} {MAP_SIZE}"
      width={MAP_SIZE}
      height={MAP_SIZE}
    >
      <!-- Map background -->
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a2a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2a1a1a;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="grayscale">
          <feColorMatrix type="saturate" values="0.3"/>
        </filter>
        <!-- Clip paths for hero portraits -->
        {#each [0,1,2,3,4,5,6,7,8,9] as slot}
          <clipPath id="heroClip{slot}">
            <circle r="12" cx="0" cy="0" />
          </clipPath>
        {/each}
      </defs>

      <!-- Dota 2 minimap background -->
      <image
        href="https://www.opendota.com/assets/images/dota2/map/detailed_740.webp"
        x="0"
        y="0"
        width={MAP_SIZE}
        height={MAP_SIZE}
        preserveAspectRatio="xMidYMid slice"
        opacity="0.85"
      />

      <!-- Dark overlay for better dot visibility -->
      <rect x="0" y="0" width={MAP_SIZE} height={MAP_SIZE} fill="rgba(0,0,0,0.3)" rx="8"/>

      <!-- Player icons with hero portraits -->
      {#each playersAtTime as player (player.slot)}
        {@const pos = gameToCanvas(player.x, player.y)}
        {@const heroName = getHeroName(player.slot)}
        {@const isRadiant = player.slot < 5}
        {@const color = isRadiant ? radiantColor : direColor}
        {@const isDead = player.life_state !== 0}
        <g
          class="playerIcon"
          class:dead={isDead}
          on:mouseenter={() => hoveredPlayer = player}
          on:mouseleave={() => hoveredPlayer = null}
          transform="translate({pos.cx}, {pos.cy})"
        >
          <!-- Outer glow -->
          <circle
            r="14"
            fill={color}
            opacity="0.3"
            filter="url(#glow)"
          />
          <!-- Team color border circle -->
          <circle
            r="13"
            fill="none"
            stroke={color}
            stroke-width="2"
            class="playerBorder"
          />
          <!-- Hero portrait clipped to circle -->
          <clipPath id="heroClipActive{player.slot}">
            <circle r="12" />
          </clipPath>
          <image
            href="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/{heroName}.png"
            x="-16"
            y="-9"
            width="32"
            height="18"
            clip-path="url(#heroClipActive{player.slot})"
            opacity={isDead ? 0.4 : 1}
            filter={isDead ? 'url(#grayscale)' : 'none'}
          />
        </g>
      {/each}
    </svg>

    <!-- Tooltip -->
    {#if hoveredPlayer}
      {@const heroName = getHeroName(hoveredPlayer.slot)}
      <div class="tooltip" class:radiant={hoveredPlayer.slot < 5} class:dire={hoveredPlayer.slot >= 5}>
        <div class="tooltipHero">{heroName.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</div>
        <div class="tooltipStats">
          <span>LVL {hoveredPlayer.level}</span>
          <span>{hoveredPlayer.kills}/{hoveredPlayer.deaths}/{hoveredPlayer.assists}</span>
        </div>
        <div class="tooltipPos">
          x: {hoveredPlayer.x?.toFixed(1)} | y: {hoveredPlayer.y?.toFixed(1)}
        </div>
      </div>
    {/if}
  </div>

  <!-- Controls -->
  <div class="controls">
    <button class="controlBtn" on:click={resetPlayback} title="Reset">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" transform="scale(-1, 1) translate(-24, 0)"/>
      </svg>
    </button>
    <button class="controlBtn playBtn" on:click={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
      {#if isPlaying}
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      {/if}
    </button>
    <select class="speedSelect" bind:value={playbackSpeed} on:change={() => { if (isPlaying) { togglePlay(); togglePlay(); } }}>
      <option value={0.5}>0.5x</option>
      <option value={1}>1x</option>
      <option value={2}>2x</option>
      <option value={4}>4x</option>
      <option value={8}>8x</option>
    </select>
  </div>

  <!-- Time slider -->
  <div class="sliderContainer">
    <span class="sliderTime">{formatTime(minTime)}</span>
    <input
      type="range"
      class="timeSlider"
      min={minTime}
      max={maxTime}
      bind:value={currentTime}
    />
    <span class="sliderTime">{formatTime(maxTime)}</span>
  </div>

  <!-- Keyboard shortcuts hint -->
  <div class="shortcuts">
    <span>Space: Play/Pause</span>
    <span>←/→: ±1s</span>
    <span>Shift+←/→: ±10s</span>
  </div>

  <!-- Legend -->
  <div class="legend">
    <div class="legendTeam radiant">
      <span class="legendLabel">Radiant</span>
      <span class="legendPlayers">
        {#each [0,1,2,3,4] as slot}
          {@const heroName = getHeroName(slot)}
          <span class="legendPlayer" title={heroName.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}>
            <img
              src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/{heroName}.png"
              alt={heroName}
              class="legendHeroImg"
              style="border-color: {radiantColor}"
            />
          </span>
        {/each}
      </span>
    </div>
    <div class="legendTeam dire">
      <span class="legendLabel">Dire</span>
      <span class="legendPlayers">
        {#each [5,6,7,8,9] as slot}
          {@const heroName = getHeroName(slot)}
          <span class="legendPlayer" title={heroName.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}>
            <img
              src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/{heroName}.png"
              alt={heroName}
              class="legendHeroImg"
              style="border-color: {direColor}"
            />
          </span>
        {/each}
      </span>
    </div>
  </div>
</div>

<style>
  .mapContainer {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin: var(--spacing-lg);
    animation: slideIn 0.5s ease-out;
    position: relative;
    z-index: 1;
  }

  .mapHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
  }

  .mapHeader h3 {
    font-family: 'Crimson Pro', serif;
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .timeDisplay {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--accent-gold);
    text-shadow: 0 0 20px rgba(255, 203, 107, 0.5);
  }

  .mapWrapper {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
  }

  .map {
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg), inset 0 0 60px rgba(0,0,0,0.5);
    cursor: crosshair;
  }

  .playerIcon {
    cursor: pointer;
    transition: filter 0.15s ease;
  }

  .playerIcon:hover .playerBorder {
    stroke-width: 3;
  }

  .playerIcon.dead .playerBorder {
    stroke-dasharray: 3 2;
  }

  .tooltip {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    background: var(--bg-elevated);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
    pointer-events: none;
    min-width: 140px;
  }

  .tooltip.radiant {
    border-color: var(--radiant-accent);
    box-shadow: 0 0 15px var(--radiant-glow);
  }

  .tooltip.dire {
    border-color: var(--dire-accent);
    box-shadow: 0 0 15px var(--dire-glow);
  }

  .tooltipHero {
    font-weight: 700;
    font-size: var(--text-sm);
    margin-bottom: var(--spacing-xs);
  }

  .tooltip.radiant .tooltipHero {
    color: var(--radiant-accent);
  }

  .tooltip.dire .tooltipHero {
    color: var(--dire-accent);
  }

  .tooltipStats {
    display: flex;
    gap: var(--spacing-md);
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }

  .tooltipPos {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: var(--spacing-xs);
  }

  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .controlBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    color: var(--text-primary);
    transition: all var(--transition-fast);
  }

  .controlBtn:hover {
    background: var(--bg-elevated);
    border-color: var(--accent-blue);
    color: var(--accent-blue);
  }

  .playBtn {
    width: 50px;
    height: 50px;
    background: var(--accent-blue);
    border-color: var(--accent-blue);
  }

  .playBtn:hover {
    background: var(--accent-purple);
    border-color: var(--accent-purple);
    color: var(--text-primary);
  }

  .speedSelect {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--text-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    cursor: pointer;
  }

  .speedSelect:hover {
    border-color: var(--accent-blue);
  }

  .sliderContainer {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: 0 var(--spacing-md);
  }

  .sliderTime {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--text-sm);
    color: var(--text-muted);
    min-width: 50px;
  }

  .sliderTime:last-child {
    text-align: right;
  }

  .timeSlider {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    outline: none;
    cursor: pointer;
  }

  .timeSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: var(--accent-blue);
    border-radius: 50%;
    cursor: pointer;
    transition: all var(--transition-fast);
    box-shadow: 0 0 10px rgba(88, 147, 223, 0.5);
  }

  .timeSlider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    background: var(--accent-purple);
  }

  .timeSlider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: var(--accent-blue);
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }

  .shortcuts {
    display: flex;
    justify-content: center;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-md);
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .shortcuts span {
    background: var(--bg-tertiary);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
  }

  .legend {
    display: flex;
    justify-content: center;
    gap: var(--spacing-xl);
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--border-secondary);
  }

  .legendTeam {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--text-sm);
  }

  .legendTeam.radiant {
    color: var(--radiant-accent);
  }

  .legendTeam.dire {
    color: var(--dire-accent);
  }

  .legendLabel {
    font-weight: 600;
    min-width: 60px;
  }

  .legendPlayers {
    display: flex;
    gap: var(--spacing-sm);
    margin-left: var(--spacing-sm);
  }

  .legendPlayer {
    display: flex;
    align-items: center;
  }

  .legendHeroImg {
    width: 32px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid;
    object-fit: cover;
    object-position: center top;
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
