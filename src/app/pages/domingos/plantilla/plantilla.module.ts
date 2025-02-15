import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantillaPageRoutingModule } from './plantilla-routing.module';

import { PlantillaPage } from './plantilla.page';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { Fichasv2PageModule } from '../../fichasv2/fichasv2.module';
import { CapturaPageModule } from '../actividad/captura/captura.module';
import { NoMostrarPipe } from 'src/app/pipes/no-mostrar.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlantillaPageRoutingModule,
    AngularSignaturePadModule,
    Fichasv2PageModule,
    CapturaPageModule

  ],
  declarations: [PlantillaPage,
    NoMostrarPipe],
    exports:[NoMostrarPipe]
})
export class PlantillaPageModule {}
