<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import selectedMatch from '../stores/selectedMatch';
  import mapTime from '../stores/mapTime';

  const dispatch = createEventDispatcher();
  const { matchSummary, matchDetails } = $selectedMatch;
  const intervals: any[] = matchDetails.Intervals || [];

  // Build time map and coordinate bounds
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
      minX = Math.min(minX, interval.x);
      maxX = Math.max(maxX, interval.x);
      minY = Math.min(minY, interval.y);
      maxY = Math.max(maxY, interval.y);
    }
  }

  if (minTime === Infinity) minTime = 0;
  if (maxTime === -Infinity) maxTime = 0;

  // Initialize from persisted time if available
  const initialTime = $mapTime.currentPlaybackTime !== null ? $mapTime.currentPlaybackTime : minTime;
  let currentTime = Math.max(minTime, Math.min(maxTime, initialTime));
  let isPlaying = false;
  let playInterval: number | null = null;

  // Mini map size
  const MAP_SIZE = 200;

  // Calculate coordinate ranges
  const padding = 5;
  const coordMinX = minX !== Infinity ? minX - padding : 64;
  const coordMaxX = maxX !== -Infinity ? maxX + padding : 192;
  const coordMinY = minY !== Infinity ? minY - padding : 64;
  const coordMaxY = maxY !== -Infinity ? maxY + padding : 192;

  const rangeX = coordMaxX - coordMinX;
  const rangeY = coordMaxY - coordMinY;
  const maxRange = Math.max(rangeX, rangeY);
  const offsetX = (maxRange - rangeX) / 2;
  const offsetY = (maxRange - rangeY) / 2;

  function gameToCanvas(x: number, y: number): { cx: number; cy: number } {
    const cx = ((x - coordMinX + offsetX) / maxRange) * MAP_SIZE;
    const cy = MAP_SIZE - ((y - coordMinY + offsetY) / maxRange) * MAP_SIZE;
    return { cx, cy };
  }

  $: playersAtTime = timeMap.get(currentTime) || [];

  // Subscribe to external time changes (from kill clicks or full map)
  $: if ($mapTime.time !== null && $mapTime.time !== currentTime) {
    currentTime = $mapTime.time;
  }

  // Also sync with currentPlaybackTime from full map
  $: if ($mapTime.currentPlaybackTime !== null && $mapTime.currentPlaybackTime !== currentTime && !isPlaying) {
    currentTime = $mapTime.currentPlaybackTime;
  }

  function getHeroName(slot: number): string {
    if (slot < 5) {
      return matchSummary[`radiantHero${slot}`]?.replace('npc_dota_hero_', '') || `Player ${slot + 1}`;
    } else {
      return matchSummary[`direHero${slot - 5}`]?.replace('npc_dota_hero_', '') || `Player ${slot + 1}`;
    }
  }

  function formatTime(seconds: number): string {
    const negative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${negative ? '-' : ''}${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playInterval = window.setInterval(() => {
        if (currentTime < maxTime) {
          currentTime += 1;
          // Update shared store so full map stays in sync
          mapTime.update(s => ({ ...s, currentPlaybackTime: currentTime }));
        } else {
          isPlaying = false;
          if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
          }
        }
      }, 250); // 4x speed for mini map
    } else if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
    }
  }

  function handleClick() {
    dispatch('expand');
  }

  onDestroy(() => {
    if (playInterval) {
      clearInterval(playInterval);
    }
    // Save current time when navigating away
    mapTime.update(s => ({ ...s, currentPlaybackTime: currentTime }));
  });

  const radiantColor = '#4ecca3';
  const direColor = '#ff6b6b';
</script>

<div class="miniMapContainer" on:click={handleClick}>
  <div class="miniMapHeader">
    <span class="timeDisplay">{formatTime(currentTime)}</span>
    <button class="playBtn" on:click|stopPropagation={togglePlay}>
      {#if isPlaying}
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      {/if}
    </button>
  </div>

  <svg
    class="map"
    viewBox="0 0 {MAP_SIZE} {MAP_SIZE}"
    width={MAP_SIZE}
    height={MAP_SIZE}
  >
    <defs>
      <filter id="miniGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="miniGrayscale">
        <feColorMatrix type="saturate" values="0.3"/>
      </filter>
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

    <rect x="0" y="0" width={MAP_SIZE} height={MAP_SIZE} fill="rgba(0,0,0,0.3)" rx="4"/>

    <!-- Player icons with hero portraits (smaller than full map) -->
    {#each playersAtTime as player (player.slot)}
      {@const pos = gameToCanvas(player.x, player.y)}
      {@const heroName = getHeroName(player.slot)}
      {@const isRadiant = player.slot < 5}
      {@const color = isRadiant ? radiantColor : direColor}
      {@const isDead = player.life_state !== 0}
      <g transform="translate({pos.cx}, {pos.cy})">
        <!-- Outer glow -->
        <circle
          r="7"
          fill={color}
          opacity="0.3"
          filter="url(#miniGlow)"
        />
        <!-- Team color border circle -->
        <circle
          r="6.5"
          fill="none"
          stroke={color}
          stroke-width="1"
        />
        <!-- Hero portrait clipped to circle -->
        <clipPath id="miniHeroClip{player.slot}">
          <circle r="6" />
        </clipPath>
        <image
          href="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/{heroName}.png"
          x="-8"
          y="-4.5"
          width="16"
          height="9"
          clip-path="url(#miniHeroClip{player.slot})"
          opacity={isDead ? 0.4 : 1}
          filter={isDead ? 'url(#miniGrayscale)' : 'none'}
        />
      </g>
    {/each}
  </svg>

  <div class="expandHint">Click to expand</div>
</div>

<style>
  .miniMapContainer {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .miniMapContainer:hover {
    border-color: var(--accent-blue);
    box-shadow: 0 0 20px rgba(88, 147, 223, 0.3);
  }

  .miniMapHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xs);
  }

  .timeDisplay {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--accent-gold);
  }

  .playBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border-radius: 50%;
    background: var(--accent-blue);
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .playBtn:hover {
    background: var(--accent-purple);
    transform: scale(1.1);
  }

  .map {
    border-radius: var(--radius-sm);
    display: block;
  }

  .expandHint {
    text-align: center;
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: var(--spacing-xs);
  }
</style>
