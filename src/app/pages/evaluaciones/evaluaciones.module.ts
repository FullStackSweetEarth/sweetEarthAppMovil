import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvaluacionesPageRoutingModule } from './evaluaciones-routing.module';

import { EvaluacionesPage } from './evaluaciones.page';
import { Fichasv2PageModule } from '../fichasv2/fichasv2.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaluacionesPageRoutingModule,Fichasv2PageModule
  ],
  declarations: [EvaluacionesPage]
})
export class EvaluacionesPageModule {}
