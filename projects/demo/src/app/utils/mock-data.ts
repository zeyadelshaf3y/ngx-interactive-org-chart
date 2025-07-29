import { OrgChartNode } from 'ngx-interactive-org-chart';
import { OverviewData, OverviewDataTypeEnum } from '../shared';

export const OVERVIEW_MOCK_DATA: OverviewData = {
  id: 1,
  name: 'Alice Johnson',
  title: 'Chief Executive Officer',
  type: OverviewDataTypeEnum.Employee,
  thumbnail: 'https://randomuser.me/api/portraits/women/21.jpg',
  children: [
    {
      id: 2,
      name: 'Engineering Department',
      type: OverviewDataTypeEnum.Department,
      children: [
        {
          id: 3,
          name: 'Bob Smith',
          title: 'CTO',
          type: OverviewDataTypeEnum.Employee,
          thumbnail: 'https://randomuser.me/api/portraits/men/50.jpg',
          children: [
            {
              id: 4,
              name: 'Carol White',
              title: 'Frontend Lead',
              type: OverviewDataTypeEnum.Employee,
              thumbnail: 'https://randomuser.me/api/portraits/women/3.jpg',
              children: [
                {
                  id: 9,
                  name: 'Emily Brown',
                  title: 'Senior Frontend Engineer',
                  type: OverviewDataTypeEnum.Employee,
                  thumbnail: 'https://randomuser.me/api/portraits/women/22.jpg',
                },
                {
                  id: 10,
                  name: 'Jake Hall',
                  title: 'Junior Frontend Developer',
                  type: OverviewDataTypeEnum.Contractor,
                  thumbnail: 'https://randomuser.me/api/portraits/men/23.jpg',
                },
              ],
            },
            {
              id: 5,
              name: 'David Kim',
              title: 'Backend Lead',
              type: OverviewDataTypeEnum.Contractor,
              thumbnail: 'https://randomuser.me/api/portraits/men/4.jpg',
              children: [
                {
                  id: 11,
                  name: 'Megan Lee',
                  title: 'DevOps Engineer',
                  type: OverviewDataTypeEnum.Employee,
                  thumbnail: 'https://randomuser.me/api/portraits/women/33.jpg',
                },
                {
                  id: 8,
                  name: 'Chris Johnson',
                  title: 'Database Administrator',
                  type: OverviewDataTypeEnum.Contractor,
                  thumbnail: 'https://randomuser.me/api/portraits/men/80.jpg',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 6,
      name: 'Finance Department',
      type: OverviewDataTypeEnum.Department,
      children: [
        {
          id: 7,
          name: 'Eva Green',
          title: 'CFO',
          type: OverviewDataTypeEnum.Employee,
          thumbnail: 'https://randomuser.me/api/portraits/women/5.jpg',
          children: [
            // i need two children and each should have two children
            {
              id: 12,
              name: 'Grace White',
              title: 'Financial Analyst',
              type: OverviewDataTypeEnum.Contractor,
              thumbnail: 'https://randomuser.me/api/portraits/women/34.jpg',
              children: [
                {
                  id: 14,
                  name: 'Liam Brown',
                  title: 'Junior Financial Analyst',
                  type: OverviewDataTypeEnum.Employee,
                  thumbnail: 'https://randomuser.me/api/portraits/men/36.jpg',
                },
                {
                  id: 15,
                  name: 'Olivia Green',
                  title: 'Intern',
                  type: OverviewDataTypeEnum.Contractor,
                  thumbnail: 'https://randomuser.me/api/portraits/women/36.jpg',
                },
              ],
            },
            {
              id: 13,
              name: 'Henry Black',
              title: 'Payroll Specialist',
              type: OverviewDataTypeEnum.Employee,
              thumbnail: 'https://randomuser.me/api/portraits/men/35.jpg',
              children: [
                {
                  id: 16,
                  name: 'Sophia Blue',
                  title: 'Payroll Assistant',
                  type: OverviewDataTypeEnum.Contractor,
                  thumbnail: 'https://randomuser.me/api/portraits/women/37.jpg',
                },
                {
                  id: 17,
                  name: 'James White',
                  title: 'Payroll Intern',
                  type: OverviewDataTypeEnum.Employee,
                  thumbnail: 'https://randomuser.me/api/portraits/men/38.jpg',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const basicOrgChartData: OrgChartNode = {};

export const advancedOrgChartData: OrgChartNode = {};
