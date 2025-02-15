import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RecursosService } from 'src/app/services/recursos.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.page.html',
  styleUrls: ['./actividades.page.scss'],
})
export class ActividadesPage implements OnInit {
  fecha: any;
  litaActividades: any[]=[];
  palabra: string;
  constructor(
    private navCtrl: NavController,
    private _recursos: RecursosService
  ) {}

  ngOnInit() {
    this.fecha = this._recursos.getFechaHoy().fecha;
    this.getActividades(this.fecha);
  }
  back() {
    this.navCtrl.navigateBack(``);
  }
  getFecha() {
    return  JSON.parse(localStorage.getItem('metaActividades'))?JSON.parse(localStorage.getItem('metaActividades')).fecha: localStorage.getItem('fechaCosecha');
  }
  capturar(meta){
    localStorage.setItem('metaActividades',JSON.stringify (meta));
    this.navCtrl.navigateForward(`actividades/captura-rendimintos`);
  }
  getActividades(fecha){

    this.litaActividades = this._recursos.getDatosLocales('programaActividadesSN');
    this.litaActividades = this.litaActividades.filter(d=>d.fecha === fecha);
  }
}
