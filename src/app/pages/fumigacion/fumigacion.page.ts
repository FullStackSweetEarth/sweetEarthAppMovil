import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ICalendario, ICosechaGuardar, IRancho } from 'src/app/interfaces/papeleta';
import { AsyncService } from '../../services/async.service';
import { IFcaptura, IFCapturasAll } from '../../interfaces/fumigacion';

@Component({
  selector: 'app-fumigacion',
  templateUrl: './fumigacion.page.html',
  styleUrls: ['./fumigacion.page.scss'],
})
export class FumigacionPage implements OnInit {
  capturasAll: IFCapturasAll[] = [];
  capturas: IFcaptura[] = [];
  fecha: string;

  banderaRancho = false;
  rancho: IRancho[] = [];
  ParametrosRancho: IRancho;
  calendario: ICalendario[] = [];
  idRancho: number | any;
  fechaSistema: string;
  datosCosecha: ICosechaGuardar[] = [];
  ranchoN: any;

  constructor(
    private navCont: NavController,
    public datepipe: DatePipe, private activatedRoute: ActivatedRoute, private _async: AsyncService
  ) {
    this.idRancho = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getRancho();
  }

  ngOnInit() {
  }
  ionViewDidEnter(){
    this.getData();
  }

  getData() {
    let captuAll; let capt; let cal; let dcL; let rh;
    const date = this._async.getFechaMexHoy();
    this.fecha = this.datepipe.transform(date, 'yyyy-MM-dd');
    captuAll = JSON.parse(localStorage.getItem('capturaFumigacion'));
    this.capturasAll = captuAll ? captuAll: [];

    const capturas =this.capturasAll.find(b => b.fecha == this.fecha)? this.capturasAll.find(b => b.fecha == this.fecha).captura :[];
    capt = capturas.filter(b => b.idRancho == this.idRancho);
    this.capturas = capt? capt:[];

    cal = this._async.getData('calendario');
    this.calendario = cal?cal:[];

    this.fechaSistema = this.datepipe.transform(this._async.getFechaMexHoy(), 'yyyy-MM-dd');
    dcL = this._async.getData('capturaFumigacion');
    const dc = dcL?dcL:[];

    rh = this._async.getData('ranchos');
    this.rancho = rh? rh:[];

    this.datosCosecha = dc.length > 0? dc: [];
  }

  getRancho(){
    this.ranchoN =  this._async.getData('ranchos').find(d => d.idRancho+'' === this.idRancho+'').rancho;
  }

  capturar() {
      if (!this.datosCosecha.find(b => b.fecha == this.fechaSistema && b.idRancho == this.idRancho)) {
        this.banderaRancho = false;
        const fechaActual = this.datepipe.transform(this._async.getFechaMexHoy(), 'yyyy-MM-dd HH:mm:ss');
        const datoRancho: ICosechaGuardar = {
          fecha: this.fechaSistema,
          captura: [],
          numRancho: null,
          fechaHora: fechaActual,
          idRancho: this.idRancho,
          nombreRancho: this.rancho.find(x => x.idRancho == this.idRancho).rancho
        };
        this.datosCosecha.push(datoRancho);
        localStorage.setItem('capturaFumigacion', JSON.stringify(this.datosCosecha));
      }
      this.navCont.navigateForward('fumigacion/'+this.idRancho+'/capturas');
  }

  verAplicacion(idAplicacion: string){
    this.navCont.navigateForward('fumigacion/'+this.idRancho+'/capturas/' +idAplicacion);
  }
  back(){
    this.navCont.navigateBack(``);
  }

}
