import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesRevisionesPageRoutingModule } from './detalles-revisiones-routing.module';

import { DetallesRevisionesPage } from './detalles-revisiones.page';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesRevisionesPageRoutingModule,NgxMaterialTimepickerModule
  ],
  declarations: [DetallesRevisionesPage]
})
export class DetallesRevisionesPageModule {}
