# ngx-interactive-org-chart

A modern, interactive Angular organizational chart component with pan/zoom functionality.

![npm version](https://img.shields.io/npm/v/ngx-interactive-org-chart)
![license](https://img.shields.io/npm/l/ngx-interactive-org-chart)
![downloads](https://img.shields.io/npm/dm/ngx-interactive-org-chart)

## ✨ Features

- 🎯 **Interactive**: Pan, zoom, and navigate through large organizational structures
- 🎨 **Customizable**: Flexible styling and theming options
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- ⚡ **Performance**: Optimized for large datasets
- 🔧 **Angular 19+**: Built with the latest Angular features
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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Pro Version

Need more features? Check out our [Pro Version](https://your-website.com/pro) for:

- ✅ Unlimited nodes (free version limited to 50)
- ✅ Advanced export options (PDF, PNG, SVG)
- ✅ Custom themes and styling
- ✅ Search and filtering
- ✅ Priority support

[Get Pro Version →](https://your-website.com/pro)