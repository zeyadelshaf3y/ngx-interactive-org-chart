import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComingSoonComponent } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-theming-customization',
  imports: [ComingSoonComponent],
  templateUrl: './theming-customization.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./theming-customization.component.scss'],
})
export class ThemingCustomizationComponent {}
