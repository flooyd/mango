import { writable, type Writable } from 'svelte/store';

/**
 * A writable store backed by localStorage.
 * Usage: const theme = persisted<'dark' | 'light'>('mango.theme', 'dark');
 */
export function persisted<T>(key: string, initial: T): Writable<T> {
  let start = initial;
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(key);
    if (raw != null) {
      try {
        start = JSON.parse(raw) as T;
      } catch {
        /* ignore corrupted value */
      }
    }
  }
  const store = writable<T>(start);
  store.subscribe((v) => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {
        /* quota / unavailable */
      }
    }
  });
  return store;
}
