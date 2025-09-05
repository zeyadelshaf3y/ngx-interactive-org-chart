# ngx-interactive-org-chart

> Modern Angular organizational chart component with interactive pan/zoom functionality

[![npm version](https://img.shields.io/npm/v/ngx-interactive-org-chart)](https://www.npmjs.com/package/ngx-interactive-org-chart)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/ngx-interactive-org-chart.svg)](https://www.npmjs.com/package/ngx-interactive-org-chart)

A beautiful, interactive organizational chart component for Angular applications. Built with modern Angular features and designed for ease of use and customization.

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
- 🎪 **Angular 20+** - Built with latest Angular features
- 🆓 **100% Free** - Open source MIT license

## � Version Compatibility

| ngx-interactive-org-chart | Angular Version | Notes           |
| ------------------------- | --------------- | --------------- |
| 1.1.4                     | Angular 19      | Stable release  |
| 1.1.5+                    | Angular 20+     | Latest features |

## �🚀 Installation

```bash
npm install ngx-interactive-org-chart
```

### Setup Angular Animations

The component uses Angular animations for smooth transitions. Add the animations module to your `main.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(), // Required for ngx-interactive-org-chart
    // ... your other providers
  ],
});
```

Or if you're using NgModules:

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Required for ngx-interactive-org-chart
    // ... your other modules
  ],
  // ...
})
export class AppModule {}
```

## 📖 Usage

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
  orgData: OrgChartNode = {
    id: 'ceo', // auto generated if not provided
    name: 'John Smith',
    data: {
      // add any additional data properties here to customize the node and use it for displaying different types of nodes
    },
    children: [
      {
        id: 'cto',
        name: 'Jane Doe',
        children: [
          {
            id: 'dev1',
            name: 'Mike Johnson',
          },
        ],
      },
      {
        id: 'cfo',
        name: 'Sarah Wilson',
      },
    ],
  };
}
```

### Data Structure

The component expects hierarchical data in the following format:

```typescript
interface OrgChartNode<T = any> {
  id?: string;
  name?: string;
  data?: T;
  children?: OrgChartNode<T>[];
  collapsed?: boolean;
  hidden?: boolean;
  nodeClass?: string;
}
```

### Component Options

```typescript
interface NgxInteractiveOrgChartTheme {
  node?: {
    background?: string;
    color?: string;
    shadow?: string;
    outlineColor?: string;
    outlineWidth?: string;
    activeOutlineColor?: string;
    highlightShadowColor?: string;
    padding?: string;
    borderRadius?: string;
    activeColor?: string;
    containerSpacing?: string;
    maxWidth?: string;
    minWidth?: string;
    maxHeight?: string;
    minHeight?: string;
  };
  connector?: {
    color?: string;
    activeColor?: string;
    borderRadius?: string;
    width?: string;
  };
  collapseButton?: {
    size?: string;
    borderColor?: string;
    borderRadius?: string;
    color?: string;
    background?: string;
    hoverColor?: string;
    hoverBackground?: string;
    hoverShadow?: string;
    hoverTransformScale?: string;
    focusOutline?: string;
    countFontSize?: string;
  };
  container?: {
    background?: string;
    border?: string;
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

## 📐 Layout Options

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

## 🖱️ Pan Functionality

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

// Reset pan to center
resetPanning() {
  this.orgChart.resetPan(); // Centers the chart
}

// Reset both pan and zoom
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

| Property                       | Type                          | Default      | Description                                                        |
| ------------------------------ | ----------------------------- | ------------ | ------------------------------------------------------------------ |
| `data`                         | `OrgChartNode`                | required     | The organizational data to display                                 |
| `collapsible`                  | `boolean`                     | `true`       | Enable/disable node collapsing                                     |
| `layout`                       | `'vertical' \| 'horizontal'`  | `'vertical'` | Chart layout orientation                                           |
| `themeOptions`                 | `NgxInteractiveOrgChartTheme` | `{}`         | Theme configuration options for styling                            |
| `nodeClass`                    | `string`                      | `undefined`  | Custom CSS class applied to all nodes                              |
| `initialZoom`                  | `number`                      | `undefined`  | Initial zoom level                                                 |
| `minZoom`                      | `number`                      | `0.1`        | Minimum zoom level                                                 |
| `maxZoom`                      | `number`                      | `5`          | Maximum zoom level                                                 |
| `zoomSpeed`                    | `number`                      | `1`          | Zoom speed multiplier                                              |
| `zoomDoubleClickSpeed`         | `number`                      | `2`          | Double-click zoom speed multiplier                                 |
| `initialCollapsed`             | `boolean`                     | `false`      | Initial collapsed state for all nodes                              |
| `isRtl`                        | `boolean`                     | `false`      | Right-to-left text direction support                               |
| `displayChildrenCount`         | `boolean`                     | `true`       | Show children count on collapse buttons                            |
| `highlightZoomNodeWidthRatio`  | `number`                      | `0.3`        | Node width ratio relative to viewport when highlighting (0.1-1.0)  |
| `highlightZoomNodeHeightRatio` | `number`                      | `0.4`        | Node height ratio relative to viewport when highlighting (0.1-1.0) |
| `highlightZoomMinimum`         | `number`                      | `0.8`        | Minimum zoom level when highlighting a node                        |

### Component Methods

The component exposes several useful methods that can be called using a template reference:

```typescript
@Component({
  template: `
    <ngx-interactive-org-chart #orgChart [data]="orgData" />
    <button (click)="orgChart.zoomIn({ by: 10, relative: true })">Zoom In</button>
    <button (click)="orgChart.zoomOut({ by: 10, relative: true })">Zoom Out</button>
    <!-- Reset zoom and pan takes padding param for outer container -->
    <button (click)="orgChart.resetPanAndZoom(50)">Reset</button>
    <button (click)="orgChart.resetPan()">Reset Pan</button>
    <button (click)="orgChart.resetZoom()">Reset Zoom</button>
    <!-- Highlight a specific node by node.id  - if you want to get node id by searching for a node use orgChart.flattenedNodes() it returns a signal of all nodes flattened -->
    <button (click)="orgChart.highlightNode('cto')">Highlight CTO</button>
  `
})
```

| Method                         | Description                              |
| ------------------------------ | ---------------------------------------- |
| `zoomIn(options?)`             | Zooms in the chart                       |
| `zoomOut(options?)`            | Zooms out the chart                      |
| `resetZoom(padding?)`          | Resets zoom to fit content               |
| `resetPan()`                   | Resets pan position to center            |
| `resetPanAndZoom(padding?)`    | Resets both pan and zoom                 |
| `highlightNode(nodeId)`        | Highlights and focuses a specific node   |
| `toggleCollapseAll(collapse?)` | Collapses or expands all nodes           |
| `getScale()`                   | Returns current zoom scale as percentage |

### Dynamic Zoom Configuration

The component supports dynamic zoom calculation when highlighting nodes. This ensures optimal zoom levels based on the node size and viewport dimensions:

```typescript
@Component({
  template: `
    <ngx-interactive-org-chart
      [data]="orgData"
      [highlightZoomNodeWidthRatio]="0.4"
      [highlightZoomNodeHeightRatio]="0.5"
      [highlightZoomMinimum]="1.0"
    />
  `
})
```

**Configuration Options:**

- `highlightZoomNodeWidthRatio` (0.1-1.0): How much of the viewport width the highlighted node should occupy
- `highlightZoomNodeHeightRatio` (0.1-1.0): How much of the viewport height the highlighted node should occupy
- `highlightZoomMinimum`: Minimum zoom level when highlighting (prevents over-zooming out)

**Examples:**

- Small nodes: Use higher ratios (0.4-0.6) for better visibility
- Large nodes: Use lower ratios (0.2-0.3) to avoid excessive zoom
- Mobile devices: Consider using higher minimum zoom for readability

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

The custom template receives the node data through the `let-node="node"` directive. You can access:

- `node.name` - The node name
- `node.data` - Custom data object with any properties you define
- `node.id` - Unique node identifier
- `node.children` - Array of child nodes
- `node.collapsed` - Current collapsed state
- `node.descendantsCount` - Total number of descendants (useful for displaying counts)

## 🎨 Styling

You can add a custom class to each node that will be applied separately or use the `nodeClass` input that will be applied to all nodes or you can use the `themeOptions` input to define global styles for nodes, connectors, and the chart container.

## 📊 Live Demo

Check out the interactive demo to see the component in action:

**[View Live Demo →](https://zeyadelshaf3y.github.io/ngx-interactive-org-chart)**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing-feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🤖 Issues & Support

If you encounter any issues or have questions:

1. Check the [GitHub Issues](https://github.com/zeyadelshaf3y/ngx-interactive-org-chart/issues)
2. Create a new issue with a detailed description
3. Include your Angular version and reproduction steps

## 💝 Support the Project

If this library helps you, consider supporting its development:

- ⭐ Star the repository on GitHub
- 🐛 Report bugs and suggest features
- 💝 [Buy me a coffee](https://buymeacoffee.com/zeyadalshafey)
- 💖 [GitHub Sponsors](https://github.com/sponsors/zeyadelshaf3y)

## 📄 License

MIT © [Zeyad Alshafey](https://github.com/zeyadelshaf3y)

## 🔗 Links

- [GitHub Repository](https://github.com/zeyadelshaf3y/ngx-interactive-org-chart)
- [NPM Package](https://www.npmjs.com/package/ngx-interactive-org-chart)
- [Live Demo](https://zeyadelshaf3y.github.io/ngx-interactive-org-chart)
- [Issues](https://github.com/zeyadelshaf3y/ngx-interactive-org-chart/issues)
