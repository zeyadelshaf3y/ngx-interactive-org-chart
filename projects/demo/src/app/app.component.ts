import { Component } from '@angular/core';
import { LayoutComponent } from './layout';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  template: `<app-layout />`,
})
export class AppComponent {}
