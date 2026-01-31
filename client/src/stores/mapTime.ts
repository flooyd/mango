import { writable } from 'svelte/store';

interface MapTimeState {
  time: number | null;
  shouldShowMap: boolean;
  currentPlaybackTime: number | null; // Persisted time when switching views
}

const mapTime = writable<MapTimeState>({
  time: null,
  shouldShowMap: false,
  currentPlaybackTime: null
});

export default mapTime;
