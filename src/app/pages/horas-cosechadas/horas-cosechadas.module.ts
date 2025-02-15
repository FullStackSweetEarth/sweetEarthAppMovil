import { ApplicationModule, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorasCosechadasPageRoutingModule } from './horas-cosechadas-routing.module';

import { HorasCosechadasPage } from './horas-cosechadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorasCosechadasPageRoutingModule,
    ApplicationModule
  ],
  declarations: [HorasCosechadasPage]
})
export class HorasCosechadasPageModule {}
