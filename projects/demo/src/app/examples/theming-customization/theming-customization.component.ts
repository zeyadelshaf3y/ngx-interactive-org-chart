import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-theming-customization',
  imports: [ComingSoonComponent],
  templateUrl: './theming-customization.component.html',
  styleUrls: ['./theming-customization.component.scss'],
})
export class ThemingCustomizationComponent {}
