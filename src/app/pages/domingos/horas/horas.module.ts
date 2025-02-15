import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorasPageRoutingModule } from './horas-routing.module';

import { HorasPage } from './horas.page';
import { Fichasv2PageModule } from '../../fichasv2/fichasv2.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorasPageRoutingModule,
    Fichasv2PageModule,NgxMaterialTimepickerModule
  ],
  declarations: [HorasPage]
})
export class HorasPageModule {}
