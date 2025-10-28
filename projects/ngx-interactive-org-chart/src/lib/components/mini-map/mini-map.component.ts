import { NgStyle } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
  OnDestroy,
} from '@angular/core';
import { PanZoom } from 'panzoom';

export type MiniMapPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface MiniMapTheme {
  readonly background?: string;
  readonly borderColor?: string;
  readonly borderRadius?: string;
  readonly shadow?: string;
  readonly nodeColor?: string;
  readonly viewportBackground?: string;
  readonly viewportBorderColor?: string;
  readonly viewportBorderWidth?: string;
}

interface ContentBounds {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

interface Transform {
  readonly scale: number;
  readonly x: number;
  readonly y: number;
}

const DEFAULT_THEME: Required<MiniMapTheme> = {
  background: 'rgba(255, 255, 255, 0.95)',
  borderColor: 'rgba(0, 0, 0, 0.15)',
  borderRadius: '8px',
  shadow:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  nodeColor: 'rgba(0, 0, 0, 0.6)',
  viewportBackground: 'rgba(59, 130, 246, 0.2)',
  viewportBorderColor: 'rgb(59, 130, 246)',
  viewportBorderWidth: '2px',
};

const REDRAW_DEBOUNCE_MS = 100;
const CONTENT_PADDING_RATIO = 0.9;
const CSS_VAR_REGEX = /var\((--[^)]+)\)/;

@Component({
  selector: 'ngx-org-chart-mini-map',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.scss'],
})
export class MiniMapComponent implements OnDestroy {
  readonly #injector = inject(Injector);
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly panZoomInstance = input.required<PanZoom | null>();
  readonly chartContainer = input.required<HTMLElement | null>();
  readonly position = input<MiniMapPosition>('bottom-right');
  readonly width = input<number>(200);
  readonly height = input<number>(150);
  readonly visible = input<boolean>(true);
  readonly themeOptions = input<MiniMapTheme | undefined>();

  readonly navigate = output<{ x: number; y: number }>();

  protected readonly canvasRef =
    viewChild<ElementRef<HTMLCanvasElement>>('miniMapCanvas');
  protected readonly viewportRef =
    viewChild<ElementRef<HTMLDivElement>>('viewport');

  protected readonly viewportStyle = signal<Record<string, string>>({});

  protected readonly miniMapStyle = computed(() => {
    const theme = this.themeOptions();
    return {
      width: `${this.width()}px`,
      height: `${this.height()}px`,
      backgroundColor: theme?.background ?? DEFAULT_THEME.background,
      borderColor: theme?.borderColor ?? DEFAULT_THEME.borderColor,
      borderRadius: theme?.borderRadius ?? DEFAULT_THEME.borderRadius,
      boxShadow: theme?.shadow ?? DEFAULT_THEME.shadow,
    };
  });

  protected readonly viewportIndicatorStyle = computed(() => {
    const theme = this.themeOptions();
    return {
      ...this.viewportStyle(),
      backgroundColor:
        theme?.viewportBackground ?? DEFAULT_THEME.viewportBackground,
      borderColor:
        theme?.viewportBorderColor ?? DEFAULT_THEME.viewportBorderColor,
      borderWidth:
        theme?.viewportBorderWidth ?? DEFAULT_THEME.viewportBorderWidth,
    };
  });

  protected readonly nodeColor = computed(
    () => this.themeOptions()?.nodeColor ?? DEFAULT_THEME.nodeColor
  );

  #animationFrameId: number | null = null;
  #isDragging = false;
  #mutationObserver: MutationObserver | null = null;
  #themeObserver: MutationObserver | null = null;
  #redrawTimeout: number | null = null;

  constructor() {
    this.#initializeEffects();
    this.#setupThemeObserver();
  }

  ngOnDestroy(): void {
    this.#cleanup();
  }

  protected onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.#isDragging = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (this.#isDragging) {
        this.#navigateToPoint(e);
      }
    };

    const handleMouseUp = () => {
      this.#isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  #initializeEffects(): void {
    effect(
      () => {
        const panZoom = this.panZoomInstance();
        panZoom ? this.#startTracking() : this.#stopTracking();
      },
      { injector: this.#injector }
    );

    effect(
      () => {
        const container = this.chartContainer();

        if (container) {
          this.#setupMutationObserver(container);
          this.#drawMiniMap();
        } else {
          this.#disconnectMutationObserver();
        }
      },
      { injector: this.#injector }
    );

    effect(
      () => {
        this.themeOptions();
        this.#scheduleRedraw();
      },
      { injector: this.#injector }
    );
  }

  #setupThemeObserver(): void {
    this.#themeObserver = new MutationObserver(() => this.#scheduleRedraw());

    [document.documentElement, document.body].forEach(target => {
      this.#themeObserver!.observe(target, {
        attributes: true,
        attributeFilter: ['class', 'data-theme', 'data-mode'],
      });
    });
  }

  #disconnectThemeObserver(): void {
    this.#themeObserver?.disconnect();
    this.#themeObserver = null;
  }

  #setupMutationObserver(container: HTMLElement): void {
    this.#disconnectMutationObserver();

    this.#mutationObserver = new MutationObserver(() => this.#scheduleRedraw());
    this.#mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
  }

  #disconnectMutationObserver(): void {
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = null;
  }

  #scheduleRedraw(): void {
    if (this.#redrawTimeout !== null) {
      clearTimeout(this.#redrawTimeout);
    }

    this.#redrawTimeout = setTimeout(() => {
      this.#drawMiniMap();
      this.#redrawTimeout = null;
    }, REDRAW_DEBOUNCE_MS) as unknown as number;
  }

  #startTracking(): void {
    if (this.#animationFrameId !== null) return;

    const update = () => {
      this.#updateViewport();
      this.#animationFrameId = requestAnimationFrame(update);
    };

    this.#animationFrameId = requestAnimationFrame(update);
  }

  #stopTracking(): void {
    if (this.#animationFrameId !== null) {
      cancelAnimationFrame(this.#animationFrameId);
      this.#animationFrameId = null;
    }
  }

  #drawMiniMap(): void {
    const canvas = this.canvasRef()?.nativeElement;
    const container = this.chartContainer();

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = this.width();
    canvas.height = this.height();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const contentBounds = this.#getContentBounds(container);
    if (!contentBounds) return;

    const { scale, offsetX, offsetY } = this.#calculateMiniMapTransform(
      canvas,
      contentBounds
    );
    const transform = this.#getCurrentTransform();

    this.#drawNodes(
      ctx,
      container,
      contentBounds,
      scale,
      offsetX,
      offsetY,
      transform
    );
  }

  #getContentBounds(container: HTMLElement): ContentBounds | null {
    const nodes = container.querySelectorAll('.node-content');
    if (nodes.length === 0) return null;

    const transform = this.#getCurrentTransform();
    const containerRect = container.getBoundingClientRect();

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach(node => {
      const rect = node.getBoundingClientRect();
      const relX =
        (rect.left - containerRect.left - transform.x) / transform.scale;
      const relY =
        (rect.top - containerRect.top - transform.y) / transform.scale;
      const width = rect.width / transform.scale;
      const height = rect.height / transform.scale;

      minX = Math.min(minX, relX);
      minY = Math.min(minY, relY);
      maxX = Math.max(maxX, relX + width);
      maxY = Math.max(maxY, relY + height);
    });

    return {
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  #calculateMiniMapTransform(
    canvas: HTMLCanvasElement,
    contentBounds: ContentBounds
  ): { scale: number; offsetX: number; offsetY: number } {
    const scaleX = canvas.width / contentBounds.width;
    const scaleY = canvas.height / contentBounds.height;
    const scale = Math.min(scaleX, scaleY) * CONTENT_PADDING_RATIO;

    const offsetX = (canvas.width - contentBounds.width * scale) / 2;
    const offsetY = (canvas.height - contentBounds.height * scale) / 2;

    return { scale, offsetX, offsetY };
  }

  #drawNodes(
    ctx: CanvasRenderingContext2D,
    container: HTMLElement,
    contentBounds: ContentBounds,
    scale: number,
    offsetX: number,
    offsetY: number,
    transform: Transform
  ): void {
    const resolvedNodeColor = this.#resolveColor(this.nodeColor());
    ctx.fillStyle = resolvedNodeColor;
    ctx.strokeStyle = resolvedNodeColor;
    ctx.lineWidth = 1;

    const nodes = container.querySelectorAll('.node-content');
    const containerRect = container.getBoundingClientRect();

    nodes.forEach(node => {
      const rect = node.getBoundingClientRect();

      const relX =
        (rect.left - containerRect.left - transform.x) / transform.scale;
      const relY =
        (rect.top - containerRect.top - transform.y) / transform.scale;
      const w = rect.width / transform.scale;
      const h = rect.height / transform.scale;

      const x = (relX - contentBounds.left) * scale + offsetX;
      const y = (relY - contentBounds.top) * scale + offsetY;
      const scaledW = w * scale;
      const scaledH = h * scale;

      ctx.fillRect(x, y, scaledW, scaledH);
    });
  }

  #updateViewport(): void {
    const panZoom = this.panZoomInstance();
    const container = this.chartContainer();
    const canvas = this.canvasRef()?.nativeElement;

    if (!panZoom || !container || !canvas) return;

    const transform = panZoom.getTransform();
    const contentBounds = this.#getContentBounds(container);

    if (!contentBounds) return;

    const { scale, offsetX, offsetY } = this.#calculateMiniMapTransform(
      canvas,
      contentBounds
    );

    const containerRect = container.getBoundingClientRect();
    const viewportWidth = containerRect.width / transform.scale;
    const viewportHeight = containerRect.height / transform.scale;

    const viewportX = -transform.x / transform.scale - contentBounds.left;
    const viewportY = -transform.y / transform.scale - contentBounds.top;

    const miniViewportX = viewportX * scale + offsetX;
    const miniViewportY = viewportY * scale + offsetY;
    const miniViewportWidth = viewportWidth * scale;
    const miniViewportHeight = viewportHeight * scale;

    this.viewportStyle.set({
      left: `${miniViewportX}px`,
      top: `${miniViewportY}px`,
      width: `${miniViewportWidth}px`,
      height: `${miniViewportHeight}px`,
    });
  }

  #navigateToPoint(event: MouseEvent): void {
    const canvas = this.canvasRef()?.nativeElement;
    const container = this.chartContainer();
    const panZoom = this.panZoomInstance();

    if (!canvas || !container || !panZoom) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const contentBounds = this.#getContentBounds(container);
    if (!contentBounds) return;

    const { scale, offsetX, offsetY } = this.#calculateMiniMapTransform(
      canvas,
      contentBounds
    );

    const contentX = (clickX - offsetX) / scale + contentBounds.left;
    const contentY = (clickY - offsetY) / scale + contentBounds.top;

    const transform = panZoom.getTransform();
    const containerRect = container.getBoundingClientRect();

    const newX = -(contentX * transform.scale - containerRect.width / 2);
    const newY = -(contentY * transform.scale - containerRect.height / 2);

    panZoom.moveTo(newX, newY);
    this.navigate.emit({ x: newX, y: newY });
  }

  #resolveColor(color: string): string {
    if (!color.includes('var(')) return color;

    const computedStyle = getComputedStyle(this.#elementRef.nativeElement);
    const match = color.match(CSS_VAR_REGEX);

    if (match) {
      const propertyName = match[1];
      const resolvedColor = computedStyle.getPropertyValue(propertyName).trim();
      return resolvedColor || color;
    }

    return color;
  }

  #getCurrentTransform(): Transform {
    const panZoom = this.panZoomInstance();
    return panZoom?.getTransform() ?? { scale: 1, x: 0, y: 0 };
  }

  #cleanup(): void {
    this.#stopTracking();
    this.#disconnectMutationObserver();
    this.#disconnectThemeObserver();

    if (this.#redrawTimeout !== null) {
      clearTimeout(this.#redrawTimeout);
      this.#redrawTimeout = null;
    }
  }
}
