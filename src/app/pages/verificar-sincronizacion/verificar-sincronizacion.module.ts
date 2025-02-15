import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificarSincronizacionPageRoutingModule } from './verificar-sincronizacion-routing.module';

import { VerificarSincronizacionPage } from './verificar-sincronizacion.page';
import { Fichasv2PageModule } from '../fichasv2/fichasv2.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificarSincronizacionPageRoutingModule,
    Fichasv2PageModule
  ],
  declarations: [VerificarSincronizacionPage]
})
export class VerificarSincronizacionPageModule {}
