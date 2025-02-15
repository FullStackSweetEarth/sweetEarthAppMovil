import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { EscogerRanchoPageRoutingModule } from './escoger-rancho-routing.module';
import { EscogerRanchoPage } from './escoger-rancho.page';
import { Buscar2Pipe } from 'src/app/pipes/buscar2.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscogerRanchoPageRoutingModule
  ],
  declarations: [EscogerRanchoPage, Buscar2Pipe]
})
export class EscogerRanchoPageModule {}
