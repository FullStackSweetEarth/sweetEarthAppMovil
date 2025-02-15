import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapturaPageRoutingModule } from './captura-routing.module';

import { CapturaPage } from './captura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapturaPageRoutingModule
  ],
  declarations: [CapturaPage]
})
export class CapturaPageModule {}
