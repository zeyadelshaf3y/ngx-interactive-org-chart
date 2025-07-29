import { Component, computed, effect, signal, viewChild } from '@angular/core';
import {
  NgxInteractiveOrgChart,
  NgxInteractiveOrgChartTheme,
  OrgChartNode,
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

  protected readonly toolbarButtons = computed<ToolbarButton[]>(() => [
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
      icon: 'refresh',
      onClick: () => this.reset(),
    },
  ]);

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
