import { writable } from 'svelte/store';

const selectedHero = writable(null);

selectedHero.subscribe((value) => value);

export default selectedHero;
