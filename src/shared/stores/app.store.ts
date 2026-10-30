import { defineStore } from 'pinia';
import { STORAGE_KEYS } from '@core/config';
import type { AppState } from '@typings/store';
import type { ThemeName } from '@typings/theme';

function readPersistedTheme(): ThemeName {
  const persisted = localStorage.getItem(STORAGE_KEYS.THEME);
  return persisted === 'dark' ? 'dark' : 'light';
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: readPersistedTheme(),
  }),

  actions: {
    switchTheme(): void {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEYS.THEME, this.theme);
    },
  },
});
