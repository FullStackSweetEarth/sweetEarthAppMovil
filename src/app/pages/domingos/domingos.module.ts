import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DomingosPageRoutingModule } from './domingos-routing.module';

import { DomingosPage } from './domingos.page';
import { Buscar2Pipe } from 'src/app/pipes/buscar2.pipe';
import { Fichasv2PageModule } from '../fichasv2/fichasv2.module';
import { HorasPipe } from './horas.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DomingosPageRoutingModule
  ],
  declarations: [DomingosPage, HorasPipe]
})
export class DomingosPageModule {}
