/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.page.html',
  styleUrls: ['./actividad.page.scss'],
})
export class ActividadPage implements OnInit {
  presentingElement: any = null;
  fecha: any;
  actividades: any[] = [];
  id: any;
  palabra: any = '';
  rancho: any;
  uid: any;
  f: string;

  constructor(private _recursos: RecursosService,
    private navCtrl: NavController
    ) {

     }

  ngOnInit() {
    environment.fechaPagoAvance =  JSON.parse( localStorage.getItem('fechaPagoAvance'));

    this.uid =localStorage.getItem('uid');
    this.fecha = environment.fechaPagoAvance;
    this.presentingElement = document.querySelector('.ion-page');
    this.actividades = this._recursos.getDatosLocales('pActividades');
    this.actividades = (this.actividades?this.actividades: [])
    .filter( d => d.fecha+''  === this.fecha+'');

    this.actividades = (this.actividades?this.actividades: []).filter( d => d.uID === this.uid.replace(/[\r\n]*/g,'') );

  }
  capturar(dat){
    this.navCtrl.navigateForward(`/domingos/actividad/${dat.idRancho}/captura/${dat.id}/${dat.idApp}`);
  }

  back() {
    this.navCtrl.navigateBack(`escoger-rancho/7`);
  }


}
