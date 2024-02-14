import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveSolarPanelPage } from './move-solar-panel.page';

describe('MoveSolarPanelPage', () => {
  let component: MoveSolarPanelPage;
  let fixture: ComponentFixture<MoveSolarPanelPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MoveSolarPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
