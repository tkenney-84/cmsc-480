import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewAzimuthPage } from './view-azimuth.page';

describe('ViewAzimuthPage', () => {
  let component: ViewAzimuthPage;
  let fixture: ComponentFixture<ViewAzimuthPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewAzimuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
