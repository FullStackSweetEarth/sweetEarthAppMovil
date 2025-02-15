import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramaCosechaPageRoutingModule } from './programa-cosecha-routing.module';

import { ProgramaCosechaPage } from './programa-cosecha.page';
import { ProgramaActividadesPageModule } from '../../programa-actividades/programa-actividades.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramaCosechaPageRoutingModule,ProgramaActividadesPageModule
  ],
  declarations: [ProgramaCosechaPage]
})
export class ProgramaCosechaPageModule {}
