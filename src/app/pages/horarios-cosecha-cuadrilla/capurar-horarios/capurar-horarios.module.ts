import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapurarHorariosPageRoutingModule } from './capurar-horarios-routing.module';

import { CapurarHorariosPage } from './capurar-horarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapurarHorariosPageRoutingModule
  ],
  declarations: [CapurarHorariosPage]
})
export class CapurarHorariosPageModule {}
