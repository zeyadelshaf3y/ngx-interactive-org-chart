import { Component, input, output } from '@angular/core';
import {
  ButtonComponent,
  IconComponent,
  MiniThemeSwitchComponent,
} from '../../shared';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [ButtonComponent, IconComponent, MiniThemeSwitchComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly isDarkMode = input<boolean>(false);
  readonly toggleTheme = output<void>();

  readonly openSidebar = output<void>();

  protected openGithub(): void {
    window.open(
      'https://github.com/zeyadelshaf3y/ngx-interactive-org-chart',
      '_blank'
    );
  }

  protected openPackage(): void {
    window.open(
      'https://www.npmjs.com/package/ngx-interactive-org-chart',
      '_blank'
    );
  }
}
