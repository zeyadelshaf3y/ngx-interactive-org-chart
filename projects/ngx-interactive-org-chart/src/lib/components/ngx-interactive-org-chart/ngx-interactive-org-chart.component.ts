import { NgClass, NgTemplateOutlet } from '@angular/common';
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
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { OrgChartConfig, OrgChartNode } from '../../models';
import { mapNodesRecursively, toggleNodeCollapse } from '../../helpers';

import createPanZoom, { PanZoom } from 'panzoom';
import { animate, style, transition, trigger } from '@angular/animations';

const RESET_DELAY = 300; // ms

@Component({
  standalone: true,
  selector: 'ngx-interactive-org-chart',
  imports: [NgTemplateOutlet, NgClass],
  templateUrl: './ngx-interactive-org-chart.component.html',
  styleUrls: ['./ngx-interactive-org-chart.component.scss'],
  animations: [
    trigger('toggleNode', [
      transition(':enter', [
        style({ width: '0', height: '0', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ width: '*', height: '*', opacity: 1 }),
        ),
      ]),
      transition(':leave', [
        style({ width: '*', height: '*' }),
        animate(
          '300ms ease-out',
          style({ width: '0', height: '0', opacity: 0 }),
        ),
      ]),
    ]),
  ],
  host: {
    '[style.--base-delay]': 'finalConfig().connectorsAnimationDelay',
    '[style.--animation-duration]': 'finalConfig().animationDuration',
    '[style.--collapse-duration]': 'finalConfig().collapseDuration',
    '[style.--node-padding]': 'finalConfig().nodePadding',
    '[style.--node-container-spacing]': 'finalConfig().nodeContainerSpacing',
    '[style.--node-border-radius]': 'finalConfig().nodeBorderRadius',
    '[style.--connector-color]': 'finalConfig().connectorColor',
    '[style.--connector-border-radius]': 'finalConfig().connectorBorderRadius',
    '[style.--connector-active-color]': 'finalConfig().connectorActiveColor',
    '[style.--connector-width]': 'finalConfig().connectorWidth',
    '[style.--collapse-button-size]': 'finalConfig().collapseButtonSize',
    '[style.--collapse-button-border-radius]':
      'finalConfig().collapseButtonBorderRadius',
    '[style.--node-active-border-color]':
      'finalConfig().nodeActiveBorderColor ?? finalConfig().connectorColor',
    '[style.--node-max-width]': 'finalConfig().nodeMaxWidth',
    '[style.--node-min-width]': 'finalConfig().nodeMinWidth',
    '[style.--node-max-height]': 'finalConfig().nodeMaxHeight',
    '[style.--node-min-height]': 'finalConfig().nodeMinHeight',
  },
})
export class NgxInteractiveOrgChart<T> implements AfterViewInit, OnDestroy {
  readonly elementRef = inject(ElementRef);

  @ContentChild('nodeTemplate', { static: false })
  protected readonly customNodeTemplate?: TemplateRef<unknown>;

  readonly panZoomContainer = viewChild<ElementRef>('panZoomContainer');

  readonly data = input.required<OrgChartNode<T>>();
  readonly collapsible = input<boolean>(true);
  readonly nodeClass = input<string>();
  readonly initialCollapsed = input<boolean>();
  readonly isRtl = input<boolean>();

  readonly config = input<Partial<OrgChartConfig>>({});

  // Default configuration
  private readonly defaultConfig: OrgChartConfig = {
    connectorsAnimationDelay: '100ms',
    animationDuration: '500ms',
    collapseDuration: '300ms',
    nodePadding: '20px',
    nodeContainerSpacing: '20px',
    nodeBorderRadius: '8px',
    connectorColor: 'var(--gray-300)',
    connectorBorderRadius: '10px',
    connectorActiveColor: 'var(--active-color)',
    connectorWidth: '1.5px',
    collapseButtonSize: '20px',
    collapseButtonBorderRadius: '0.25rem',
    nodeActiveBorderColor: 'var(--active-color)',
    nodeMaxWidth: 'auto',
    nodeMinWidth: 'auto',
    nodeMaxHeight: 'auto',
    nodeMinHeight: 'auto',
  };

  protected panZoomInstance: PanZoom | null = null;

  protected readonly finalConfig = computed<OrgChartConfig>(() => {
    const userConfig = this.config();

    return { ...this.defaultConfig, ...userConfig };
  });

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

    const container = this.panZoomContainer()?.nativeElement as HTMLElement;

    this.panZoomInstance = createPanZoom(container, {
      autocenter: true,
      bounds: true,
      enableTextSelection: false,
      minZoom: 0.1,
      maxZoom: 5,
      zoomSpeed: 1,
      smoothScroll: true,
      zoomDoubleClickSpeed: 2,
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
    { by, relative }: { by?: number; relative?: boolean } = { relative: true },
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
    { by, relative }: { by?: number; relative?: boolean } = { relative: true },
  ): void {
    this.zoom({ type: 'out', by, relative });
  }

  /**
   * Highlights a specific node in the org chart and pans to it.
   * @param {string} nodeId - The ID of the node to highlight.
   */
  highlightNode(nodeId: string): void {
    this.toggleCollapseAll(false);

    setTimeout(() => {
      const nodeElement = this.elementRef?.nativeElement.querySelector(
        `#${this.getNodeId(nodeId)}`,
      ) as HTMLElement;

      this.panZoomToNode({
        nodeElement,
      });
    }, 10);
  }

  /**
   * Resets the pan position of the org chart to center it horizontally and vertically.
   * This method calculates the center position based on the container's dimensions
   * and the hosting element's dimensions, then moves the panZoom instance to that position.
   */
  resetPan(): void {
    const container = this.panZoomContainer()?.nativeElement as HTMLElement;

    if (!container || !this.panZoomInstance) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const hostingElement = this.elementRef.nativeElement as HTMLElement;
    const windowWidth = hostingElement.getBoundingClientRect().width;
    const windowHeight = hostingElement.getBoundingClientRect().height;

    this.panZoomInstance?.smoothMoveTo(
      (-1 * containerRect.width) / 2 + windowWidth / 2,
      (-1 * containerRect.height) / 2 + windowHeight / 2,
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

    const container = this.panZoomContainer()?.nativeElement as HTMLElement;

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

    if (highlightNode) {
      setTimeout(() => {
        const nodeElement = this.elementRef?.nativeElement.querySelector(
          `#${
            wasCollapsed
              ? this.getNodeChildrenId(nodeId)
              : this.getNodeId(nodeId)
          }`,
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
    const { scale } = this.panZoomInstance?.getTransform() ?? {
      scale: 1,
    };

    const centerX = containerRect.width / 2 + containerRect.x;
    const centerY = containerRect.height / 2 + containerRect.y;

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
    const container = this.panZoomContainer()?.nativeElement as HTMLElement;

    if (!container || !nodeElement || !this.panZoomInstance) {
      return;
    }

    const nodeRect1 = nodeElement.getBoundingClientRect();

    if (!skipZoom) {
      this.panZoomInstance?.smoothZoomAbs(
        nodeRect1.x + nodeRect1.width / 2,
        nodeRect1.y + nodeRect1.height / 2,
        1.5,
      );
    }

    setTimeout(() => {
      const containerRect = container.getBoundingClientRect();
      const nodeRect = nodeElement.getBoundingClientRect();
      const hostingElement = this.elementRef.nativeElement as HTMLElement;
      const windowWidth = hostingElement.getBoundingClientRect().width;
      const windowHeight = hostingElement.getBoundingClientRect().height;

      const transformedNodeX = -1 * (nodeRect.x - containerRect.x);
      const transformedNodeY = -1 * (nodeRect.y - containerRect.y);

      const windowCenterX = windowWidth / 2;
      const windowCenterY = windowHeight / 2;

      this.panZoomInstance?.smoothMoveTo(
        transformedNodeX + windowCenterX - nodeRect.width / 2,
        transformedNodeY + windowCenterY - nodeRect.height / 2,
      );

      if (playAnimation) {
        nodeElement.classList.add('highlighted');
        setTimeout(() => {
          nodeElement.classList.remove('highlighted');
        }, 2300);
      }
    }, 100); // allow some time for the zoom to take effect
  }

  protected getNodeId(nodeId: string): string {
    return `node-${nodeId}`;
  }

  protected getNodeChildrenId(nodeId: string): string {
    return `node-children-${nodeId}`;
  }

  private getFitScale(padding: number): number {
    const hostingElement = this.elementRef?.nativeElement as HTMLElement;
    const contentEl = this.panZoomContainer()?.nativeElement as HTMLElement;

    if (!hostingElement || !contentEl) return 1;

    const containerRect = hostingElement.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Use actual unscaled dimensions of content
    const contentWidth = contentEl.offsetWidth;
    const contentHeight = contentEl.offsetHeight;

    // Optional padding around the content
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;

    // Never upscale beyond 1
    const fitScale = Math.min(scaleX, scaleY, 1);

    return fitScale;
  }

  ngOnDestroy(): void {
    this.panZoomInstance?.dispose();
  }
}
