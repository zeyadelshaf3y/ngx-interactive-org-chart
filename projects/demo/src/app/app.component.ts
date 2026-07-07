import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LayoutComponent } from './layout';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [LayoutComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-layout />`,
})
export class AppComponent {}
