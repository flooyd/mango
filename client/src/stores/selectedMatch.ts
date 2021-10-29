import { writable } from 'svelte/store';

const selectedMatch = writable(null);

selectedMatch.subscribe((value) => value);

export default selectedMatch;
