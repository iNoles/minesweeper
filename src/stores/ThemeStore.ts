// stores/ThemeStore.ts
import { writable } from 'svelte/store';

export const isDarkMode = writable(false);

// Optionally, persist the theme preference in localStorage
if (localStorage.getItem('theme') === 'dark') {
  isDarkMode.set(true);
}
