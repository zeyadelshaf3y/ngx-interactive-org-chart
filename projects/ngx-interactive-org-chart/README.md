# ngx-interactive-org-chart

> Modern Angular organizational chart component with interactive pan/zoom functionality

[![npm version](https://badge.fury.io/js/ngx-interactive-org-chart.svg)](https://badge.fury.io/js/ngx-interactive-org-chart)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/ngx-interactive-org-chart.svg)](https://www.npmjs.com/package/ngx-interactive-org-chart)

A beautiful, interactive organizational chart component for Angular applications. Built with modern Angular features and designed for ease of use and customization.

## ✨ Features

- 🎯 **Interactive Pan & Zoom** - Smooth navigation with mouse/touch
- 🌳 **Hierarchical Layout** - Perfect for organizational structures  
- 🎨 **Customizable Styling** - Fully themeable with CSS/SCSS
- 📱 **Mobile Friendly** - Touch gestures support
- ⚡ **High Performance** - Optimized rendering
- 🔧 **TypeScript Support** - Full type definitions included
- 🎪 **Angular 19+** - Built with latest Angular features
- 🆓 **100% Free** - Open source MIT license

## 🚀 Installation

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
  ]
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
export class AppModule { }
```

## 📖 Usage

### Basic Example

```typescript
import { Component } from '@angular/core';
import { NgxInteractiveOrgChart } from 'ngx-interactive-org-chart';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [NgxInteractiveOrgChart],
  template: `
    <ngx-interactive-org-chart [data]="orgData" [config]="config" />
  `
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
            name: 'Mike Johnson'
          }
        ]
      },
      {
        id: 'cfo',
        name: 'Sarah Wilson'
      }
    ]
  };
}
```

### Data Structure

The component expects hierarchical data in the following format:

```typescript
interface OrgNode<T> {
   id?: string;
   name?: string;
   data?: T;
   children?: OrgChartNode[];
   collapsed?: boolean;
   hidden?: boolean;
   nodeClass?: string;
}
```

### Component Options

```typescript
interface OrgChartConfig {
   connectorsAnimationDelay?: string;
   animationDuration?: string;
   collapseDuration?: string;
   nodePadding?: string;
   nodeContainerSpacing?: string;
   nodeBorderRadius?: string;
   nodeActiveBorderColor?: string;
   connectorColor?: string;
   connectorBorderRadius?: string;
   connectorActiveColor?: string;
   connectorWidth?: string;
   collapseButtonSize?: string;
   collapseButtonBorderRadius?: string;
   nodeMaxWidth?: string;
   nodeMinWidth?: string;
   nodeMaxHeight?: string;
   nodeMinHeight?: string;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `OrgChartNode` | required | The organizational data to display |
| `collapsible` | `boolean` | `true` | Enable/disable node collapsing |
| `config` | `OrgChartConfig` | `{}` | Configuration options for styling |
| `nodeClass` | `string` | `undefined` | Custom CSS class applied to all nodes |

## 🎨 Styling

You can add a custom class to each node that will be applied separately or use the `nodeClass` input that will be applied to all nodes.

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
