# ngx-interactive-org-chart

w> Modern Angular organizational chart component with interactive pan/zoom functionality

[![npm version](https://img.shields.io/npm/v/ngx-interactive-org-chart)](https://www.npmjs.com/package/ngx-interactive-org-chart)
[![license](https://img.shields.io/npm/l/ngx-interactive-org-chart)](https://opensource.org/licenses/MIT)
[![downloads](https://img.shields.io/npm/dm/ngx-interactive-org-chart)](https://www.npmjs.com/package/ngx-interactive-org-chart)

A beautiful, interactive organizational chart component for Angular applications. Built with modern Angular features and designed for ease of use and customization.

## 📊 Live Demo

**[View Interactive Demo →](https://zeyadalshafey.github.io/ngx-interactive-org-chart)**

## � Quick Start

```bash
npm install ngx-interactive-org-chart
```

For detailed documentation, installation guide, and API reference, see the **[Library Documentation](./projects/ngx-interactive-org-chart/README.md)**.

## 🎯 Repository Structure

```
├── projects/
│   ├── ngx-interactive-org-chart/    # � Main library
│   └── demo/                         # 🎪 Demo application
├── dist/                             # 📦 Build outputs
└── docs/                             # 📖 GitHub Pages demo
```
- 📦 **Lightweight**: Minimal dependencies

## 🚀 Quick Start

### Installation

```bash
npm install ngx-interactive-org-chart
```

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { OrgChartComponent } from 'ngx-interactive-org-chart';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [OrgChartComponent],
  template: `
    <org-chart [data]="orgData" [config]="config"></org-chart>
  `
})
export class DemoComponent {
  orgData = {
    id: '1', 
    name: 'CEO', 
    title: 'Chief Executive Officer',
    children: [
      {
        id: '2', 
        name: 'CTO', 
        title: 'Chief Technology Officer',
        children: [
          { id: '3', name: 'Developer', title: 'Senior Developer' }
        ]
      }
    ]
  };

  config = {
    connectorColor: '#e2e8f0',
    nodePadding: '16px',
    collapsible: true
  };
}
```

## 📋 Requirements

- Angular 19+
- TypeScript 5.4+

## 🏗️ Development

```bash
# Clone the repository
git clone https://github.com/zeyadalshafey/ngx-interactive-org-chart.git

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

MIT © [Zeyad Alshafey](https://github.com/zeyadalshaf3y)

## � Links

- [NPM Package](https://www.npmjs.com/package/ngx-interactive-org-chart)
- [Live Demo](https://zeyadalshafey.github.io/ngx-interactive-org-chart)
- [Documentation](./projects/ngx-interactive-org-chart/README.md)
- [Issues](https://github.com/zeyadalshaf3y/ngx-interactive-org-chart/issues)