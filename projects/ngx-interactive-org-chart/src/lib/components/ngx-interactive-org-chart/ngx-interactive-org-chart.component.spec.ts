import { TestBed } from '@angular/core/testing';
import { NgxInteractiveOrgChart } from './ngx-interactive-org-chart.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { OrgChartNode } from '../../models';

@Component({
  template: `<ngx-interactive-org-chart [data]="testData" />`,
  imports: [NgxInteractiveOrgChart],
})
class TestHostComponent<T> {
  testData: OrgChartNode<T> = {
    id: 'test',
    name: 'Test Node',
    data: {
      // Add any additional data properties here
    } as T,
  };
}

describe('NgxInteractiveOrgChart', () => {
  let component: NgxInteractiveOrgChart<any>;
  let hostComponent: TestHostComponent<any>;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default configuration', () => {
    expect(component.config()).toBeDefined();
  });

  it('should receive data input', () => {
    expect(component.data()).toEqual(hostComponent.testData);
  });

  it('should have collapsible enabled by default', () => {
    expect(component.collapsible()).toBe(true);
  });
});
