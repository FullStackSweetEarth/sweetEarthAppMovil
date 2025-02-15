import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapturaPageRoutingModule } from './captura-routing.module';

import { CapturaPage } from './captura.page';
import { ProgressBarModule } from 'angular-progress-bar';
import { Fichasv2PageModule } from 'src/app/pages/fichasv2/fichasv2.module';
import { FiltrarInactivosPipe } from 'src/app/pipes/filtrar-inactivos.pipe';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ProgramaActividadesPageModule } from 'src/app/pages/programa-actividades/programa-actividades.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapturaPageRoutingModule, ProgressBarModule, Fichasv2PageModule,NgxMaterialTimepickerModule,ProgramaActividadesPageModule
  ],
  declarations: [CapturaPage, FiltrarInactivosPipe],
  exports:[FiltrarInactivosPipe]
})
export class CapturaPageModule {}
