import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage2 } from './home2.page';

describe('HomePage2', () => {
  let component: HomePage2;
  let fixture: ComponentFixture<HomePage2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage2],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
