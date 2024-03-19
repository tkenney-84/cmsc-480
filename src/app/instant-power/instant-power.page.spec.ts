import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstantPowerPage } from './instant-power.page';

describe('InstantPowerPage', () => {
  let component: InstantPowerPage;
  let fixture: ComponentFixture<InstantPowerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InstantPowerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
