import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CosechaPageRoutingModule } from './cosecha-routing.module';

import { CosechaPage } from './cosecha.page';
import { RouterModule } from '@angular/router';
import { Fichasv2PageModule } from '../../fichasv2/fichasv2.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosechaPageRoutingModule,
    RouterModule
    ,Fichasv2PageModule
  ],
  declarations: [CosechaPage]
})
export class CosechaPageModule {}
