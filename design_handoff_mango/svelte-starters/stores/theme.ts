import { persisted } from './persisted';

export type Theme = 'dark' | 'light';
export const theme = persisted<Theme>('mango.theme', 'dark');

// Reflect into the DOM whenever it changes
if (typeof document !== 'undefined') {
  theme.subscribe((t) => {
    document.documentElement.setAttribute('data-theme', t);
  });
}
