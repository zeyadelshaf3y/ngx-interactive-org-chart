import { Component } from '@angular/core';
import {
  NgxInteractiveOrgChart,
  OrgChartNode,
} from 'ngx-interactive-org-chart';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [NgxInteractiveOrgChart],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly data: OrgChartNode = this.generateMockTree(5, 2);

  generateMockTree(maxDepth: number, maxChildren: number): OrgChartNode {
    let currentId = 1;

    const buildNode = (level: number): OrgChartNode => {
      const id = String(currentId++);
      const name = `Node ${id}`;

      if (level >= maxDepth) {
        return { id, name };
      }

      const children: OrgChartNode[] = [];

      for (let i = 0; i < maxChildren; i++) {
        children.push(buildNode(level + 1));
      }

      return {
        id,
        name,
        children,
      };
    };

    return buildNode(1);
  }
}
