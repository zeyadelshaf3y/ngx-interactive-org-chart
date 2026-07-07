import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComingSoonComponent } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-basic',
  imports: [ComingSoonComponent],
  templateUrl: './basic.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./basic.component.scss'],
})
export class BasicComponent {}
