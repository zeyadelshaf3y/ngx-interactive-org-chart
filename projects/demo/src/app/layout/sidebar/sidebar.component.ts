import { Component, input, output } from '@angular/core';
import {
  ButtonComponent,
  DemoRoutes,
  IconComponent,
  IconType,
  MiniThemeSwitchComponent,
  ThemeSwitchComponent,
} from '../../shared';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarItem {
  readonly icon: IconType;
  readonly title: string;
  readonly route?: string;
  readonly externalLink?: string;
}

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [
    IconComponent,
    ButtonComponent,
    RouterLink,
    RouterLinkActive,
    ThemeSwitchComponent,
    MiniThemeSwitchComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  readonly isOverlay = input<boolean>();
  readonly isDarkMode = input.required<boolean>();

  readonly onClose = output<void>();
  readonly toggleTheme = output<void>();

  readonly upperItems: SidebarItem[] = [
    {
      title: 'overview',
      icon: 'home',
      route: DemoRoutes.Overview,
    },
    {
      title: 'basic usage',
      icon: 'logo',
      route: DemoRoutes.Basic,
    },
    {
      title: 'RTL support',
      icon: 'repeat',
      route: DemoRoutes.RTLSupport,
    },
    {
      title: 'theming & customization',
      icon: 'customization',
      route: DemoRoutes.ThemingAndCustomization,
    },
  ];

  readonly lowerItems: SidebarItem[] = [
    {
      icon: 'github',
      title: 'GitHub Repository',
      externalLink:
        'https://github.com/zeyadelshaf3y/ngx-interactive-org-chart',
    },
    {
      icon: 'package',
      title: 'NPM Package',
      externalLink: 'https://www.npmjs.com/package/ngx-interactive-org-chart',
    },
  ];

  protected onToggleTheme(): void {
    this.toggleTheme.emit();
  }
}
