import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ContentChild,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  NgxInteractiveOrgChartLayout,
  NgxInteractiveOrgChartTheme,
  OrgChartDropNodeEventArgs,
  OrgChartNode,
} from '../../models';
import {
  mapNodesRecursively,
  toggleNodeCollapse,
  createTouchDragGhost,
  updateTouchGhostPosition,
} from '../../helpers';

import createPanZoom, { PanZoom } from 'panzoom';
import { animate, style, transition, trigger } from '@angular/animations';
import { DEFAULT_THEME_OPTIONS } from './default-theme-options';

// Constants
const RESET_DELAY = 300; // ms
const TOUCH_DRAG_THRESHOLD = 10; // pixels
const AUTO_PAN_EDGE_THRESHOLD = 0.1; // 10% of container dimensions
const AUTO_PAN_SPEED = 15; // pixels per frame

/**
 * State for tracking touch drag operations.
 */
interface TouchDragState<T> {
  active: boolean;
  node: OrgChartNode<T> | null;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  dragThreshold: number;
  ghostElement: HTMLElement | null;
  ghostScaledWidth: number;
  ghostScaledHeight: number;
}

@Component({
  standalone: true,
  selector: 'ngx-interactive-org-chart',
  imports: [NgTemplateOutlet, NgClass, NgStyle],
  templateUrl: './ngx-interactive-org-chart.component.html',
  styleUrls: ['./ngx-interactive-org-chart.component.scss'],
  animations: [
    trigger('toggleNode', [
      transition(':enter', [
        style({ width: '0', height: '0', opacity: 0, transform: 'scale(0.8)' }),
        animate(
          '300ms ease-out',
          style({ width: '*', height: '*', opacity: 1, transform: 'scale(1)' })
        ),
      ]),
      transition(':leave', [
        style({ width: '*', height: '*' }),
        animate(
          '300ms ease-out',
          style({
            width: '0',
            height: '0',
            opacity: 0,
            transform: 'scale(0.8)',
          })
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
    '[style.--node-drag-over-outline-color]':
      'finalThemeOptions().node.dragOverOutlineColor',
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

  /**
   * Optional template for a custom node.
   * When provided, this template will be used to render each node in the org chart.
   *
   * @remarks
   * The template context includes:
   * - `$implicit`: The node data
   * - `node`: The node data (alternative accessor)
   *
   * @example
   * ```html
   * <ngx-interactive-org-chart>
   *   <ng-template #nodeTemplate let-node="node">
   *     <div class="custom-node">
   *       <h3>{{ node.data?.name }}</h3>
   *       <p>{{ node.data?.age }}</p>
   *     </div>
   *   </ng-template>
   * </ngx-interactive-org-chart>
   * ```
   */
  @ContentChild('nodeTemplate', { static: false })
  protected readonly customNodeTemplate?: TemplateRef<unknown>;

  /**
   * Optional template for a custom drag handle.
   * When provided, only this element will be draggable instead of the entire node.
   *
   * @remarks
   * The template context includes:
   * - `$implicit`: The node data
   * - `node`: The node data (alternative accessor)
   *
   * @example
   * ```html
   * <ngx-interactive-org-chart [draggable]="true">
   *   <ng-template #dragHandleTemplate let-node="node">
   *     <button class="drag-handle" title="Drag to move">
   *       <svg><!-- Drag icon --></svg>
   *     </button>
   *   </ng-template>
   * </ngx-interactive-org-chart>
   * ```
   */
  @ContentChild('dragHandleTemplate', { static: false })
  protected readonly customDragHandleTemplate?: TemplateRef<unknown>;

  protected readonly panZoomContainer =
    viewChild.required<ElementRef<HTMLElement>>('panZoomContainer');

  private readonly orgChartContainer =
    viewChild.required<ElementRef<HTMLElement>>('orgChartContainer');

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
   * Whether to enable drag and drop functionality for nodes.
   * When enabled, nodes can be dragged and dropped onto other nodes.
   *
   * @remarks
   * By default, the entire node is draggable. To use a custom drag handle instead,
   * provide a `dragHandleTemplate` template with the selector `#dragHandleTemplate`.
   *
   * @example
   * ```html
   * <ngx-interactive-org-chart [draggable]="true">
   *   <!-- Custom drag handle template -->
   *   <ng-template #dragHandleTemplate let-node="node">
   *     <span class="drag-handle">⋮⋮</span>
   *   </ng-template>
   * </ngx-interactive-org-chart>
   * ```
   */
  readonly draggable = input<boolean>(false);

  /**
   * Predicate function to determine if a specific node can be dragged.
   *
   * @param node - The node to check
   * @returns true if the node can be dragged, false otherwise
   *
   * @example
   * ```typescript
   * // Prevent CEO node from being dragged
   * canDragNode = (node: OrgChartNode) => node.data?.role !== 'CEO';
   * ```
   */
  readonly canDragNode = input<(node: OrgChartNode<T>) => boolean>();

  /**
   * Predicate function to determine if a node can accept drops.
   *
   * @param draggedNode - The node being dragged
   * @param targetNode - The potential drop target
   * @returns true if the drop is allowed, false otherwise
   *
   * @example
   * ```typescript
   * // Don't allow employees to have subordinates
   * canDropNode = (dragged: OrgChartNode, target: OrgChartNode) => {
   *   return target.data?.type !== 'Employee';
   * };
   * ```
   */
  readonly canDropNode =
    input<
      (draggedNode: OrgChartNode<T>, targetNode: OrgChartNode<T>) => boolean
    >();

  /**
   * The distance in pixels from the viewport edge to trigger auto-panning during drag.
   * The threshold is calculated automatically as 10% of the container dimensions for better responsiveness across different screen sizes.
   * @default 0.1
   */
  readonly dragEdgeThreshold = input<number>(AUTO_PAN_EDGE_THRESHOLD);

  /**
   * The speed of auto-panning in pixels per frame during drag.
   * @default 15
   */
  readonly dragAutoPanSpeed = input<number>(AUTO_PAN_SPEED);

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

  /**
   * Event emitted when a node is dropped onto another node.
   * Provides the dragged node and the target node.
   */
  readonly nodeDrop = output<OrgChartDropNodeEventArgs<T>>();

  /**
   * Event emitted when a node drag operation starts.
   */
  readonly nodeDragStart = output<OrgChartNode<T>>();

  /**
   * Event emitted when a node drag operation ends.
   */
  readonly nodeDragEnd = output<OrgChartNode<T>>();

  private readonly defaultThemeOptions: NgxInteractiveOrgChartTheme =
    DEFAULT_THEME_OPTIONS;

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

  protected readonly draggedNode = signal<OrgChartNode<T> | null>(null);

  protected readonly dragOverNode = signal<OrgChartNode<T> | null>(null);

  private autoPanInterval: number | null = null;
  private keyboardListener: ((event: KeyboardEvent) => void) | null = null;

  private touchDragState: TouchDragState<T> = {
    active: false,
    node: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    dragThreshold: TOUCH_DRAG_THRESHOLD,
    ghostElement: null,
    ghostScaledWidth: 0,
    ghostScaledHeight: 0,
  };

  protected panZoomInstance: PanZoom | null = null;

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
   * Pans the view of the org chart.
   * @param x The horizontal offset to pan to.
   * @param y The vertical offset to pan to.
   * @param smooth Whether to animate the panning.
   * @returns void
   */
  pan(x: number, y: number, smooth: boolean): void {
    const container = this.orgChartContainer()?.nativeElement;

    if (!container || !this.panZoomInstance) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const panZoomRect =
      this.panZoomContainer()?.nativeElement.getBoundingClientRect();

    const transformedX = x - containerRect.x + panZoomRect.x;
    const transformedY = y - containerRect.y + panZoomRect.y;

    if (smooth) {
      this.panZoomInstance.smoothMoveTo(transformedX, transformedY);
    } else {
      this.panZoomInstance.moveTo(transformedX, transformedY);
    }
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

    let x = (-1 * containerRect.width) / 2 + windowWidth / 2;

    if (this.layout() === 'horizontal') {
      if (this.isRtl()) {
        x = windowWidth - containerRect.width;
      } else {
        x = 0;
      }
    }

    const y = (-1 * containerRect.height) / 2 + windowHeight / 2;

    this.panZoomInstance?.smoothMoveTo(x, y);
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
    const containerEl = this.panZoomContainer()?.nativeElement;
    const containerRect = containerEl.getBoundingClientRect();
    const hostElement = this.#elementRef?.nativeElement;
    const hostElementRect = hostElement.getBoundingClientRect();
    const { scale } = this.panZoomInstance?.getTransform() ?? {
      scale: 1,
    };

    let centerX = containerRect.width / 2 + containerRect.x - hostElementRect.x;
    const centerY =
      containerRect.height / 2 + containerRect.y - hostElementRect.y;

    if (this.layout() === 'horizontal') {
      if (this.isRtl()) {
        centerX = containerRect.width + containerRect.x - hostElementRect.x;
      } else {
        centerX = 0;
      }
    }

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

  /**
   * Handles the drag start event for a node.
   * @param event - The drag event
   * @param node - The node being dragged
   */
  protected onDragStart(event: DragEvent, node: OrgChartNode<T>): void {
    if (!this.draggable()) return;

    const canDrag = this.canDragNode();

    if (canDrag && !canDrag(node)) {
      event.preventDefault();

      return;
    }

    this.draggedNode.set(node);
    this.nodeDragStart.emit(node);

    this.panZoomInstance?.pause();

    const target = event.target as HTMLElement;
    const nodeContent = target.closest('.node-content') as HTMLElement;

    if (event.dataTransfer && nodeContent) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', node.id?.toString() || '');
    }

    if (nodeContent) {
      setTimeout(() => {
        nodeContent.classList.add('dragging');
      }, 0);
    }

    this.setupKeyboardListener();
  }

  /**
   * Sets up keyboard event listener for drag cancellation.
   */
  private setupKeyboardListener(): void {
    this.removeKeyboardListener();

    this.keyboardListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.draggedNode()) {
        this.cancelDrag();
      }
    };

    document.addEventListener('keydown', this.keyboardListener);
  }

  /**
   * Removes the keyboard event listener.
   */
  private removeKeyboardListener(): void {
    if (this.keyboardListener) {
      document.removeEventListener('keydown', this.keyboardListener);

      this.keyboardListener = null;
    }
  }

  private cancelDrag(): void {
    if (!this.draggedNode()) return;

    this.stopAutoPan();
    this.panZoomInstance?.resume();

    const allNodes =
      this.#elementRef.nativeElement.querySelectorAll('.node-content');
    allNodes.forEach(node => {
      node.classList.remove('drag-over');
      node.classList.remove('dragging');
      node.classList.remove('drag-not-allowed');
    });

    this.draggedNode.set(null);
    this.dragOverNode.set(null);

    this.removeKeyboardListener();

    // Clean up touch drag state if active
    if (this.touchDragState.active) {
      this.removeTouchGhostElement();
      this.removeTouchListeners();
      this.resetTouchDragState();
    }
  }

  /**
   * Handles the drag end event for a node.
   * @param event - The drag event
   * @param node - The node that was being dragged
   */
  protected onDragEnd(event: DragEvent, node: OrgChartNode<T>): void {
    if (!this.draggable()) return;

    this.nodeDragEnd.emit(node);
    this.draggedNode.set(null);
    this.dragOverNode.set(null);

    this.stopAutoPan();
    this.removeKeyboardListener();

    this.panZoomInstance?.resume();

    const target = event.target as HTMLElement;
    const nodeContent = target.closest('.node-content') as HTMLElement;

    if (nodeContent) {
      nodeContent.classList.remove('dragging');
    }

    const allNodes =
      this.#elementRef.nativeElement.querySelectorAll('.node-content');
    allNodes.forEach(node => node.classList.remove('drag-over'));
  }

  /**
   * Handles the drag over event for a node.
   * @param event - The drag event
   * @param node - The node being dragged over
   */
  protected onDragOver(event: DragEvent, node: OrgChartNode<T>): void {
    if (!this.draggable() || !this.draggedNode()) return;

    event.preventDefault();

    const draggedNode = this.draggedNode();
    if (!draggedNode) return;

    if (this.isNodeDescendant(node, draggedNode)) {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'none';
      }
      return;
    }

    const canDrop = this.canDropNode();

    if (canDrop && !canDrop(draggedNode, node)) {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'none';
      }
      return;
    }

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    this.dragOverNode.set(node);
  }

  /**
   * Handles the drag over event on the container for auto-panning.
   * @param event - The drag event
   */
  protected onContainerDragOver(event: DragEvent): void {
    if (!this.draggable() || !this.draggedNode()) return;

    event.preventDefault();

    this.handleAutoPan(event);
  }

  /**
   * Handles the drag enter event for a node.
   * @param event - The drag event
   * @param node - The node being entered
   */
  protected onDragEnter(event: DragEvent, node: OrgChartNode<T>): void {
    if (!this.draggable() || !this.draggedNode()) return;

    const draggedNode = this.draggedNode();
    if (!draggedNode) return;

    if (this.isNodeDescendant(node, draggedNode)) {
      return;
    }

    const canDrop = this.canDropNode();

    if (canDrop && !canDrop(draggedNode, node)) {
      return;
    }

    const target = event.target as HTMLElement;
    const nodeElement = target.closest('.node-content') as HTMLElement;

    if (nodeElement) {
      nodeElement.classList.add('drag-over');
    }
  }

  /**
   * Handles the drag leave event for a node.
   * @param event - The drag event
   */
  protected onDragLeave(event: DragEvent): void {
    if (!this.draggable()) return;

    const target = event.target as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;
    const nodeElement = target.closest('.node-content') as HTMLElement;

    if (nodeElement && !nodeElement.contains(relatedTarget)) {
      nodeElement.classList.remove('drag-over');
    }
  }

  /**
   * Handles the drop event for a node.
   * @param event - The drag event
   * @param targetNode - The node where the drop occurred
   */
  protected onDrop(event: DragEvent, targetNode: OrgChartNode<T>): void {
    if (!this.draggable()) return;

    event.preventDefault();
    event.stopPropagation();

    const draggedNode = this.draggedNode();
    if (!draggedNode) return;

    if (this.isNodeDescendant(targetNode, draggedNode)) {
      return;
    }

    const canDrop = this.canDropNode();

    if (canDrop && !canDrop(draggedNode, targetNode)) {
      return;
    }

    this.nodeDrop.emit({
      draggedNode,
      targetNode,
    });

    const target = event.target as HTMLElement;
    const nodeElement = target.closest('.node-content') as HTMLElement;

    if (nodeElement) {
      nodeElement.classList.remove('drag-over');
    }

    this.dragOverNode.set(null);

    this.stopAutoPan();
    this.panZoomInstance?.resume();
  }

  /**
   * Checks if a node is a descendant of another node.
   * @param node - The node to check
   * @param potentialAncestor - The potential ancestor node
   * @returns true if node is a descendant of potentialAncestor
   */
  private isNodeDescendant(
    node: OrgChartNode<T>,
    potentialAncestor: OrgChartNode<T>
  ): boolean {
    if (node.id === potentialAncestor.id) {
      return true;
    }

    if (!potentialAncestor.children?.length) {
      return false;
    }

    return potentialAncestor.children.some(child =>
      this.isNodeDescendant(node, child as OrgChartNode<T>)
    );
  }

  /**
   * Handles the touch start event for drag on mobile devices.
   * @param event - The touch event
   * @param node - The node being touched
   */
  protected onTouchStart(event: TouchEvent, node: OrgChartNode<T>): void {
    if (!this.draggable()) return;

    const canDrag = this.canDragNode();
    if (canDrag && !canDrag(node)) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) return;

    this.touchDragState.node = node;
    this.touchDragState.startX = touch.clientX;
    this.touchDragState.startY = touch.clientY;
    this.touchDragState.currentX = touch.clientX;
    this.touchDragState.currentY = touch.clientY;
    this.touchDragState.active = false;

    document.addEventListener('touchmove', this.onTouchMoveDocument, {
      passive: false,
    });

    document.addEventListener('touchend', this.onTouchEndDocument);
    document.addEventListener('touchcancel', this.onTouchEndDocument);
  }

  /**
   * Handles touch move event during drag on mobile devices.
   */
  private onTouchMoveDocument(event: TouchEvent): void {
    if (!this.touchDragState.node) return;

    const touch = event.touches[0];
    if (!touch) return;

    this.touchDragState.currentX = touch.clientX;
    this.touchDragState.currentY = touch.clientY;

    if (!this.touchDragState.active) {
      const deltaX = Math.abs(touch.clientX - this.touchDragState.startX);
      const deltaY = Math.abs(touch.clientY - this.touchDragState.startY);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance >= this.touchDragState.dragThreshold) {
        this.touchDragState.active = true;
        this.draggedNode.set(this.touchDragState.node);
        this.nodeDragStart.emit(this.touchDragState.node);
        this.setupKeyboardListener();

        this.panZoomInstance?.pause();

        this.createTouchGhostElement(this.touchDragState.node);

        const nodeElement = this.getNodeElement(this.touchDragState.node);
        if (nodeElement) {
          nodeElement.classList.add('dragging');
        }
      }
    }

    if (this.touchDragState.active) {
      event.preventDefault();

      this.updateTouchGhostPosition(touch.clientX, touch.clientY);

      this.handleTouchAutoPan(touch.clientX, touch.clientY);

      const elementUnderTouch = this.getElementUnderTouch(
        touch.clientX,
        touch.clientY
      );

      if (elementUnderTouch) {
        const nodeElement = elementUnderTouch.closest(
          '.node-content'
        ) as HTMLElement;

        if (nodeElement && nodeElement.id) {
          const nodeId = this.getNodeIdFromElement(nodeElement);
          const node = this.findNodeById(nodeId);

          if (node) {
            this.handleTouchDragOver(node);
          } else {
            this.clearDragOverState();
          }
        } else {
          this.clearDragOverState();
        }
      } else {
        this.clearDragOverState();
      }
    }
  }

  /**
   * Handles touch end event during drag on mobile devices.
   */
  private onTouchEndDocument(event: TouchEvent): void {
    if (!this.touchDragState.node) return;

    if (this.touchDragState.active) {
      let targetNode: OrgChartNode<T> | null = null;

      const touch =
        event.changedTouches[0] ||
        (event.touches.length > 0 ? event.touches[0] : null);

      if (touch) {
        const elementUnderTouch = this.getElementUnderTouch(
          touch.clientX,
          touch.clientY
        );

        if (elementUnderTouch) {
          const nodeElement = elementUnderTouch.closest(
            '.node-content'
          ) as HTMLElement;

          if (nodeElement && nodeElement.id) {
            const nodeId = this.getNodeIdFromElement(nodeElement);
            targetNode = this.findNodeById(nodeId);
          }
        }
      }

      const draggedNode = this.draggedNode();

      if (targetNode && draggedNode && targetNode.id !== draggedNode.id) {
        const isDescendant = this.isNodeDescendant(targetNode, draggedNode);
        const canDrop = this.canDropNode();
        const dropAllowed =
          !isDescendant && (!canDrop || canDrop(draggedNode, targetNode));

        if (dropAllowed) {
          this.nodeDrop.emit({
            draggedNode,
            targetNode,
          });
        }
      }

      this.removeTouchGhostElement();
      this.nodeDragEnd.emit(this.touchDragState.node);

      const nodeElement = this.getNodeElement(this.touchDragState.node);
      if (nodeElement) {
        nodeElement.classList.remove('dragging');
      }

      this.clearDragOverState();
      this.draggedNode.set(null);
      this.stopAutoPan();
      this.removeKeyboardListener();
      this.panZoomInstance?.resume();
    }

    this.resetTouchDragState();
    this.removeTouchListeners();
  }

  /**
   * Resets the touch drag state to its initial values.
   */
  private resetTouchDragState(): void {
    this.touchDragState = {
      active: false,
      node: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      dragThreshold: TOUCH_DRAG_THRESHOLD,
      ghostElement: null,
      ghostScaledWidth: 0,
      ghostScaledHeight: 0,
    };
  }

  /**
   * Removes touch event listeners from the document.
   */
  private removeTouchListeners(): void {
    document.removeEventListener('touchmove', this.onTouchMoveDocument);
    document.removeEventListener('touchend', this.onTouchEndDocument);
    document.removeEventListener('touchcancel', this.onTouchEndDocument);
  }

  /**
   * Creates a ghost element to follow the touch during drag.
   */
  private createTouchGhostElement(node: OrgChartNode<T>): void {
    const nodeElement = this.getNodeElement(node);
    if (!nodeElement) return;

    const currentScale = this.panZoomInstance?.getTransform()?.scale ?? 1;

    const result = createTouchDragGhost({
      nodeElement,
      currentScale,
      touchX: this.touchDragState.currentX,
      touchY: this.touchDragState.currentY,
    });

    this.touchDragState.ghostElement = result.wrapper;
    this.touchDragState.ghostScaledWidth = result.scaledWidth;
    this.touchDragState.ghostScaledHeight = result.scaledHeight;
  }

  /**
   * Updates the position of the touch ghost element.
   */
  private updateTouchGhostPosition(x: number, y: number): void {
    if (!this.touchDragState.ghostElement) return;

    updateTouchGhostPosition(
      this.touchDragState.ghostElement,
      x,
      y,
      this.touchDragState.ghostScaledWidth,
      this.touchDragState.ghostScaledHeight
    );
  }

  /**
   * Removes the touch ghost element.
   */
  private removeTouchGhostElement(): void {
    if (this.touchDragState.ghostElement) {
      this.touchDragState.ghostElement.remove();
      this.touchDragState.ghostElement = null;
    }
  }

  /**
   * Gets the element under a touch point.
   */
  private getElementUnderTouch(x: number, y: number): Element | null {
    const ghost = this.touchDragState.ghostElement;
    const originalDisplay = ghost ? ghost.style.display : '';

    if (ghost) {
      ghost.style.display = 'none';
    }

    const element = document.elementFromPoint(x, y);

    if (ghost) {
      ghost.style.display = originalDisplay;
    }

    return element;
  }

  /**
   * Handles touch drag over a node.
   */
  private handleTouchDragOver(node: OrgChartNode<T>): void {
    const draggedNode = this.draggedNode();
    if (!draggedNode) return;

    if (node.id === draggedNode.id) {
      this.clearDragOverState();
      return;
    }

    if (this.isNodeDescendant(node, draggedNode)) {
      this.clearDragOverState();
      const nodeElement = this.getNodeElement(node);

      if (nodeElement) {
        nodeElement.classList.add('drag-not-allowed');
      }

      return;
    }

    const canDrop = this.canDropNode();

    if (canDrop && !canDrop(draggedNode, node)) {
      this.clearDragOverState();

      const nodeElement = this.getNodeElement(node);

      if (nodeElement) {
        nodeElement.classList.add('drag-not-allowed');
      }

      return;
    }

    if (this.dragOverNode() !== node) {
      this.clearDragOverState();

      this.dragOverNode.set(node);
      const nodeElement = this.getNodeElement(node);

      if (nodeElement) {
        nodeElement.classList.add('drag-over');
      }
    }
  }

  /**
   * Clears all drag-over visual states.
   */
  private clearDragOverState(): void {
    const allNodes =
      this.#elementRef.nativeElement.querySelectorAll('.node-content');

    allNodes.forEach(node => {
      node.classList.remove('drag-over');
      node.classList.remove('drag-not-allowed');
    });

    this.dragOverNode.set(null);
  }

  /**
   * Gets a node element by node data.
   */
  private getNodeElement(node: OrgChartNode<T>): HTMLElement | null {
    if (!node.id) return null;

    const nodeId = this.getNodeId(node.id);

    return this.#elementRef.nativeElement.querySelector(`#${nodeId}`);
  }

  /**
   * Gets node ID from a DOM element.
   */
  private getNodeIdFromElement(element: HTMLElement): string | number {
    const id = element.id.replace('node-', '');
    const numId = parseInt(id, 10);

    return isNaN(numId) ? id : numId;
  }

  /**
   * Finds a node by ID in the tree.
   */
  private findNodeById(id: string | number): OrgChartNode<T> | null {
    const nodes = this.nodes();
    if (!nodes) return null;

    const search = (node: OrgChartNode<T>): OrgChartNode<T> | null => {
      if (node.id === id || node.id?.toString() === id.toString()) {
        return node;
      }

      if (node.children) {
        for (const child of node.children as OrgChartNode<T>[]) {
          const found = search(child);
          if (found) return found;
        }
      }
      return null;
    };

    return search(nodes);
  }

  /**
   * Handles auto-panning during touch drag.
   */
  private handleTouchAutoPan(x: number, y: number): void {
    const hostElement = this.#elementRef.nativeElement;
    const rect = hostElement.getBoundingClientRect();

    const touchX = x - rect.left;
    const touchY = y - rect.top;

    const thresholdX = rect.width * this.dragEdgeThreshold();
    const thresholdY = rect.height * this.dragEdgeThreshold();

    let panX = 0;
    let panY = 0;

    if (touchX < thresholdX) {
      panX = this.dragAutoPanSpeed();
    } else if (touchX > rect.width - thresholdX) {
      panX = -this.dragAutoPanSpeed();
    }

    if (touchY < thresholdY) {
      panY = this.dragAutoPanSpeed();
    } else if (touchY > rect.height - thresholdY) {
      panY = -this.dragAutoPanSpeed();
    }

    if (panX !== 0 || panY !== 0) {
      this.startAutoPan(panX, panY);
    } else {
      this.stopAutoPan();
    }
  }

  private handleAutoPan(event: DragEvent): void {
    const hostElement = this.#elementRef.nativeElement;
    const rect = hostElement.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const thresholdX = rect.width * this.dragEdgeThreshold();
    const thresholdY = rect.height * this.dragEdgeThreshold();

    let panX = 0;
    let panY = 0;

    if (mouseX < thresholdX) {
      panX = this.dragAutoPanSpeed();
    } else if (mouseX > rect.width - thresholdX) {
      panX = -this.dragAutoPanSpeed();
    }

    if (mouseY < thresholdY) {
      panY = this.dragAutoPanSpeed();
    } else if (mouseY > rect.height - thresholdY) {
      panY = -this.dragAutoPanSpeed();
    }

    if (panX !== 0 || panY !== 0) {
      this.startAutoPan(panX, panY);
    } else {
      this.stopAutoPan();
    }
  }

  private startAutoPan(panX: number, panY: number): void {
    this.stopAutoPan();

    this.autoPanInterval = window.setInterval(() => {
      if (!this.panZoomInstance) return;

      const transform = this.panZoomInstance.getTransform();
      const newX = transform.x + panX;
      const newY = transform.y + panY;

      this.panZoomInstance.moveTo(newX, newY);
    }, 16); // ~60fps
  }

  private stopAutoPan(): void {
    if (this.autoPanInterval !== null) {
      clearInterval(this.autoPanInterval);

      this.autoPanInterval = null;
    }
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
    const contentEl = this.orgChartContainer()?.nativeElement;

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
    this.stopAutoPan();
    this.removeKeyboardListener();
    this.panZoomInstance?.dispose();
  }
}
