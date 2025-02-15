import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapturaRendimintosPageRoutingModule } from './captura-rendimintos-routing.module';

import { CapturaRendimintosPage } from './captura-rendimintos.page';
import { Fichasv2PageModule } from '../../fichasv2/fichasv2.module';
import { CapturaPageModule } from '../../domingos/actividad/captura/captura.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapturaRendimintosPageRoutingModule,
    Fichasv2PageModule,
    CapturaPageModule
  ],
  declarations: [CapturaRendimintosPage]
})
export class CapturaRendimintosPageModule {}
