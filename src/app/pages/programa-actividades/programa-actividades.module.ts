import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramaActividadesPageRoutingModule } from './programa-actividades-routing.module';

import { ProgramaActividadesPage } from './programa-actividades.page';
import { Buscar4Pipe } from 'src/app/pipes/buscar4.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramaActividadesPageRoutingModule
  ],
  declarations: [ProgramaActividadesPage,
    Buscar4Pipe], exports: [Buscar4Pipe]
})
export class ProgramaActividadesPageModule {}
