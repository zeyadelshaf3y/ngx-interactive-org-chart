import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IconComponent } from '../icon';

@Component({
  standalone: true,
  selector: 'app-coming-soon',
  imports: [IconComponent],
  templateUrl: './coming-soon.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './coming-soon.component.scss',
})
export class ComingSoonComponent {}
