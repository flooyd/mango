import { persisted } from './persisted';
import { writable } from 'svelte/store';

export type Density = 'cards' | 'rows';
export const density = persisted<Density>('mango.density', 'cards');

export type SortBy = 'date' | 'duration' | 'kills';
export const sortBy = persisted<SortBy>('mango.sortBy', 'date');

// Session-only
export const heroFilter = writable<string | null>(null);
