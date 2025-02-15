import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoportePageRoutingModule } from './soporte-routing.module';

import { SoportePage } from './soporte.page';
import { Fichasv2PageModule } from '../fichasv2/fichasv2.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoportePageRoutingModule,Fichasv2PageModule
  ],
  declarations: [SoportePage]
})
export class SoportePageModule {}
