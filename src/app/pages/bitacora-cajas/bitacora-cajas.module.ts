import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BitacoraCajasPageRoutingModule } from './bitacora-cajas-routing.module';

import { BitacoraCajasPage } from './bitacora-cajas.page';
import { CapturaPageModule } from '../domingos/actividad/captura/captura.module';
import { Fichasv2PageModule } from '../fichasv2/fichasv2.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BitacoraCajasPageRoutingModule, Fichasv2PageModule
  ],
  declarations: [BitacoraCajasPage]
})
export class BitacoraCajasPageModule {}
