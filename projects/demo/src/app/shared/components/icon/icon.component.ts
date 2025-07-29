import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { IconColor, IconSize, IconType } from '../../models';

@Component({
  standalone: true,
  selector: 'app-icon',
  imports: [NgClass],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  readonly #spritePath = 'assets/icons/svg/sprite.css.svg';

  readonly name = input<IconType>();
  readonly color = input<IconColor>();
  readonly size = input<IconSize>();
  readonly customSize = input<number>();

  protected readonly iconPath = computed(
    () => `${this.#spritePath}#${this.name()}`
  );

  protected readonly getClasses = computed(() => {
    const classes = [];

    if (this.color()) {
      classes.push(`icon--${this.color()}`);
    }

    if (this.name() === 'loading') {
      classes.push('icon--loading');
    }

    return classes;
  });

  protected readonly sizePx = computed(() => {
    if (this.customSize()) {
      return this.customSize();
    }

    switch (this.size()) {
      case 'tiny':
        return 12;
      case 'small':
        return 16;
      case 'medium':
        return 24;
      case 'large':
        return 32;
      case 'huge':
        return 48;
      default:
        return 24;
    }
  });
}
