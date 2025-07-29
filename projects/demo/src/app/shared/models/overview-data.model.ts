export enum OverviewDataTypeEnum {
  Employee = 'employee',
  Contractor = 'contractor',
  Department = 'department',
}

export interface OverviewData {
  readonly id: number;
  readonly name: string;
  readonly title?: string;
  readonly thumbnail?: string;
  readonly type: OverviewDataTypeEnum;
  readonly children?: OverviewData[];
}
