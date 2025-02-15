import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorariosCosechaCuadrillaPageRoutingModule } from './horarios-cosecha-cuadrilla-routing.module';

import { HorariosCosechaCuadrillaPage } from './horarios-cosecha-cuadrilla.page';
import { Fichasv2PageModule } from '../fichasv2/fichasv2.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorariosCosechaCuadrillaPageRoutingModule,
        Fichasv2PageModule,
  ],
  declarations: [HorariosCosechaCuadrillaPage]
})
export class HorariosCosechaCuadrillaPageModule {}
