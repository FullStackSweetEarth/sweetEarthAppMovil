import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FileTransfer} from '@awesome-cordova-plugins/file-transfer/ngx';
import { DatePipe, registerLocaleData } from '@angular/common';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';

import { File } from '@awesome-cordova-plugins/file/ngx';

registerLocaleData(localeEs, 'es');
@NgModule({
  declarations: [AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularSignaturePadModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DatePipe,
    FileTransfer,
    FileOpener,
    BackgroundMode,
    { provide: LOCALE_ID, useValue: 'es' },
    File
  ],
  exports:[NgxMaterialTimepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule {
  app = initializeApp(environment.firebaseConfig);
}
