import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActividadPageRoutingModule } from './actividad-routing.module';

import { ActividadPage } from './actividad.page';
import {ProgressBarModule} from 'angular-progress-bar';
import { Fichasv2PageModule } from '../../fichasv2/fichasv2.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActividadPageRoutingModule,
    ProgressBarModule,Fichasv2PageModule
  ],
  declarations: [ActividadPage]
})
export class ActividadPageModule {}
