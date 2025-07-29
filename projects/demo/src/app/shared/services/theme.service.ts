import { computed, Injectable, signal } from '@angular/core';

const THEME_LOCAL_STORAGE_KEY = 'ngx-interactive-org-chart-demo-theme';

export type Theme = 'light' | 'dark';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly currentTheme = signal<Theme>('light');

  readonly getTheme = computed(() => this.currentTheme());

  constructor() {
    const storedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY) as Theme;
    this.setTheme(storedTheme || this.currentTheme());
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }
}
