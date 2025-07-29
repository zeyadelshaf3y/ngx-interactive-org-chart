import { Component } from '@angular/core';
import { ComingSoonComponent } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-rtl-support',
  imports: [ComingSoonComponent],
  templateUrl: './rtl-support.component.html',
  styleUrls: ['./rtl-support.component.scss'],
})
export class RtlSupportComponent {}
