import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapturasPageRoutingModule } from './capturas-routing.module';

import { CapturasPage } from './capturas.page';
import { PipesModule } from 'src/app/models/pipes/pipes.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapturasPageRoutingModule,
    PipesModule,
    
    NgxMaterialTimepickerModule
  ],
  declarations: [CapturasPage],
})
export class CapturasPageModule {}
