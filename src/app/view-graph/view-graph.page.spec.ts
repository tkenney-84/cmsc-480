import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewGraphPage } from './view-graph.page';

describe('ViewGraphPage', () => {
  let component: ViewGraphPage;
  let fixture: ComponentFixture<ViewGraphPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewGraphPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
