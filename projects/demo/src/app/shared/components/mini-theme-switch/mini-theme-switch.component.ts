import { Component, input, model } from '@angular/core';
import { IconComponent } from '../icon';
import { FormsModule } from '@angular/forms';
import { IconSize } from '../../models';

@Component({
  standalone: true,
  selector: 'app-mini-theme-switch',
  imports: [IconComponent, FormsModule],
  templateUrl: './mini-theme-switch.component.html',
  styleUrl: './mini-theme-switch.component.scss',
})
export class MiniThemeSwitchComponent {
  readonly isDarkMode = model<boolean>();
  readonly size = input<IconSize>();
}
