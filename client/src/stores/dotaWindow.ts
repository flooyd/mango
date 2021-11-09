import { writable } from 'svelte/store';

const dotaWindow = writable(null);

dotaWindow.subscribe((value) => value);

export default dotaWindow;
