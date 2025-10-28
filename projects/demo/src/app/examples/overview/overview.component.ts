import {
  Component,
  computed,
  effect,
  signal,
  viewChild,
  ElementRef,
  afterNextRender,
} from '@angular/core';
import {
  NgxInteractiveOrgChart,
  NgxInteractiveOrgChartLayout,
  NgxInteractiveOrgChartTheme,
  OrgChartDropNodeEventArgs,
  OrgChartNode,
  moveNode,
} from 'ngx-interactive-org-chart';
import {
  OverviewData,
  OverviewDataTypeEnum,
  IconComponent,
  ButtonComponent,
  IconType,
} from '../../shared';
import { OVERVIEW_MOCK_DATA } from '../../utils';

interface ToolbarButton {
  readonly label?: string;
  readonly title?: string;
  readonly icon?: IconType;
  readonly isText?: boolean;
  readonly onClick?: () => void;
}

@Component({
  standalone: true,
  selector: 'app-overview',
  imports: [NgxInteractiveOrgChart, IconComponent, ButtonComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  readonly orgChart = viewChild(NgxInteractiveOrgChart<OverviewData>);
  readonly toolbar = viewChild<ElementRef<HTMLElement>>('toolbar');

  protected readonly data = signal<OrgChartNode<OverviewData> | null>(null);

  protected readonly showLeftShadow = signal<boolean>(false);
  protected readonly showRightShadow = signal<boolean>(false);

  private readonly setData = effect(() => {
    this.data.set(this.mapDataToOrgChartNode(OVERVIEW_MOCK_DATA));
  });

  constructor() {
    afterNextRender(() => {
      this.checkScrollState();
      this.observeToolbarResize();
    });
  }

  protected readonly overviewDataTypeEnum = OverviewDataTypeEnum;

  protected readonly themeOptions: NgxInteractiveOrgChartTheme = {
    node: {
      background: 'var(--bg-primary)',
      outlineColor: 'transparent',
      activeOutlineColor: 'transparent',
      shadow: '0 0 0.125rem var(--node-shadow-color)',
      dragOverOutlineColor: 'var(--text-primary)',
    },
    collapseButton: {
      color: 'var(--text-secondary)',
      background: 'var(--bg-primary)',
      borderColor: 'var(--border-3)',
      hoverColor: 'var(--text-primary)',
      hoverBackground: 'var(--bg-secondary)',
      focusOutline: '0.0625rem solid var(--text-primary)',
    },
    connector: {
      activeColor: 'var(--text-primary)',
      color: 'var(--border-3)',
    },
    miniMap: {
      background: 'var(--bg-primary)',
      borderColor: 'var(--border-2)',
      nodeColor: 'var(--surface-muted)',
    },
  };

  protected readonly orgChartLayout =
    signal<NgxInteractiveOrgChartLayout>('vertical');

  protected readonly draggableEnabled = signal<boolean>(false);

  protected readonly miniMapEnabled = signal<boolean>(true);

  protected readonly toolbarButtons = computed<ToolbarButton[]>(() => {
    const isVerticalLayout = this.orgChartLayout() === 'vertical';

    return [
      {
        title: 'Zoom Out',
        icon: 'zoom-out',
        onClick: () => this.orgChart()?.zoomOut(),
      },
      {
        title: 'Zoom Level',
        isText: true,
        label: `${this.orgChart()?.getScale() ?? 0}%`,
      },
      {
        title: 'Zoom In',
        icon: 'zoom-in',
        onClick: () => this.orgChart()?.zoomIn(),
      },

      {
        title: 'Collapse All Nodes',
        icon: 'collapse',
        onClick: () => {
          this.orgChart()?.toggleCollapseAll(true);
          setTimeout(() => this.reset(), 300);
        },
      },
      {
        title: 'Expand All Nodes',
        icon: 'expand',
        onClick: () => {
          this.orgChart()?.toggleCollapseAll(false);
          setTimeout(() => this.reset(), 300);
        },
      },
      {
        title: 'Reset Zoom and Pan',
        icon: 'center-h-v',
        onClick: () => this.reset(),
      },
      {
        label: this.draggableEnabled()
          ? 'Disable Drag & Drop'
          : 'Enable Drag & Drop',
        icon: 'drag-drop',
        onClick: () => this.draggableEnabled.update(v => !v),
      },
      {
        label: this.miniMapEnabled() ? 'Hide Mini Map' : 'Show Mini Map',
        icon: this.miniMapEnabled() ? 'eye-slash' : 'eye',
        onClick: () => this.miniMapEnabled.update(v => !v),
      },
      {
        label: isVerticalLayout ? 'Switch to Horizontal' : 'Switch to Vertical',
        icon: isVerticalLayout ? 'logo-horizontal' : 'logo',
        onClick: () => {
          this.orgChartLayout.set(isVerticalLayout ? 'horizontal' : 'vertical');
        },
      },
      {
        title: 'Highlight Engineering Department',
        label: 'Highlight Engineering Department',
        icon: 'target',
        onClick: () => this.orgChart()?.highlightNode(2),
      },
    ];
  });

  /**
   * Handles the node drop event from the org chart.
   *
   * IMPORTANT: The library does NOT modify your data automatically.
   * You must handle the data restructuring yourself. This gives you:
   * - Full control over validation
   * - Ability to sync with backend
   * - Custom business logic
   * - Undo/redo capabilities
   *
   * Pattern:
   * 1. Receive drag/drop event with source and target nodes
   * 2. Use the provided `moveNode` helper or implement your own logic
   * 3. Update the data signal/input
   * 4. Library automatically re-renders
   */
  protected onNodeDrop(event: OrgChartDropNodeEventArgs<OverviewData>): void {
    const currentData = this.data();
    if (!currentData) return;

    const updatedData = moveNode(
      currentData,
      event.draggedNode.id as string,
      event.targetNode.id as string
    );

    this.data.set(updatedData);
  }

  protected onToolbarScroll(event: Event): void {
    const element = event.target as HTMLElement;

    this.updateScrollShadows(element);
  }

  private checkScrollState(): void {
    const toolbarElement = this.toolbar()?.nativeElement;

    if (toolbarElement) {
      this.updateScrollShadows(toolbarElement);
    }
  }

  private observeToolbarResize(): void {
    const toolbarElement = this.toolbar()?.nativeElement;
    if (!toolbarElement) return;

    const resizeObserver = new ResizeObserver(() => {
      this.updateScrollShadows(toolbarElement);
    });

    resizeObserver.observe(toolbarElement);
  }

  private updateScrollShadows(element: HTMLElement): void {
    const scrollLeft = element.scrollLeft;
    const maxScrollLeft = element.scrollWidth - element.clientWidth;

    this.showLeftShadow.set(scrollLeft > 1);

    this.showRightShadow.set(scrollLeft < maxScrollLeft - 1);
  }

  private reset(): void {
    this.orgChart()?.resetPanAndZoom();
  }

  private mapDataToOrgChartNode({
    children,
    ...data
  }: OverviewData): OrgChartNode<OverviewData> {
    return {
      id: data.id.toString(),
      name: data.name,
      data: {
        ...data,
      },
      children: children?.map(child => this.mapDataToOrgChartNode(child)) || [],
    };
  }
}
