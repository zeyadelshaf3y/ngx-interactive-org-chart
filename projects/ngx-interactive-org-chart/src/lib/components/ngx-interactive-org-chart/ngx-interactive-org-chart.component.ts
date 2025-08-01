import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  contentChild,
  ContentChild,
  contentChildren,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  NgxInteractiveOrgChartLayout,
  NgxInteractiveOrgChartTheme,
  OrgChartNode,
} from '../../models';
import { mapNodesRecursively, toggleNodeCollapse } from '../../helpers';

import createPanZoom, { PanZoom } from 'panzoom';
import { animate, style, transition, trigger } from '@angular/animations';
import { DEFAULT_THEME_OPTIONS } from './default-theme-options';

const RESET_DELAY = 300; // ms

@Component({
  standalone: true,
  selector: 'ngx-interactive-org-chart',
  imports: [NgTemplateOutlet, NgClass, NgStyle],
  templateUrl: './ngx-interactive-org-chart.component.html',
  styleUrls: ['./ngx-interactive-org-chart.component.scss'],
  animations: [
    trigger('toggleNode', [
      transition(':enter', [
        style({ width: '0', height: '0', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ width: '*', height: '*', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        style({ width: '*', height: '*' }),
        animate(
          '300ms ease-out',
          style({ width: '0', height: '0', opacity: 0 })
        ),
      ]),
    ]),
  ],
  host: {
    '[style.--node-background]': 'finalThemeOptions().node.background',
    '[style.--node-color]': 'finalThemeOptions().node.color',
    '[style.--node-shadow]': 'finalThemeOptions().node.shadow',
    '[style.--node-outline-color]': 'finalThemeOptions().node.outlineColor',
    '[style.--node-outline-width]': 'finalThemeOptions().node.outlineWidth',
    '[style.--node-active-outline-color]':
      'finalThemeOptions().node.activeOutlineColor',
    '[style.--node-highlight-shadow-color]':
      'finalThemeOptions().node.highlightShadowColor',
    '[style.--node-padding]': 'finalThemeOptions().node.padding',
    '[style.--node-border-radius]': 'finalThemeOptions().node.borderRadius',
    '[style.--node-active-color]': 'finalThemeOptions().node.activeColor',
    '[style.--node-max-width]': 'finalThemeOptions().node.maxWidth',
    '[style.--node-min-width]': 'finalThemeOptions().node.minWidth',
    '[style.--node-max-height]': 'finalThemeOptions().node.maxHeight',
    '[style.--node-min-height]': 'finalThemeOptions().node.minHeight',
    '[style.--connector-color]': 'finalThemeOptions().connector.color',
    '[style.--connector-active-color]':
      'finalThemeOptions().connector.activeColor',
    '[style.--connector-border-radius]':
      'finalThemeOptions().connector.borderRadius',
    '[style.--node-container-spacing]':
      'finalThemeOptions().node.containerSpacing',
    '[style.--connector-width]': 'finalThemeOptions().connector.width',
    '[style.--collapse-button-size]': 'finalThemeOptions().collapseButton.size',
    '[style.--collapse-button-border-color]':
      'finalThemeOptions().collapseButton.borderColor',
    '[style.--collapse-button-border-radius]':
      'finalThemeOptions().collapseButton.borderRadius',
    '[style.--collapse-button-color]':
      'finalThemeOptions().collapseButton.color',
    '[style.--collapse-button-background]':
      'finalThemeOptions().collapseButton.background',
    '[style.--collapse-button-hover-color]':
      'finalThemeOptions().collapseButton.hoverColor',
    '[style.--collapse-button-hover-background]':
      'finalThemeOptions().collapseButton.hoverBackground',
    '[style.--collapse-button-hover-shadow]':
      'finalThemeOptions().collapseButton.hoverShadow',
    '[style.--collapse-button-hover-transform-scale]':
      'finalThemeOptions().collapseButton.hoverTransformScale',
    '[style.--collapse-button-focus-outline]':
      'finalThemeOptions().collapseButton.focusOutline',
    '[style.--collapse-button-count-font-size]':
      'finalThemeOptions().collapseButton.countFontSize',
    '[style.--container-background]':
      'finalThemeOptions().container.background',
    '[style.--container-border]': 'finalThemeOptions().container.border',
    '[attr.data-layout]': 'layout()',
  },
})
export class NgxInteractiveOrgChart<T> implements AfterViewInit, OnDestroy {
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @ContentChild('nodeTemplate', { static: false })
  protected readonly customNodeTemplate?: TemplateRef<unknown>;

  protected readonly panZoomContainer =
    viewChild.required<ElementRef<HTMLElement>>('panZoomContainer');

  private readonly container =
    viewChild.required<ElementRef<HTMLElement>>('container');

  /**
   * The data for the org chart.
   */
  readonly data = input.required<OrgChartNode<T>>();
  /**
   * The initial zoom level for the chart.
   */
  readonly initialZoom = input<number>();
  /**
   * The minimum zoom level for the chart
   */
  readonly minZoom = input<number>(0.1);
  /**
   * The maximum zoom level for the chart.
   */
  readonly maxZoom = input<number>(5);
  /**
   * The speed at which the chart zooms in/out on wheel or pinch.
   */
  readonly zoomSpeed = input<number>(1);
  /**
   * The speed at which the chart zooms in/out on double-click.
   */
  readonly zoomDoubleClickSpeed = input<number>(2);
  /**
   * Whether the nodes can be collapsed/expanded.
   */
  readonly collapsible = input<boolean>(true);
  /**
   * The CSS class to apply to each node element.
   */
  readonly nodeClass = input<string>();
  /**
   * If set to `true`, all the nodes will be initially collapsed.
   */
  readonly initialCollapsed = input<boolean>();
  /**
   * Whether to enable RTL (right-to-left) layout.
   */
  readonly isRtl = input<boolean>();
  /**
   * The layout direction of the org chart tree.
   * - 'vertical': Traditional top-to-bottom tree layout
   * - 'horizontal': Left-to-right tree layout
   */
  readonly layout = input<NgxInteractiveOrgChartLayout>('vertical');
  /**
   * Whether to focus on the node when it is collapsed and focus on its children when it is expanded.
   */
  readonly focusOnCollapseOrExpand = input<boolean>(false);
  /**
   * Whether to display the count of children for each node on expand/collapse button.
   */
  readonly displayChildrenCount = input<boolean>(true);
  /**
   * The ratio of the node's width to the viewport's width when highlighting.
   */
  readonly highlightZoomNodeWidthRatio = input<number>(0.3);

  /**
   * The ratio of the node's height to the viewport's height when highlighting.
   */
  readonly highlightZoomNodeHeightRatio = input<number>(0.4);
  /**
   * The minimum zoom level for the chart when highlighting a node.
   */
  readonly highlightZoomMinimum = input<number>(0.8);

  /**
   * The theme options for the org chart.
   * This allows customization of the chart's appearance, including node styles, connector styles, and
   * other visual elements.
   */
  readonly themeOptions = input<NgxInteractiveOrgChartTheme>();

  private readonly defaultThemeOptions: NgxInteractiveOrgChartTheme =
    DEFAULT_THEME_OPTIONS;

  protected panZoomInstance: PanZoom | null = null;

  protected readonly finalThemeOptions = computed<NgxInteractiveOrgChartTheme>(
    () => {
      const themeOptions = this.themeOptions();

      return {
        node: {
          ...this.defaultThemeOptions.node,
          ...themeOptions?.node,
        },
        connector: {
          ...this.defaultThemeOptions.connector,
          ...themeOptions?.connector,
        },
        collapseButton: {
          ...this.defaultThemeOptions.collapseButton,
          ...themeOptions?.collapseButton,
        },
        container: {
          ...this.defaultThemeOptions.container,
          ...themeOptions?.container,
        },
      };
    }
  );

  protected readonly nodes = signal<OrgChartNode<T> | null>(null);

  protected readonly scale = signal<number>(0);

  /**
   * A computed property that returns the current scale of the org chart.
   * @returns {number} The current scale of the org chart.
   */
  readonly getScale = computed(() => this.scale());

  /**
   * A computed property that flattens the org chart nodes into a single array.
   * It recursively traverses the nodes and their children, returning a flat array of OrgChartNode<T>.
   * This is useful for operations that require a single list of all nodes, such as searching or displaying all nodes in a list.
   * @returns {OrgChartNode<T>[]} An array of all nodes in the org chart, flattened from the hierarchical structure.
   */
  readonly flattenedNodes = computed(() => {
    const nodes = this.nodes();

    if (!nodes) return [];

    const flatten = (node: OrgChartNode<T>): OrgChartNode<T>[] => {
      const children: OrgChartNode<T>[] =
        (node.children as OrgChartNode<T>[] | undefined)?.flatMap(flatten) ||
        [];
      return [node, ...children];
    };

    return nodes ? flatten(nodes) : [];
  });

  private readonly setNodes = effect(() => {
    const data = this.data();
    const initialCollapsed = this.initialCollapsed();

    if (data) {
      this.nodes.set(mapNodesRecursively(data, initialCollapsed));
    }
  });

  ngAfterViewInit(): void {
    this.initiatePanZoom();
  }

  /**
   * Initializes the pan-zoom functionality for the org chart.
   * This method creates a new panZoom instance and sets it up with the container element.
   * It also ensures that any existing panZoom instance is disposed of before creating a new one.
   */
  initiatePanZoom(): void {
    if (this.panZoomInstance) {
      this.panZoomInstance.dispose();
    }

    const container = this.panZoomContainer()?.nativeElement;
    const hostingElement = this.#elementRef.nativeElement;

    this.panZoomInstance = createPanZoom(container, {
      autocenter: true,
      initialZoom: this.getFitScale(),
      initialX: hostingElement.offsetWidth / 2,
      initialY: hostingElement.offsetHeight / 2,
      enableTextSelection: false,
      minZoom: this.minZoom(),
      maxZoom: this.maxZoom(),
      zoomSpeed: this.zoomSpeed(),
      smoothScroll: true,
      zoomDoubleClickSpeed: this.zoomDoubleClickSpeed(),
    });

    this.calculateScale();

    this.panZoomInstance?.on('zoom', e => {
      this.calculateScale();
    });
  }

  /**
   * Zooms in of the org chart.
   * @param {Object} options - Options for zooming.
   * @param {number} [options.by=10] - The percentage to zoom in or out by.
   * @param {boolean} [options.relative=true] - Whether to zoom relative to the current zoom level.
   * If true, zooms in by a percentage of the current zoom level.
   * If false, zooms to an absolute scale.
   */
  zoomIn(
    { by, relative }: { by?: number; relative?: boolean } = { relative: true }
  ): void {
    this.zoom({ type: 'in', by, relative });
  }

  /**
   * Zooms out of the org chart.
   * @param {Object} options - Options for zooming.
   * @param {number} [options.by=10] - The percentage to zoom in or out by.
   * @param {boolean} [options.relative=true] - Whether to zoom relative to the current zoom level.
   * If true, zooms out by a percentage of the current zoom level.
   * If false, zooms to an absolute scale.
   */
  zoomOut(
    { by, relative }: { by?: number; relative?: boolean } = { relative: true }
  ): void {
    this.zoom({ type: 'out', by, relative });
  }

  /**
   * Highlights a specific node in the org chart and pans to it.
   * @param {string} nodeId - The ID of the node to highlight.
   */
  highlightNode(nodeId: string | number): void {
    this.toggleCollapseAll(false);

    setTimeout(() => {
      const nodeElement = this.#elementRef?.nativeElement.querySelector(
        `#${this.getNodeId(nodeId)}`
      ) as HTMLElement;

      this.panZoomToNode({
        nodeElement,
      });
    }, 200);
  }

  /**
   * Resets the pan position of the org chart to center it horizontally and vertically.
   * This method calculates the center position based on the container's dimensions
   * and the hosting element's dimensions, then moves the panZoom instance to that position.
   */
  resetPan(): void {
    const container = this.panZoomContainer()?.nativeElement;

    if (!container || !this.panZoomInstance) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const hostingElement = this.#elementRef.nativeElement;
    const windowWidth = hostingElement.getBoundingClientRect().width;
    const windowHeight = hostingElement.getBoundingClientRect().height;

    this.panZoomInstance?.smoothMoveTo(
      (-1 * containerRect.width) / 2 + windowWidth / 2,
      (-1 * containerRect.height) / 2 + windowHeight / 2
    );
  }

  /**
   * Resets the zoom level of the org chart to fit the content within the container.
   * This method calculates the optimal scale to fit the content and applies it.
   * @param {number} [padding=20] - Optional padding around the content when calculating the fit scale.
   */
  resetZoom(padding: number = 20): void {
    if (!this.panZoomInstance) {
      return;
    }

    const container = this.panZoomContainer()?.nativeElement;

    if (!container) {
      return;
    }

    this.zoomOut({ by: this.getFitScale(padding) });
  }

  /**
   * Resets both the pan position and zoom level of the org chart.
   * This method first resets the pan position, then resets the zoom level after a short delay.
   * @param {number} [padding=20] - Optional padding around the content when calculating the fit scale.
   */
  resetPanAndZoom(padding = 20): void {
    this.resetPan();

    setTimeout(() => {
      this.resetZoom(padding);
    }, RESET_DELAY);
  }

  /**
   * Toggles the collapse state of all nodes in the org chart.
   * If `collapse` is provided, it will collapse or expand all nodes accordingly.
   * If not provided, it will toggle the current state of the root node.
   */
  toggleCollapseAll(collapse?: boolean): void {
    const nodes = this.nodes();

    if (nodes?.children?.length && this.collapsible()) {
      this.onToggleCollapse({ node: nodes, collapse });
    }
  }

  /**
   * Toggles the collapse state of a specific node in the org chart.
   * If `collapse` is provided, it will collapse or expand the node accordingly.
   * If not provided, it will toggle the current state of the node.
   * @param {Object} options - Options for toggling collapse.
   * @param {OrgChartNode<T>} options.node - The node to toggle.
   * @param {boolean} [options.collapse] - Whether to collapse or expand the node.
   * @param {boolean} [options.highlightNode=false] - Whether to highlight the node after toggling.
   * @param {boolean} [options.playAnimation=false] - Whether to play animation when highlighting.
   */
  onToggleCollapse({
    node,
    collapse,
    highlightNode = false,
    playAnimation = false,
  }: {
    node: OrgChartNode<T>;
    collapse?: boolean;
    highlightNode?: boolean;
    playAnimation?: boolean;
  }): void {
    if (!this.collapsible()) {
      return;
    }

    const nodeId = node.id as string;
    const wasCollapsed = node.collapsed;

    const nodes = toggleNodeCollapse<T>({
      node: this.nodes() as OrgChartNode<T>,
      targetNode: nodeId,
      collapse,
    });

    this.nodes.set(nodes);

    this.panZoomInstance?.resume();

    if (highlightNode) {
      setTimeout(() => {
        const nodeElement = this.#elementRef?.nativeElement.querySelector(
          `#${
            wasCollapsed
              ? this.getNodeChildrenId(nodeId)
              : this.getNodeId(nodeId)
          }`
        ) as HTMLElement;

        this.panZoomToNode({
          nodeElement,
          skipZoom: true,
          playAnimation,
        });
      }, 200); // allow the DOM finish animation before highlighting
    }
  }

  protected zoom({
    type,
    by = 10,
    relative,
  }: {
    type: 'in' | 'out';
    by?: number;
    relative?: boolean;
  }): void {
    const containerEl = this.container()?.nativeElement;
    const containerRect = containerEl.getBoundingClientRect();
    const hostElement = this.#elementRef?.nativeElement;
    const hostElementRect = hostElement.getBoundingClientRect();
    const { scale } = this.panZoomInstance?.getTransform() ?? {
      scale: 1,
    };

    const centerX =
      containerRect.width / 2 + containerRect.x - hostElementRect.x;
    const centerY =
      containerRect.height / 2 + containerRect.y - hostElementRect.y;

    const newScale = relative
      ? type === 'in'
        ? scale * (1 + by / 100)
        : scale / (1 + by / 100)
      : by;

    this.panZoomInstance?.smoothZoomAbs(centerX, centerY, newScale);
  }

  protected panZoomToNode({
    nodeElement,
    skipZoom,
    playAnimation = true,
  }: {
    nodeElement: HTMLElement;
    skipZoom?: boolean;
    playAnimation?: boolean;
  }): void {
    const container = this.panZoomContainer()?.nativeElement;

    if (!container || !nodeElement || !this.panZoomInstance) {
      return;
    }

    const highlightedElements = container.querySelectorAll('.highlighted');
    highlightedElements.forEach(el => {
      el.classList.remove('highlighted');
    });

    this.panZoomInstance?.pause();
    this.panZoomInstance?.resume();

    setTimeout(() => {
      const hostElementRect =
        this.#elementRef.nativeElement.getBoundingClientRect();

      const nodeRect1 = nodeElement.getBoundingClientRect();
      const clientX = nodeRect1.x - nodeRect1.width / 2 - hostElementRect.x;
      const clientY = nodeRect1.y - nodeRect1.height / 2 - hostElementRect.y;

      if (!skipZoom) {
        const dynamicZoom = this.calculateOptimalZoom(nodeElement);
        this.panZoomInstance?.smoothZoomAbs(clientX, clientY, dynamicZoom);
      }
    }, 10);

    setTimeout(() => {
      const containerRect = container.getBoundingClientRect();
      const nodeRect = nodeElement.getBoundingClientRect();
      const hostingElement = this.#elementRef.nativeElement;
      const windowWidth = hostingElement.getBoundingClientRect().width;
      const windowHeight = hostingElement.getBoundingClientRect().height;

      const transformedNodeX = -1 * (nodeRect.x - containerRect.x);
      const transformedNodeY = -1 * (nodeRect.y - containerRect.y);

      const windowCenterX = windowWidth / 2;
      const windowCenterY = windowHeight / 2;
      const x = transformedNodeX + windowCenterX - nodeRect.width / 2;
      const y = transformedNodeY + windowCenterY - nodeRect.height / 2;

      this.panZoomInstance?.smoothMoveTo(x, y);

      if (playAnimation) {
        nodeElement.classList.add('highlighted');
        setTimeout(() => {
          nodeElement.classList.remove('highlighted');
        }, 2300);
      }
    }, 200); // allow some time for the zoom to take effect
  }

  protected getNodeId(nodeId: string | number): string {
    return `node-${nodeId}`;
  }

  protected getNodeChildrenId(nodeId: string | number): string {
    return `node-children-${nodeId}`;
  }

  private calculateScale(): void {
    const transform = this.panZoomInstance?.getTransform();
    const currentScale = transform?.scale ?? 0;

    const minZoom = this.minZoom();
    const maxZoom = this.maxZoom();

    if (minZoom === maxZoom) {
      this.scale.set(0);
      return;
    }

    const ratio = (currentScale - minZoom) / (maxZoom - minZoom);
    const scalePercentage = Math.round(ratio * 10000) / 100;

    this.scale.set(scalePercentage);
  }

  private getFitScale(padding: number = 20): number {
    const hostingElement = this.#elementRef?.nativeElement;
    const contentEl = this.container()?.nativeElement;

    if (!hostingElement || !contentEl) return 1;

    const containerRect = hostingElement.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Use actual unscaled dimensions of content
    const contentWidth = contentEl.clientWidth;
    const contentHeight = contentEl.clientHeight;

    // Optional padding around the content
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;

    // Never upscale beyond 1
    const fitScale = Math.min(scaleX, scaleY, 1);

    return fitScale;
  }

  /**
   * Calculates the optimal zoom level for highlighting a specific node.
   * The zoom is calculated to ensure the node is appropriately sized relative to the container,
   * while respecting the minimum and maximum zoom constraints.
   * @param {HTMLElement} nodeElement - The node element to calculate zoom for.
   * @returns {number} The optimal zoom level for the node.
   */
  private calculateOptimalZoom(nodeElement: HTMLElement): number {
    const hostingElement = this.#elementRef?.nativeElement;

    if (!hostingElement || !nodeElement) {
      return 1.5; // fallback to original value
    }

    const containerRect = hostingElement.getBoundingClientRect();
    const nodeRect = nodeElement.getBoundingClientRect();

    // Calculate the current transform to get actual node dimensions
    const currentTransform = this.panZoomInstance?.getTransform();
    const currentScale = currentTransform?.scale || 1;

    // Get the actual unscaled node dimensions
    const actualNodeWidth = nodeRect.width / currentScale;
    const actualNodeHeight = nodeRect.height / currentScale;

    // Use configurable ratios for target node size
    const targetNodeWidthRatio = this.highlightZoomNodeWidthRatio();
    const targetNodeHeightRatio = this.highlightZoomNodeHeightRatio();

    // Calculate zoom levels needed for width and height constraints
    const zoomForWidth =
      (containerRect.width * targetNodeWidthRatio) / actualNodeWidth;
    const zoomForHeight =
      (containerRect.height * targetNodeHeightRatio) / actualNodeHeight;

    // Use the smaller zoom to ensure the node fits well in both dimensions
    let optimalZoom = Math.min(zoomForWidth, zoomForHeight);

    // Apply zoom constraints
    const minZoom = this.minZoom();
    const maxZoom = this.maxZoom();
    optimalZoom = Math.max(minZoom, Math.min(maxZoom, optimalZoom));

    // Ensure a configurable minimum reasonable zoom for visibility
    const minimumZoom = this.highlightZoomMinimum();
    optimalZoom = Math.max(minimumZoom, optimalZoom);

    return optimalZoom;
  }

  ngOnDestroy(): void {
    this.panZoomInstance?.dispose();
  }
}
