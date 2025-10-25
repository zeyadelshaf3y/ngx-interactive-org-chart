export interface OrgChartNode<T = unknown> {
  readonly id?: string;
  readonly name?: string;
  readonly data?: T;
  readonly children?: OrgChartNode[];
  readonly collapsed?: boolean;
  readonly hidden?: boolean;
  readonly nodeClass?: string;
  readonly style?: { [key: string]: string };
  readonly descendantsCount?: number;
}

interface OrgChartConfigTheme {
  readonly node: {
    readonly background: string;
    readonly color: string;
    readonly shadow: string;
    readonly outlineColor: string;
    readonly outlineWidth?: string;
    readonly activeOutlineColor: string;
    readonly highlightShadowColor: string;
    readonly padding: string;
    readonly borderRadius: string;
    readonly activeColor: string;
    readonly containerSpacing?: string;
    readonly maxWidth: string;
    readonly minWidth: string;
    readonly maxHeight: string;
    readonly minHeight: string;
    readonly dragOverOutlineColor: string;
  };
  readonly connector: {
    readonly color: string;
    readonly activeColor: string;
    readonly borderRadius: string;
    readonly width: string;
  };
  readonly collapseButton: {
    readonly size: string;
    readonly borderColor: string;
    readonly borderRadius: string;
    readonly color: string;
    readonly background: string;
    readonly hoverColor: string;
    readonly hoverBackground: string;
    readonly hoverShadow: string;
    readonly hoverTransformScale: string;
    readonly focusOutline: string;
    readonly countFontSize: string;
  };
  readonly container: {
    readonly background: string;
    readonly border: string;
  };
}

export type NgxInteractiveOrgChartTheme = DeepPartial<OrgChartConfigTheme>;

export type NgxInteractiveOrgChartLayout = 'vertical' | 'horizontal';

export interface OrgChartToggleNodeArgs<T> {
  readonly node: OrgChartNode<T>;
  readonly targetNode: string;
  readonly collapse?: boolean;
}

export interface OrgChartDropNodeEventArgs<T> {
  readonly draggedNode: OrgChartNode<T>;
  readonly targetNode: OrgChartNode<T>;
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
