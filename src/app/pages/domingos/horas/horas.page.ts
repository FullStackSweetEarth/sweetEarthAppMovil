/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AsyncService } from 'src/app/services/async.service';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { RecursosService } from 'src/app/services/recursos.service';
import { environment } from 'src/environments/environment';
interface IPreciosEspeciales{
  precioNormalAsociado: number;
  precioExtraAsociado: number;
  precioDiaAsociado: number;
  precioNormalExterno: number;
  precioExtraExterno: number;
  precioDiaExterno: number;
  horasTotalesAsociado: number;
  horasTotalesExtras: number;
  horaF?: string;
}
@Component({
  selector: 'app-horas',
  templateUrl: './horas.page.html',
  styleUrls: ['./horas.page.scss'],
})
export class HorasPage implements OnInit {
  plantilla: any;
  plantillaAux: any[];
  allPlantillas: any[];
  palabra = '';
  darkTheme: NgxMaterialTimepickerTheme;
  idRancho: string;
  idSupervisor: string;
  rancho: any;
  supervisor: any;
  fecha: any;
  precios: any;
  f: string;
  especial: string;
  preciosEspeciales: IPreciosEspeciales;

  constructor(
    private navCtrl: NavController,
    private _async: AsyncService,
    private activatedRoute: ActivatedRoute,
    private _recursos: RecursosService
  ) {
    environment.fechaPagoAvance = localStorage.getItem('fechaPagoAvance');
    this.f = environment.fechaPagoAvance;
  }

  back() {
    this.navCtrl.navigateBack(`/escoger-rancho/7`);
  }
  ngOnInit() {
    this.preciosEspeciales = {
      precioDiaAsociado:null,
      precioDiaExterno:null,
      precioExtraAsociado:null,
      precioExtraExterno:null,
      precioNormalAsociado:null,
      precioNormalExterno:null,
      horasTotalesAsociado:0,
      horasTotalesExtras:0
    }
    environment.fechaPagoAvance = JSON.parse(
      localStorage.getItem('fechaPagoAvance')
    );

    // this.calcularHorasT();
    this.idRancho = this.activatedRoute.snapshot.paramMap.get('idRancho');
    this.idSupervisor = this.activatedRoute.snapshot.paramMap.get('idSupervisor');
    this.especial = this.activatedRoute.snapshot.paramMap.get('especial');
    this.fecha = environment.fechaPagoAvance;
    // Definir dos precios si es dia especial
    if(this.especial+'' === '1'){
      let especialInfo = this._async
      .getData('pHoraDiaEspecial')
      .filter(
        (d) =>
          d.idRancho === this.idRancho &&
          d.idSupervisor === this.idSupervisor &&
          d.fecha === this.fecha
      )
      console.log(especialInfo);
      let i = 0;
      for (const hora of especialInfo) {
        if(i == 0){
          this.preciosEspeciales.precioNormalAsociado = hora.hora;
          this.preciosEspeciales.precioExtraAsociado = hora.extras;
          this.preciosEspeciales.precioDiaAsociado= hora.dia;
          this.preciosEspeciales.horasTotalesAsociado= hora.horasTotales;
          this.preciosEspeciales.horaF= hora.horaF;
        }else{
          this.preciosEspeciales.precioNormalExterno = hora.hora;
          this.preciosEspeciales.precioExtraExterno = hora.extras;
          this.preciosEspeciales.precioDiaExterno = hora.dia;
          this.preciosEspeciales.horasTotalesExtras= hora.horasTotales;
          this.preciosEspeciales.horaF= hora.horaF;
        }
        i++;
      }
      // Nueva lógica
    }else{
      // obtenerPrecio
      this.precios = this._async
        .getData('pHoraDia')
        .find(
          (d) =>
            d.idRancho === this.idRancho &&
            d.idSupervisor === this.idSupervisor &&
            d.fecha === this.fecha
        );
      this.precios = this.precios ? this.precios.hora : 0;
      // obtenerPrecio
    }

    this.rancho = this._async
      .getData('ranchos')
      .find((d) => d.idRancho === this.idRancho).rancho;
    this.supervisor = this._async
      .getData('supervisores2')
      .find((d) => d.id === this.idSupervisor).nombre;

    this.darkTheme = {
      container: {
        bodyBackgroundColor: '#424242',
        buttonColor: '#fff',
      },
      dial: {
        dialBackgroundColor: '#555',
      },
      clockFace: {
        clockFaceBackgroundColor: '#555',
        clockHandColor: '#9fbd90',
        clockFaceTimeInactiveColor: '#fff',
      },
    };
    this.getEmpleados();
  }

  getEmpleados() {
    this.plantilla = this._async.getColeccionDatos(
      'plantillas',
      environment.fechaPagoAvance,
      'fecha'
    );
    for (const p of this.plantilla) {
      p.show = false;
    }
    this.plantillaAux = this._async.getColeccionDatos(
      'plantillas',
      environment.fechaPagoAvance,
      'fecha'
    );
    this.allPlantillas = this._async.getAllDatos('plantillas');
    this.allPlantillas = this.allPlantillas.filter(
      (d) => d.fecha !== environment.fechaPagoAvance
    );
    this._recursos.ordernarAsc(this.plantilla, 'nombre');
    this._recursos.ordernarAsc(this.allPlantillas, 'nombre');
    this._recursos.ordernarAsc(this.plantillaAux, 'nombre');
  }

  calcularHorasT(d = null) {
    setTimeout(() => {
      if (d.porHora.horaI !== null && d.porHora.horaF !== null) {
        if(d.porHora.horaI > d.porHora.horaF){
          this._recursos.alertaNoti("Error","Verifique las horas que está definiendo"
            ,"La hora de inicio tiene que ser menor que la hora final !!!!",'custom-alert-header-error')
          return;
        }
        const fecha1 = moment(
          `1998-08-20 ${d.porHora.horaI}:00`,
          'YYYY-MM-DD HH:mm:ss'
        );
        const fecha2 = moment(
          `1998-08-20 ${d.porHora.horaF}:00`,
          'YYYY-MM-DD HH:mm:ss'
        );
        // console.log(d, 'EMPLEADO');
        d.porHora.horas = fecha2.diff(fecha1, 'm') / 60;
        // Calcular horas Normales y extras
        let p =0, normales  = 0,extras=0, pExtras=0;
        if(this.preciosEspeciales.horaF>d.porHora.horaI){

           normales = this.especial+'' === '1'?(d.codigo?(d.porHora.horas>this.preciosEspeciales.horasTotalesAsociado?Number(this.preciosEspeciales.horasTotalesAsociado):d.porHora.horas) 
          : (d.porHora.horas>this.preciosEspeciales.horasTotalesExtras?Number(this.preciosEspeciales.horasTotalesExtras):d.porHora.horas)):(d.porHora.horas);
          
          extras = this.especial+'' === '1'?(d.codigo?(d.porHora.horas>this.preciosEspeciales.horasTotalesAsociado?Number(d.porHora.horas)-Number(this.preciosEspeciales.horasTotalesAsociado):0) 
          : (d.porHora.horas>this.preciosEspeciales.horasTotalesExtras?Number(d.porHora.horas)-Number(this.preciosEspeciales.horasTotalesExtras):0)):0;
          p = (this.especial+'' === '1'?(d.codigo?this.preciosEspeciales.precioNormalAsociado:this.preciosEspeciales.precioNormalExterno):(this.precios));
          pExtras =(this.especial+'' === '1'?(d.codigo?this.preciosEspeciales.precioExtraAsociado:this.preciosEspeciales.precioExtraExterno):(0));
        }else{
          p = 0;
          extras = Number(d.porHora.horas);
          pExtras =(this.especial+'' === '1'?(d.codigo?this.preciosEspeciales.precioExtraAsociado:this.preciosEspeciales.precioExtraExterno):(0));

        }
        d.porHora.paga = (normales * p) + (extras * pExtras);
        d.porHora.precio = p;
        d.porHora.idRancho = this.idRancho;
        d.porHora.idSupervisor = this.idSupervisor;
        this.allPlantillas = this.allPlantillas.filter(
          (r) => r.fecha !== this.fecha
        );
        for (const iterator of this.plantilla) {
          this.allPlantillas.push(iterator);
        }
        localStorage.setItem('plantillas', JSON.stringify(this.allPlantillas));
        this.getEmpleados();
      }
    }, 100);
  }
}
