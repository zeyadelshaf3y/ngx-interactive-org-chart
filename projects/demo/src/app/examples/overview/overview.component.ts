import { Component, computed, effect, signal, viewChild } from '@angular/core';
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

  protected readonly data = signal<OrgChartNode<OverviewData> | null>(null);

  private readonly setData = effect(() => {
    this.data.set(this.mapDataToOrgChartNode(OVERVIEW_MOCK_DATA));
  });

  protected readonly overviewDataTypeEnum = OverviewDataTypeEnum;

  protected readonly themeOptions: NgxInteractiveOrgChartTheme = {
    node: {
      background: 'var(--bg-primary)',
      outlineColor: 'transparent',
      activeOutlineColor: 'transparent',
      shadow: '0 0 0.125rem rgba(0, 0, 0, 0.2)',
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
  };

  protected readonly orgChartLayout =
    signal<NgxInteractiveOrgChartLayout>('vertical');

  protected readonly draggableEnabled = signal<boolean>(false);

  protected readonly toolbarButtons = computed<ToolbarButton[]>(() => {
    const isVerticalLayout = this.orgChartLayout() === 'vertical';

    return [
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
