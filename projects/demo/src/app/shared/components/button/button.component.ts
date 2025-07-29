import { Component, computed, input, output } from '@angular/core';
import { ButtonSeverity, ButtonSize, ButtonVariant } from '../../models';
import { NgClass } from '@angular/common';
import { IconComponent } from '../icon';

@Component({
  standalone: true,
  selector: 'app-button',
  imports: [NgClass, IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly severity = input<ButtonSeverity>();
  readonly size = input<ButtonSize>();
  readonly variant = input<ButtonVariant>();
  readonly disabled = input<boolean>();
  readonly loading = input<boolean>(false);

  readonly onClick = output<MouseEvent>();

  readonly getClasses = computed(() => {
    const classes = ['button'];

    if (this.severity()) {
      classes.push(`button--${this.severity()}`);
    }

    if (this.size()) {
      classes.push(`button--${this.size()}`);
    }

    if (this.variant()) {
      classes.push(`button--${this.variant()}`);
    }

    if (this.loading()) {
      classes.push('button--loading');
    }

    return classes.join(' ');
  });
}
