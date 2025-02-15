import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FumigacionPageRoutingModule } from './fumigacion-routing.module';

import { FumigacionPage } from './fumigacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FumigacionPageRoutingModule
  ],
  declarations: [FumigacionPage]
})
export class FumigacionPageModule {}
