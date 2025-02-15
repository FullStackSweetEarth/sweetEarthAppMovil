/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dia',
  templateUrl: './dia.page.html',
  styleUrls: ['./dia.page.scss'],
})
export class DiaPage implements OnInit {
  palabra = '';
  idRancho: string;
  idSupervisor: string;
  rancho: any;
  supervisor: any;
  plantilla: any[];
  plantillaAux: any[];
  allPlantillas: any[];
  fecha: any;
  especial: number = 0;
  constructor(
    private navCtrl: NavController,
    private _async: AsyncService,
    private activatedRoute: ActivatedRoute,
    private _recursos: RecursosService
  ) {
  }

  back() {
    this.navCtrl.navigateBack(`/escoger-rancho/7`);
  }
  ngOnInit() {
    environment.fechaPagoAvance =  JSON.parse( localStorage.getItem('fechaPagoAvance'));

    this.idRancho = this.activatedRoute.snapshot.paramMap.get('idRancho');
    this.idSupervisor =
      this.activatedRoute.snapshot.paramMap.get('idSupervisor');
      this.especial =Number(
        this.activatedRoute.snapshot.paramMap.get('especial'));
    this.fecha = environment.fechaPagoAvance;

    this.rancho = this._async
      .getData('ranchos')
      .find((d) => d.idRancho === this.idRancho).rancho;
    this.supervisor = this._async
      .getData('supervisores2')
      .find((d) => d.id === this.idSupervisor).nombre;
    this.getEmpleados();
  }
  getEmpleados() {
    this.plantilla = [];
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
    this._recursos.ordernarAsc(this.plantilla,'nombre');
    this._recursos.ordernarAsc(this.allPlantillas,'nombre');
    this._recursos.ordernarAsc(this.plantillaAux,'nombre');
  }
  asignarPaga(empleado) {
    if (empleado.porDia.idRancho === this.idRancho && empleado.porDia.idSupervisor === this.idSupervisor) {
      empleado.porDia.idRancho = 0;
      empleado.porDia.idSupervisor = 0;
      empleado.porDia.paga = 0;
    }else{
      empleado.porDia.idRancho = this.idRancho;
      empleado.porDia.idSupervisor = this.idSupervisor;
      let precios = null;
      if(Number(this.especial) > 0){
        precios = this._async
        .getData('pHoraDiaEspecial')
        .find(
          (d) =>
            d.idRancho === this.idRancho &&
            d.idSupervisor === this.idSupervisor &&
            d.fecha === this.fecha
        );
      }else{
        precios = this._async
          .getData('pHoraDia')
          .find(
            (d) =>
              d.idRancho === this.idRancho &&
              d.idSupervisor === this.idSupervisor &&
              d.fecha === this.fecha
          );

      }
      empleado.porDia.paga = precios ? precios.dia : 0;
    }
    this.allPlantillas = this.allPlantillas.filter(
      (d) => d.fecha !== this.fecha
    );
    for (const iterator of this.plantilla) {
      this.allPlantillas.push(iterator);
    }
    localStorage.setItem('plantillas', JSON.stringify(this.allPlantillas));
    this.getEmpleados();
  }
}
