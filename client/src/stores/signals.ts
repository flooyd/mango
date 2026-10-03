import { writable } from 'svelte/store';

// Bumped whenever the user asks to reparse every replay (from the profile menu).
export const reparseAllNonce = writable(0);
