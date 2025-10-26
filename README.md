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
- 📱 **Mobile Friendly** - Touch gestures support for pan, zoom, and drag & drop
- ⚡ **High Performance** - Optimized rendering
- 🔍 **Searchable Nodes** - Easily find nodes in large charts
- 🧭 **Smart Highlight & Focus** - Dynamically zoom to nodes with optimal sizing
- 📊 **Custom Node Templates** - Use Angular templates for nodes
- 🖱️ **Drag & Drop** - Reorganize nodes with drag and drop (works on touch screens!)
- 🎯 **Custom Drag Handles** - Use custom templates for drag handles
- 📈 **Dynamic Data Binding** - Reactive updates with Angular signals
- 📦 **Tree Shakable** - Import only what you need
- 🔄 **Collapsible Nodes** - Expand/collapse functionality
- 🌐 **RTL Support** - Right-to-left text direction
- 🧩 **Modular Design** - Standalone component for easy integration
- 🔧 **TypeScript Support** - Full type definitions included
- 🛠️ **Easy Setup** - Minimal configuration required
- 🎪 **Angular 20+** - Built with latest Angular features
- 🆓 **100% Free** - Open source MIT license

## � Version Compatibility

| ngx-interactive-org-chart | Angular Version | Notes           |
| ------------------------- | --------------- | --------------- |
| 1.1.4                     | Angular 19      | Stable release  |
| 1.1.5+                    | Angular 20+     | Latest features |

## �🚀 Usage

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
    <ngx-interactive-org-chart
      [data]="orgData"
      [themeOptions]="themeOptions"
      [highlightZoomNodeWidthRatio]="0.3"
      [highlightZoomNodeHeightRatio]="0.4"
    />
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

### 🎯 Smart Zoom & Highlighting

The component features intelligent zoom calculation that automatically adjusts to provide optimal viewing of highlighted nodes:

```typescript
// Configure dynamic zoom behavior
<ngx-interactive-org-chart
  [data]="orgData"
  [highlightZoomNodeWidthRatio]="0.4"     // Node takes 40% of container width
  [highlightZoomNodeHeightRatio]="0.5"    // Node takes 50% of container height
  [highlightZoomMinimum]="1.0"            // Never zoom below 100%
/>

// Programmatically highlight nodes
@ViewChild(NgxInteractiveOrgChart) orgChart!: NgxInteractiveOrgChart;

highlightManager() {
  this.orgChart.highlightNode('cto'); // Automatically zooms to optimal level
}
```

### 📐 Layout Options

The component supports both vertical and horizontal layout orientations:

```typescript
// Vertical layout (default)
<ngx-interactive-org-chart
  [data]="orgData"
  layout="vertical"
/>

// Horizontal layout
<ngx-interactive-org-chart
  [data]="orgData"
  layout="horizontal"
/>
```

### 🖱️ Pan Functionality

The component includes built-in pan functionality that allows users to navigate large organizational charts:

```typescript
// Pan functionality is enabled by default
// Users can click and drag to pan around the chart
// Touch gestures are supported on mobile devices

@ViewChild(NgxInteractiveOrgChart) orgChart!: NgxInteractiveOrgChart;

// Programmatically control panning
panToSpecificLocation() {
  // Pan to specific coordinates (x, y, smooth)
  this.orgChart.pan(100, 200, true); // Pans to x: 100, y: 200 with smooth animation
}

// Reset pan to center horizontally and vertically
resetPanning() {
  this.orgChart.resetPan(); // Centers the chart
}

// Reset both pan and zoom to fit the chart within the containing box
resetView() {
  this.orgChart.resetPanAndZoom(); // Centers and fits the chart
}
```

**Pan Features:**

- **Mouse Support:** Click and drag to pan around the chart
- **Touch Support:** Touch and drag gestures on mobile devices
- **Smooth Animation:** Animated transitions when panning programmatically
- **Momentum:** Natural momentum-based panning for smooth user experience

## 📋 Component Properties

| Property                       | Type                           | Default      | Description                                                        |
| ------------------------------ | ------------------------------ | ------------ | ------------------------------------------------------------------ |
| `data`                         | `OrgChartNode`                 | required     | The organizational data to display                                 |
| `collapsible`                  | `boolean`                      | `true`       | Enable/disable node collapsing                                     |
| `layout`                       | `'vertical' \| 'horizontal'`   | `'vertical'` | Chart layout orientation                                           |
| `themeOptions`                 | `NgxInteractiveOrgChartTheme`  | `{}`         | Theme configuration options for styling                            |
| `nodeClass`                    | `string`                       | `undefined`  | Custom CSS class applied to all nodes                              |
| `initialZoom`                  | `number`                       | `undefined`  | Initial zoom level                                                 |
| `minZoom`                      | `number`                       | `0.1`        | Minimum zoom level                                                 |
| `maxZoom`                      | `number`                       | `5`          | Maximum zoom level                                                 |
| `zoomSpeed`                    | `number`                       | `1`          | Zoom speed multiplier                                              |
| `zoomDoubleClickSpeed`         | `number`                       | `2`          | Double-click zoom speed multiplier                                 |
| `initialCollapsed`             | `boolean`                      | `false`      | Initial collapsed state for all nodes                              |
| `isRtl`                        | `boolean`                      | `false`      | Right-to-left text direction support                               |
| `displayChildrenCount`         | `boolean`                      | `true`       | Show children count on collapse buttons                            |
| `highlightZoomNodeWidthRatio`  | `number`                       | `0.3`        | Node width ratio relative to viewport when highlighting (0.1-1.0)  |
| `highlightZoomNodeHeightRatio` | `number`                       | `0.4`        | Node height ratio relative to viewport when highlighting (0.1-1.0) |
| `highlightZoomMinimum`         | `number`                       | `0.8`        | Minimum zoom level when highlighting a node                        |
| `draggable`                    | `boolean`                      | `false`      | Enable drag and drop functionality for nodes                       |
| `canDragNode`                  | `(node) => boolean`            | `undefined`  | Predicate function to determine if a node can be dragged           |
| `canDropNode`                  | `(dragged, target) => boolean` | `undefined`  | Predicate function to validate drop operations                     |
| `dragEdgeThreshold`            | `number`                       | `0.1`        | Auto-pan threshold is calculated as 10% of container dimensions    |
| `dragAutoPanSpeed`             | `number`                       | `15`         | Speed of auto-panning in pixels per frame during drag              |

## 🖱️ Drag & Drop

Enable drag and drop to allow users to reorganize the chart:

```typescript
import { moveNode } from 'ngx-interactive-org-chart';

@Component({
  template: `
    <ngx-interactive-org-chart
      [data]="orgData()"
      [draggable]="true"
      [canDragNode]="canDragNode"
      [canDropNode]="canDropNode"
      (nodeDrop)="onNodeDrop($event)"
    >
      <!-- Optional: Custom drag handle -->
      <ng-template #dragHandleTemplate let-node="node">
        <button class="drag-handle">⋮⋮</button>
      </ng-template>
    </ngx-interactive-org-chart>
  `,
})
export class MyComponent {
  orgData = signal<OrgChartNode>(/* your data */);

  // Optional: Control which nodes can be dragged
  canDragNode = (node: OrgChartNode) => node.id !== 'root';

  // Optional: Control where nodes can be dropped
  canDropNode = (dragged: OrgChartNode, target: OrgChartNode) => {
    return target.data?.type === 'Department';
  };

  onNodeDrop(event: { draggedNode: OrgChartNode; targetNode: OrgChartNode }) {
    // Use built-in helper to move nodes
    const updated = moveNode(
      this.orgData(),
      event.draggedNode.id,
      event.targetNode.id
    );

    if (updated) {
      this.orgData.set(updated);
    }
  }
}
```

**Features:**

- **Responsive auto-panning** - Threshold automatically calculated as 10% of container (perfect for all screen sizes)
- Drag constraints with `canDragNode` and `canDropNode` predicates
- ESC key to cancel drag operation
- Visual feedback for valid/invalid drop targets
- Custom drag handle templates
- Helper functions for tree manipulation (`moveNode`, `findNode`, `removeNode`, etc.)
- Full control over data updates
- **Touch screen support** - Works seamlessly on mobile devices and tablets

For complete documentation, see the **[Library Documentation](./projects/ngx-interactive-org-chart/README.md)**.

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

- Angular 20+
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
