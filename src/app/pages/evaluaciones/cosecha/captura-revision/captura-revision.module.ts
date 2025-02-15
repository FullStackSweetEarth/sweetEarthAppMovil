import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapturaRevisionPageRoutingModule } from './captura-revision-routing.module';

import { CapturaRevisionPage } from './captura-revision.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapturaRevisionPageRoutingModule
  ],
  declarations: [CapturaRevisionPage]
})
export class CapturaRevisionPageModule {}
