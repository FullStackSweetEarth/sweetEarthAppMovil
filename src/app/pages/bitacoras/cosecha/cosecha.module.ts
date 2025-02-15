import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CosechaPageRoutingModule } from './cosecha-routing.module';
import { CosechaPage } from './cosecha.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CosechaPageRoutingModule
  ],
  declarations: [CosechaPage]
})
export class CosechaPageModule {}
