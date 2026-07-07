import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComingSoonComponent } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-rtl-support',
  imports: [ComingSoonComponent],
  templateUrl: './rtl-support.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./rtl-support.component.scss'],
})
export class RtlSupportComponent {}
