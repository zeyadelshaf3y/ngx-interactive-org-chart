import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DemoRoutes } from './shared';

export const routes: Routes = [
  {
    path: DemoRoutes.Overview,
    loadComponent: () =>
      import('./examples/overview').then(m => m.OverviewComponent),
  },
  {
    path: DemoRoutes.ThemingAndCustomization,
    loadComponent: () =>
      import('./examples/theming-customization').then(
        m => m.ThemingCustomizationComponent
      ),
  },
  {
    path: DemoRoutes.Basic,
    loadComponent: () => import('./examples/basic').then(m => m.BasicComponent),
  },
  {
    path: DemoRoutes.RTLSupport,
    loadComponent: () =>
      import('./examples/rtl-support').then(m => m.RtlSupportComponent),
  },
  {
    path: '',
    redirectTo: DemoRoutes.Overview,
    pathMatch: 'full',
  },
];
