import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoleoPageRoutingModule } from './voleo-routing.module';

import { VoleoPage } from './voleo.page';
import { Fichasv2PageModule } from '../../fichasv2/fichasv2.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoleoPageRoutingModule,
    Fichasv2PageModule
  ],
  declarations: [VoleoPage]
})
export class VoleoPageModule {}
