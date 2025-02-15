import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AddPapeletaPageRoutingModule } from './add-papeleta-routing.module';
import { AddPapeletaPage } from './add-papeleta.page';
import { PipesModule } from '../../../../models/pipes/pipes.module';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPapeletaPageRoutingModule,
    PipesModule,
    
    ScrollingModule,
    NgxMaterialTimepickerModule
  ],
  exports:[
    PipesModule
  ],
  providers: [
    // BarcodeScanner
  ],
  declarations: [AddPapeletaPage]
})
export class AddPapeletaPageModule {}
