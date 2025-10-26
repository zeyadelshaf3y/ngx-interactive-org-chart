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
- �️ **Drag & Drop** - Reorganize nodes with drag and drop support
- 🎯 **Custom Drag Handles** - Use custom templates for drag handles
- �📈 **Dynamic Data Binding** - Reactive updates with Angular signals
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
    dragOverOutlineColor?: string;
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

| Property                       | Type                           | Default      | Description                                                                         |
| ------------------------------ | ------------------------------ | ------------ | ----------------------------------------------------------------------------------- |
| `data`                         | `OrgChartNode`                 | required     | The organizational data to display                                                  |
| `collapsible`                  | `boolean`                      | `true`       | Enable/disable node collapsing                                                      |
| `layout`                       | `'vertical' \| 'horizontal'`   | `'vertical'` | Chart layout orientation                                                            |
| `themeOptions`                 | `NgxInteractiveOrgChartTheme`  | `{}`         | Theme configuration options for styling                                             |
| `nodeClass`                    | `string`                       | `undefined`  | Custom CSS class applied to all nodes                                               |
| `initialZoom`                  | `number`                       | `undefined`  | Initial zoom level                                                                  |
| `minZoom`                      | `number`                       | `0.1`        | Minimum zoom level                                                                  |
| `maxZoom`                      | `number`                       | `5`          | Maximum zoom level                                                                  |
| `zoomSpeed`                    | `number`                       | `1`          | Zoom speed multiplier                                                               |
| `zoomDoubleClickSpeed`         | `number`                       | `2`          | Double-click zoom speed multiplier                                                  |
| `initialCollapsed`             | `boolean`                      | `false`      | Initial collapsed state for all nodes                                               |
| `isRtl`                        | `boolean`                      | `false`      | Right-to-left text direction support                                                |
| `displayChildrenCount`         | `boolean`                      | `true`       | Show children count on collapse buttons                                             |
| `highlightZoomNodeWidthRatio`  | `number`                       | `0.3`        | Node width ratio relative to viewport when highlighting (0.1-1.0)                   |
| `highlightZoomNodeHeightRatio` | `number`                       | `0.4`        | Node height ratio relative to viewport when highlighting (0.1-1.0)                  |
| `highlightZoomMinimum`         | `number`                       | `0.8`        | Minimum zoom level when highlighting a node                                         |
| `draggable`                    | `boolean`                      | `false`      | Enable drag and drop functionality for nodes                                        |
| `canDragNode`                  | `(node) => boolean`            | `undefined`  | Predicate function to determine if a node can be dragged                            |
| `canDropNode`                  | `(dragged, target) => boolean` | `undefined`  | Predicate function to validate drop operations                                      |
| `dragEdgeThreshold`            | `number`                       | `150`        | **Deprecated.** Auto-pan threshold is now calculated as 10% of container dimensions |
| `dragAutoPanSpeed`             | `number`                       | `15`         | Speed of auto-panning in pixels per frame during drag                               |

### Component Events

| Event           | Type                                                            | Description                                 |
| --------------- | --------------------------------------------------------------- | ------------------------------------------- |
| `nodeDrop`      | `{ draggedNode: OrgChartNode<T>, targetNode: OrgChartNode<T> }` | Emitted when a node is dropped onto another |
| `nodeDragStart` | `OrgChartNode<T>`                                               | Emitted when a node drag operation starts   |
| `nodeDragEnd`   | `OrgChartNode<T>`                                               | Emitted when a node drag operation ends     |

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

## 🖱️ Drag & Drop

The component supports drag and drop functionality, allowing users to reorganize the organizational chart dynamically. The library provides events and helper functions to handle the data restructuring.

### Basic Drag & Drop Setup

```typescript
import { Component, signal } from '@angular/core';
import {
  NgxInteractiveOrgChart,
  OrgChartNode,
  moveNode,
} from 'ngx-interactive-org-chart';

@Component({
  selector: 'app-drag-drop-demo',
  standalone: true,
  imports: [NgxInteractiveOrgChart],
  template: `
    <ngx-interactive-org-chart
      [data]="orgData()"
      [draggable]="true"
      (nodeDrop)="onNodeDrop($event)"
      (nodeDragStart)="onDragStart($event)"
      (nodeDragEnd)="onDragEnd($event)"
    />
  `,
})
export class DragDropDemoComponent {
  orgData = signal<OrgChartNode>({
    id: '1',
    name: 'CEO',
    children: [
      { id: '2', name: 'CTO', children: [] },
      { id: '3', name: 'CFO', children: [] },
    ],
  });

  /**
   * Handle node drop event.
   * IMPORTANT: The library does NOT modify your data automatically.
   * You must handle the data restructuring yourself.
   */
  onNodeDrop(event: { draggedNode: OrgChartNode; targetNode: OrgChartNode }) {
    const currentData = this.orgData();

    // Option 1: Use the built-in helper function (recommended)
    const updatedData = moveNode(
      currentData,
      event.draggedNode.id,
      event.targetNode.id
    );

    if (updatedData) {
      this.orgData.set(updatedData);
      // Optionally save to backend
      // this.api.updateOrgStructure(updatedData);
    } else {
      alert('Cannot move node: Invalid operation');
    }

    // Option 2: Implement your own custom logic
    // const updatedData = this.customMoveLogic(currentData, event);
    // this.orgData.set(updatedData);
  }

  onDragStart(node: OrgChartNode) {
    console.log('Drag started:', node.name);
  }

  onDragEnd(node: OrgChartNode) {
    console.log('Drag ended:', node.name);
  }
}
```

### Custom Drag Handle

By default, the entire node is draggable. You can provide a custom drag handle template to specify which part of the node should be used for dragging:

```typescript
@Component({
  template: `
    <ngx-interactive-org-chart
      [data]="orgData()"
      [draggable]="true"
      (nodeDrop)="onNodeDrop($event)"
    >
      <!-- Custom node template -->
      <ng-template #nodeTemplate let-node="node">
        <div class="custom-node">
          <h3>{{ node.name }}</h3>
          <p>{{ node.data?.title }}</p>
        </div>
      </ng-template>

      <!-- Custom drag handle template -->
      <ng-template #dragHandleTemplate let-node="node">
        <button class="drag-handle" title="Drag to move">
          ⋮⋮
        </button>
      </ng-template>
    </ngx-interactive-org-chart>
  `,
  styles: [`
    .drag-handle {
      cursor: move;
      padding: 4px 8px;
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 4px;
      user-select: none;
    }

    .drag-handle:hover {
      background: #e0e0e0;
    }
  `]
})
```

### Helper Functions

The library provides several helper functions for common tree operations:

```typescript
import {
  moveNode,
  findNode,
  removeNode,
  addNodeToParent,
  isNodeDescendant,
} from 'ngx-interactive-org-chart';

// Move a node to a new parent
const updatedTree = moveNode(tree, draggedNodeId, targetParentId);

// Find a specific node by ID
const node = findNode(tree, nodeId);

// Remove a node from the tree
const treeWithoutNode = removeNode(tree, nodeId);

// Add a node to a specific parent
const treeWithNewNode = addNodeToParent(tree, parentId, newNode);

// Check if a node is a descendant of another
const isDescendant = isNodeDescendant(ancestorNode, descendantId);
```

### Drag & Drop Features

- **Auto-panning**: Automatically pans the view when dragging near viewport edges (configurable threshold and speed)
- **Visual Feedback**: Shows drag-over state on target nodes with color hints
- **Drag Constraints**: Use `canDragNode` and `canDropNode` predicates to control what can be dragged and where
- **ESC to Cancel**: Press ESC key during drag to cancel the operation
- **Validation**: Prevents dropping nodes on themselves or their descendants
- **Custom Handles**: Optional custom drag handle templates
- **Events**: Full control with dragStart, dragEnd, and drop events
- **Helper Functions**: Built-in utilities for tree manipulation
- **Pure Functions**: All helpers are immutable and return new tree structures
- **Touch Screen Support**: Full drag and drop support on mobile devices and tablets

### Touch Screen Support

The drag and drop functionality works seamlessly on touch-enabled devices (smartphones and tablets):

**Features:**

- **Touch Gestures**: Long press or drag to initiate drag operation
- **Visual Ghost Element**: A semi-transparent copy of the node follows your finger during drag
- **Auto-panning**: Works with touch gestures when dragging near screen edges
- **Drop Zones**: Visual feedback shows valid/invalid drop targets
- **Smooth Performance**: Optimized for 60fps touch interactions
- **Hybrid Support**: Works on devices with both touch and mouse input

**How it works:**

1. Touch and hold a draggable node
2. Start moving your finger - a ghost element appears after a small movement threshold (10px)
3. The org chart auto-pans when you drag near the edges
4. Valid drop targets show visual feedback (dashed outline)
5. Invalid targets show a "not-allowed" indicator
6. Release to drop, or drag outside to cancel

**No configuration needed** - touch support is automatically enabled when `draggable` is set to `true`. All drag constraints (`canDragNode`, `canDropNode`) work identically for both mouse and touch input.

**Example:**

```typescript
@Component({
  template: `
    <ngx-interactive-org-chart
      [data]="orgData()"
      [draggable]="true"
      (nodeDrop)="onNodeDrop($event)"
    />
  `,
})
export class MyComponent {
  // Works with both mouse and touch
  onNodeDrop(event: { draggedNode: OrgChartNode; targetNode: OrgChartNode }) {
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

### Drag Constraints & Validation

Control which nodes can be dragged and where they can be dropped using predicate functions:

```typescript
@Component({
  template: `
    <ngx-interactive-org-chart
      [data]="orgData()"
      [draggable]="true"
      [canDragNode]="canDragNode"
      [canDropNode]="canDropNode"
      [dragAutoPanSpeed]="20"
      (nodeDrop)="onNodeDrop($event)"
    />
  `,
})
export class MyComponent {
  // Prevent specific nodes from being dragged
  canDragNode = (node: OrgChartNode) => {
    // Example: CEO can't be moved
    return node.data?.role !== 'CEO';
  };

  // Control where nodes can be dropped
  canDropNode = (draggedNode: OrgChartNode, targetNode: OrgChartNode) => {
    // Example: Only departments can have children
    if (targetNode.data?.type !== 'Department') {
      return false;
    }

    // Example: Managers can't report to employees
    if (
      draggedNode.data?.role === 'Manager' &&
      targetNode.data?.role === 'Employee'
    ) {
      return false;
    }

    return true;
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
      // Optionally sync with backend
      this.api.updateOrgChart(updated);
    }
  }
}
```

**Visual Feedback:**

- Valid drop targets show a **dashed outline with subtle background tint**
- Invalid drop targets show **reduced opacity and not-allowed cursor**
- Press **ESC** to cancel drag operation at any time

**Auto-panning Configuration:**

The auto-pan threshold is **automatically calculated as 10% of the container dimensions**, making it responsive across all screen sizes:

- **Small screens (mobile)**: Smaller activation zone prevents accidental auto-panning
- **Large screens (desktop)**: Larger comfortable edge zones
- **No configuration needed**: Works perfectly out of the box

You can still customize the panning speed:

- `dragAutoPanSpeed` (default: 15): Panning speed in pixels per frame

> **Note**: The `dragEdgeThreshold` property is deprecated. The threshold is now dynamically calculated for optimal UX.

### Data Handling Pattern

**Important**: The library follows a controlled component pattern and does NOT modify your data automatically. This design gives you:

- ✅ **Full control** over validation logic
- ✅ **Backend synchronization** capabilities
- ✅ **Custom business rules** implementation
- ✅ **Undo/redo** functionality support
- ✅ **Optimistic updates** with rollback

**Pattern:**

1. User drags and drops a node
2. Library emits `nodeDrop` event with source and target nodes
3. You handle the event and restructure your data
4. Update your data signal/input
5. Library automatically re-renders the updated structure

```typescript
onNodeDrop(event: { draggedNode: OrgChartNode; targetNode: OrgChartNode }) {
  // 1. Get current data
  const currentData = this.orgData();

  // 2. Validate the operation (optional)
  if (!this.canMove(event.draggedNode, event.targetNode)) {
    this.showError('Cannot move this node');
    return;
  }

  // 3. Update the data structure
  const updatedData = moveNode(
    currentData,
    event.draggedNode.id,
    event.targetNode.id
  );

  if (!updatedData) return;

  // 4. Update state (with rollback capability)
  const previousData = currentData;
  this.orgData.set(updatedData);

  // 5. Sync with backend
  this.api.updateOrgChart(updatedData).subscribe({
    error: () => {
      // Rollback on error
      this.orgData.set(previousData);
      this.showError('Failed to update');
    }
  });
}
```

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
