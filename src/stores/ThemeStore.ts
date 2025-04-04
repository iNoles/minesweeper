import { writable } from 'svelte/store';

export const isDarkMode = writable(false);

// Apply saved preference from localStorage
if (localStorage.getItem('theme') === 'dark') {
  isDarkMode.set(true);
  document.documentElement.classList.add('dark');
}

// Reactively update the HTML class when store changes
isDarkMode.subscribe((value) => {
  if (value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
