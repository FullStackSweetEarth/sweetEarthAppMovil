import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Fichasv2PageRoutingModule } from './fichasv2-routing.module';

import { Fichasv2Page } from './fichasv2.page';
import { BuscarPipe } from 'src/app/pipes/buscar.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Fichasv2PageRoutingModule
  ],
  declarations: [Fichasv2Page,
    
    BuscarPipe],
    exports:[
      BuscarPipe
    ]
})
export class Fichasv2PageModule {}
