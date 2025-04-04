import { writable } from 'svelte/store';

// Create the store with a default value of false (light mode)
export const isDarkMode = writable(false);

// Ensure this runs only in the browser
if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    isDarkMode.set(true);
    document.documentElement.classList.add('dark');
  }

  // Subscribe to store changes to update <html class="dark">
  isDarkMode.subscribe((value) => {
    if (value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });
}
