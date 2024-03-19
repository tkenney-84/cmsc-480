import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemodevPage } from './demodev.page';

describe('DemodevPage', () => {
  let component: DemodevPage;
  let fixture: ComponentFixture<DemodevPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DemodevPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
