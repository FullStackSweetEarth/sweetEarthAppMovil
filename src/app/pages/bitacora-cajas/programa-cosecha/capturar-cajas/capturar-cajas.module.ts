import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapturarCajasPageRoutingModule } from './capturar-cajas-routing.module';

import { CapturarCajasPage } from './capturar-cajas.page';
import { ProgramaActividadesPageModule } from 'src/app/pages/programa-actividades/programa-actividades.module';
import { getHistorialPipe } from 'src/app/pipes/getHistorial.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapturarCajasPageRoutingModule,ProgramaActividadesPageModule
  ],
  declarations: [CapturarCajasPage,getHistorialPipe]
})
export class CapturarCajasPageModule {}
