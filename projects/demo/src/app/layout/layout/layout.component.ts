import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '../header';
import { SidebarComponent } from '../sidebar';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  readonly #themeService = inject(ThemeService);
  readonly isSidebarOpen = signal<boolean>(false);

  protected readonly isDarkMode = computed(
    () => this.#themeService.getTheme() === 'dark'
  );

  protected toggleTheme(): void {
    this.#themeService.setTheme(this.isDarkMode() ? 'light' : 'dark');
  }
}
