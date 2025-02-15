import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapurarIncidenciasPageRoutingModule } from './capurar-incidencias-routing.module';

import { CapurarIncidenciasPage } from './capurar-incidencias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapurarIncidenciasPageRoutingModule
  ],
  declarations: [CapurarIncidenciasPage]
})
export class CapurarIncidenciasPageModule {}
