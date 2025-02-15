import { ApplicationModule, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarHorarioPageRoutingModule } from './agregar-horario-routing.module';

import { AgregarHorarioPage } from './agregar-horario.page';
import { AddPapeletaPageModule } from '../../bitacoras/cosecha/add-papeleta/add-papeleta.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarHorarioPageRoutingModule,
    AddPapeletaPageModule,
    // ApplicationModule,
    NgxMaterialTimepickerModule

  ],
  declarations: [AgregarHorarioPage]
})
export class AgregarHorarioPageModule {}
