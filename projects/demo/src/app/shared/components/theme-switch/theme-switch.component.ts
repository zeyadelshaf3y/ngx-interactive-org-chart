import { Component, model, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon';

@Component({
  standalone: true,
  selector: 'app-theme-switch',
  imports: [FormsModule, IconComponent],
  templateUrl: './theme-switch.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './theme-switch.component.scss',
})
export class ThemeSwitchComponent {
  readonly isDarkMode = model<boolean>();
}
