# ngx-interactive-org-chart

> Modern Angular organizational chart component with interactive pan/zoom functionality

[![npm version](https://img.shields.io/npm/v/ngx-interactive-org-chart)](https://www.npmjs.com/package/ngx-interactive-org-chart)
[![license](https://img.shields.io/npm/l/ngx-interactive-org-chart)](https://opensource.org/licenses/MIT)
[![downloads](https://img.shields.io/npm/dm/ngx-interactive-org-chart)](https://www.npmjs.com/package/ngx-interactive-org-chart)

A beautiful, interactive organizational chart component for Angular applications. Built with modern Angular features and designed for ease of use and customization.

## 🚀 Quick Start

**[View Interactive Demo →](https://zeyadelshaf3y.github.io/ngx-interactive-org-chart)**

## 📦 Installation

```bash
npm install ngx-interactive-org-chart
```

For detailed documentation, installation guide, and API reference, see the **[Library Documentation](./projects/ngx-interactive-org-chart/README.md)**.

## 🎯 Repository Structure

```text
├── projects/
│   ├── ngx-interactive-org-chart/    # 📚 Main library
│   └── demo/                         # 🎪 Demo application
├── dist/                             # 📦 Build outputs
└── docs/                             # 📖 GitHub Pages demo
```

## ✨ Features

- 🎯 **Interactive Pan & Zoom** - Smooth navigation with mouse/touch
- 🌳 **Hierarchical Layout** - Perfect for organizational structures
- 🎨 **Customizable Styling** - Fully themeable with CSS/SCSS
- 📱 **Mobile Friendly** - Touch gestures support
- ⚡ **High Performance** - Optimized rendering
- 🔍 **Searchable Nodes** - Easily find nodes in large charts
- 🧭 **Focus & Highlight** - Quickly navigate to specific nodes
- 📊 **Custom Node Templates** - Use Angular templates for nodes
- 📈 **Dynamic Data Binding** - Reactive updates with Angular signals
- 📦 **Tree Shakable** - Import only what you need
- 🔄 **Collapsible Nodes** - Expand/collapse functionality
- 🌐 **RTL Support** - Right-to-left text direction
- 🧩 **Modular Design** - Standalone component for easy integration
- 🔧 **TypeScript Support** - Full type definitions included
- 🛠️ **Easy Setup** - Minimal configuration required
- 🎪 **Angular 19+** - Built with latest Angular features
- 🆓 **100% Free** - Open source MIT license

## 🚀 Usage

### Basic Example

```typescript
import { Component } from '@angular/core';
import {
  NgxInteractiveOrgChart,
  OrgChartNode,
} from 'ngx-interactive-org-chart';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [NgxInteractiveOrgChart],
  template: `
    <ngx-interactive-org-chart [data]="orgData" [themeOptions]="themeOptions" />
  `,
})
export class DemoComponent {
  orgData: OrgChartNode<{ title: string; department: string }> = {
    id: 'ceo',
    name: 'John Smith',
    data: {
      title: 'Chief Executive Officer',
      department: 'Executive',
    },
    children: [
      {
        id: 'cto',
        name: 'Jane Doe',
        data: {
          title: 'Chief Technology Officer',
          department: 'Engineering',
        },
        children: [
          {
            id: 'dev1',
            name: 'Mike Johnson',
            data: {
              title: 'Senior Developer',
              department: 'Engineering',
            },
          },
        ],
      },
      {
        id: 'cfo',
        name: 'Sarah Wilson',
        data: {
          title: 'Chief Financial Officer',
          department: 'Finance',
        },
      },
    ],
  };

  themeOptions: NgxInteractiveOrgChartTheme = {
    node: {
      background: '#ffffff',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    },
    connector: {
      color: '#d1d5db',
      activeColor: '#3b82f6',
    },
  };
}
```

### Custom Node Templates

You can customize how nodes are displayed by providing your own template. Use the `#nodeTemplate` template reference to override the default node appearance:

```typescript
enum TypeEnum {
  Employee = 'employee',
  Contractor = 'contractor',
  Department = 'department',
}

interface ApiResponse {
  readonly id: number;
  readonly name: string;
  readonly title?: string;
  readonly thumbnail?: string;
  readonly type: TypeEnum;
  readonly children?: ApiResponse[];
}

@Component({
  selector: 'app-custom-org-chart',
  standalone: true,
  imports: [NgxInteractiveOrgChart],
  template: `
    <ngx-interactive-org-chart
      [data]="orgChartData() ?? {}"
      [themeOptions]="themeOptions"
      [displayChildrenCount]="false"
    >
      <ng-template #nodeTemplate let-node="node">
        @let nodeData = node?.data;

        @switch (true) {
          @case (
            nodeData.type === dataTypeEnum.Employee ||
            nodeData.type === dataTypeEnum.Contractor
          ) {
            @let isContractor = nodeData.type === dataTypeEnum.Contractor;

            <section class="demo__employee">
              <section class="demo__employee-thumbnail">
                <img [src]="nodeData?.thumbnail" />
              </section>
              <section class="demo__employee-details">
                <span class="demo__employee-details-name">{{
                  nodeData?.name
                }}</span>
                <span class="demo__employee-details-position">{{
                  nodeData?.title
                }}</span>
                @if (isContractor) {
                  <small class="demo__employee-details-type">Contractor</small>
                }
              </section>
            </section>
          }

          @case (nodeData.type === dataTypeEnum.Department) {
            <section class="demo__department">
              <section class="demo__department-details">
                <span class="demo__department-details-name">{{
                  nodeData?.name
                }}</span>
                <span class="demo__department-details-description">
                  {{ node?.descendantsCount }} Members
                </span>
              </section>
            </section>
          }
        }
      </ng-template>
    </ngx-interactive-org-chart>
  `,
  styles: [
    `
      .demo {
        &__employee {
          display: flex;
          gap: 1rem;
          align-items: center;

          &-thumbnail {
            img {
              border-radius: 50%;
              width: 3rem;
              height: 3rem;
              object-fit: cover;
              box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.3);
            }
          }

          &-details {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            align-items: flex-start;

            &-name {
              color: var(--text-primary);
              font-weight: 600;
              font-size: 0.875rem;
            }

            &-position {
              font-size: 0.75rem;
              color: #6c757d;
            }

            &-type {
              font-size: 0.5rem;
              background-color: rgb(203, 225, 232);
              padding: 0.125rem 0.25rem;
              border-radius: 0.25rem;
            }
          }
        }

        &__department {
          display: flex;
          gap: 1rem;
          align-items: center;

          &-details {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            align-items: flex-start;

            &-name {
              font-weight: 600;
              font-size: 0.875rem;
            }

            &-description {
              font-size: 0.75rem;
            }
          }

          &-name {
            font-weight: 600;
            font-size: 0.875rem;
          }
        }
      }
    `,
  ],
})
export class CustomOrgChartComponent {
  data: ApiResponse = {
    id: 1,
    name: 'Company',
    type: TypeEnum.Department,
    children: [
      {
        id: 2,
        name: 'Engineering',
        type: TypeEnum.Department,
        children: [
          {
            id: 3,
            name: 'Alice Johnson',
            title: 'Software Engineer',
            thumbnail: 'https://randomuser.me/api/portraits/women/21.jpg',
            type: TypeEnum.Employee,
          },
          {
            id: 4,
            name: 'Bob Smith',
            title: 'Senior Developer',
            thumbnail: 'https://randomuser.me/api/portraits/men/21.jpg',
            type: TypeEnum.Contractor,
          },
        ],
      },
      {
        id: 5,
        name: 'Marketing',
        type: TypeEnum.Department,
        children: [
          {
            id: 6,
            name: 'Carol White',
            title: 'Marketing Manager',
            thumbnail: 'https://randomuser.me/api/portraits/women/21.jpg',
            type: TypeEnum.Employee,
          },
        ],
      },
    ],
  };

  protected readonly orgChartData = signal<OrgChartNode<ApiResponse> | null>(
    null
  );

  readonly #setOrgChartData = effect(() => {
    this.orgChartData.set(this.mapDataToOrgChartNode(this.data));
  });

  protected readonly dataTypeEnum = TypeEnum;

  protected readonly themeOptions: NgxInteractiveOrgChartTheme = {
    node: {
      background: 'white',
      color: 'black',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      outlineColor: '#e0e0e0',
      activeOutlineColor: '#1976d2',
    },
  };

  private mapDataToOrgChartNode({
    children,
    ...data
  }: ApiResponse): OrgChartNode<ApiResponse> {
    return {
      id: data.id.toString(),
      name: data.name, // for search purposes
      collapsed: data.type === TypeEnum.Department, // collapse departments by default
      style: {
        // Apply any conditional styles here: For example, different background colors based on type
        background: data.type === TypeEnum.Department ? '#e3f2fd' : '#f1f1f1',
        color: data.type === TypeEnum.Department ? '#1976d2' : '#333',
        // or you can just use predefined css variables (preferable)
        '--node-background':
          data.type === TypeEnum.Department ? '#e3f2fd' : '#f1f1f1',
        '--node-color': data.type === TypeEnum.Department ? '#1976d2' : '#333',
      },
      // you can also set a custom class for each node, but make sure you apply this class in ng-deep
      nodeClass:
        data.type === TypeEnum.Department ? 'department-node' : 'employee-node',
      data: {
        ...data,
      },
      children: children?.map(child => this.mapDataToOrgChartNode(child)) || [],
    };
  }
}
```

## 📋 Requirements

- Angular 19+
- TypeScript 5.4+

## 🏗️ Development

```bash
# Clone the repository
git clone https://github.com/zeyadelshaf3y/ngx-interactive-org-chart.git

# Install dependencies
npm install

# Start development server
npm start

# Build the library
npm run build:lib

# Run tests
npm test
```

## 📄 License

MIT © [Zeyad Alshafey](https://github.com/zeyadelshaf3y)

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/ngx-interactive-org-chart)
- [Live Demo](https://zeyadelshaf3y.github.io/ngx-interactive-org-chart)
- [Documentation](./projects/ngx-interactive-org-chart/README.md)
- [Issues](https://github.com/zeyadelshaf3y/ngx-interactive-org-chart/issues)
