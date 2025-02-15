import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiaPageRoutingModule } from './dia-routing.module';

import { DiaPage } from './dia.page';
import { Fichasv2PageModule } from '../../fichasv2/fichasv2.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiaPageRoutingModule,
    Fichasv2PageModule
  ],
  declarations: [DiaPage]
})
export class DiaPageModule {}
