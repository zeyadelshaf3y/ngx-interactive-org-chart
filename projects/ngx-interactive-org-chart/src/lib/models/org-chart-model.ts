export interface OrgChartNode<T = unknown> {
  readonly id?: string;
  readonly name?: string;
  readonly data?: T;
  readonly children?: OrgChartNode[];
  readonly collapsed?: boolean;
  readonly hidden?: boolean;
  readonly nodeClass?: string;
}

export interface OrgChartConfig {
  readonly connectorsAnimationDelay?: string;
  readonly animationDuration?: string;
  readonly collapseDuration?: string;
  readonly nodePadding?: string;
  readonly nodeContainerSpacing?: string;
  readonly nodeBorderRadius?: string;
  readonly nodeActiveBorderColor?: string;
  readonly connectorColor?: string;
  readonly connectorBorderRadius?: string;
  readonly connectorActiveColor?: string;
  readonly connectorWidth?: string;
  readonly collapseButtonSize?: string;
  readonly collapseButtonBorderRadius?: string;
  readonly nodeMaxWidth?: string;
  readonly nodeMinWidth?: string;
  readonly nodeMaxHeight?: string;
  readonly nodeMinHeight?: string;
}

export interface OrgChartToggleNodeArgs<T> {
  readonly node: OrgChartNode<T>;
  readonly targetNode: string;
  readonly collapse?: boolean;
}
