import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosechaPageRoutingModule } from './cosecha-routing.module';

import { CosechaPage } from './cosecha.page';
import { Fichasv2PageModule } from '../../fichasv2/fichasv2.module';
import { CapturaPageModule } from '../actividad/captura/captura.module';
import { PlantillaPageModule } from '../plantilla/plantilla.module';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosechaPageRoutingModule,
    Fichasv2PageModule,
    CapturaPageModule, 
    PlantillaPageModule,
    AngularSignaturePadModule
  ],
  declarations: [CosechaPage]
})
export class CosechaPageModule {}
