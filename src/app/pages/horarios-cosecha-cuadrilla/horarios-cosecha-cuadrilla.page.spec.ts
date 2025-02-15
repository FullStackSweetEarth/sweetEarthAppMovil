import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HorariosCosechaCuadrillaPage } from './horarios-cosecha-cuadrilla.page';

describe('HorariosCosechaCuadrillaPage', () => {
  let component: HorariosCosechaCuadrillaPage;
  let fixture: ComponentFixture<HorariosCosechaCuadrillaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HorariosCosechaCuadrillaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HorariosCosechaCuadrillaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
