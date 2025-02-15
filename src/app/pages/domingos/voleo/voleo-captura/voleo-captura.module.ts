import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoleoCapturaPageRoutingModule } from './voleo-captura-routing.module';

import { VoleoCapturaPage } from './voleo-captura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoleoCapturaPageRoutingModule
  ],
  declarations: [VoleoCapturaPage]
})
export class VoleoCapturaPageModule {}
