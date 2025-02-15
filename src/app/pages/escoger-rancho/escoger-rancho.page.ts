/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AsyncService } from 'src/app/services/async.service';

import { AuthService } from '../../services/auth.service';
import { RecursosService } from 'src/app/services/recursos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-escoger-rancho',
  templateUrl: './escoger-rancho.page.html',
  styleUrls: ['./escoger-rancho.page.scss'],
})
export class EscogerRanchoPage implements OnInit {
  ranchos: any[] = [];
  id: string;
  idRancho: any;
  supervisores: any[] = [];
  idSupervisor: any;
  fecha: any;
  tipo: any;
  palabra = '';
  listaTipos = [
    { nombre: 'Actividad', id: 1, selected: 0 },
    { nombre: 'Cajas', id: 2, selected: 0 },
    { nombre: 'Horas', id: 3, selected: 0 },
    { nombre: 'Voleo', id: 4, selected: 0 }
    // ,{ nombre: 'Dia', id: 4, selected: 0 },
  ];
  listaEmpleados: any;
  allPlantillas: any;
  actividades: any;
  listaActActivas: any[] = [];
  listaProgramas: any[] = [];
  uid: string;
  f: string;
  listaProgramasHD: any[] = [];

  constructor(
    private _async: AsyncService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private _recursos: RecursosService
  ) {
    this.uid = localStorage.getItem('uid');
    environment.fechaPagoAvance = JSON.parse(
      localStorage.getItem('fechaPagoAvance')
    );
    this.f = environment.fechaPagoAvance;
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getData();
    this.fecha = this._recursos.getFechaHoy().fecha;
    this.allPlantillas = this._async.getAllDatos('plantillas');
    this.allPlantillas = this.allPlantillas.filter(
      (d) => d.fecha === environment.fechaPagoAvance
    );

    this.actividades = this._recursos.getDatosLocales('pActividades');
    this.actividades = this.actividades ? this.actividades : [];
  }

  getData() {
    setTimeout(() => {
      if (this._async.getData('ranchos').length > 0) {
        this.ranchos = this._async.getData('ranchos');
        for (const rancho of this.ranchos) {
          rancho.selecte = 0;
        }
      } else {
        this.getData();
      }
    }, 100);
  }

  asigbarRancho(id) {
    for (const rancho of this.ranchos) {
      rancho.selected = 0;
    }
    this.ranchos[id].selected = this.ranchos[id].selected === 0 ? 1 : 0;
    this.idRancho = this.ranchos[id].idRancho;
    if (this.id === '1') {
      this.navCtrl.navigateForward(`cosecha/${this.idRancho}`);
    } else if (this.id === '4') {
      this.navCtrl.navigateForward(`fumigacion/${this.idRancho}`);
    } else if (this.id == '6') {
      this.galeristas();
    } else if (this.id == '7') {
      if (this.tipo == 1) {
        this.navCtrl.navigateForward(`domingos/actividad/${this.idRancho}`);
      }
      this.supervisores = this._async.getData('supervisores2');
      for (const supervisor of this.supervisores) {
        supervisor.selecte = 0;
      }
    } else if (this.id === '8') {
      this.navCtrl.navigateForward(`programa-actividades/${this.idRancho}`);
    } else {
      this.supervisores = this._async.getData('supervisores2');
      for (const supervisor of this.supervisores) {
        supervisor.selecte = 0;
      }
    }
  }
  asignarTipo(id) {
    if (id == 1) {
      this.getProgramaCosechaUsuario();
    }
    if (id == 2) {
      this.getProgramaHorasDiasUsuario();
    }
    if (id == 3) {
      this.getProgramaVoleo();
    }
    if (id == 0) {
      this.navCtrl.navigateForward(`domingos/actividad`);
    }
    for (const tipo of this.listaTipos) {
      tipo.selected = 0;
    }
    this.listaTipos[id].selected = this.listaTipos[id].selected === 0 ? 1 : 0;
    this.tipo = this.listaTipos[id].id;
    if (id == 0) {
      this.obtenerActInict();
    }
  }

  asignarSupervisor(id) {
    const sup = this.supervisores.find((d) => Number(d.id) === Number(id));
    for (const supervisore of this.supervisores) {
      supervisore.selected = 0;
    }
    sup.selected = sup.selected === 0 ? 1 : 0;
    this.idSupervisor = id;

    if (this.id === '3') {
      this.navCtrl.navigateForward(
        `fichasv2/${this.idRancho}/${this.idSupervisor}`
      );
    } else if (this.id === '5') {
      this.navCtrl.navigateForward(
        `actividades/${this.idRancho}/${this.idSupervisor}`
      );
    } else if (this.id === '6') {
      this.navCtrl.navigateForward(`rendimiento/${this.idRancho}/${this.fecha}`);
    } else if (this.id === '7') {
      if (this.tipo === 3) {
        this.navCtrl.navigateForward(
          `domingos/horas/${this.idRancho}/${this.idSupervisor}`
        );
      } else if (this.tipo === 4) {
        this.navCtrl.navigateForward(
          `domingos/dia/${this.idRancho}/${this.idSupervisor}`
        );
      } else {
        this.navCtrl.navigateForward(
          `domingos/cosecha/${this.idRancho}/${this.idSupervisor}`
        );
      }
    } else {
      this.navCtrl.navigateForward(
        `horas-cosechadas/${this.idRancho}/${this.idSupervisor}`
      );
    }
  }
  galeristas() {
    this.navCtrl.navigateForward(`rendimiento/${this.idRancho}/${this.fecha}`);
  }

  back() {
    if (this.id + '' === '7') {
      this.navCtrl.navigateBack(`domingos/plantilla`);
      return;
    }
    this.navCtrl.navigateBack(`/`);
  }

  obtenerActInict() {
    const actividades = [];
    const actR = [];
    for (const empleado of this.allPlantillas) {
      for (const rendi of empleado.actividades.rendimientos) {
        if (!actividades.find((d) => d === rendi.idActividad)) {
          actividades.push(rendi.idActividad);
        }
      }
    }
    for (const act of actividades) {
      actR.push(this.actividades.find((d) => d.id + '' === act + ''));
    }
    this.listaActActivas = actR;
  }

  capturar(dat) {
    this.navCtrl.navigateForward(
      `/domingos/actividad/${dat.idRancho}/captura/${dat.id}`
    );
  }
  verTodasActividades() {
    this.navCtrl.navigateForward(`domingos/actividad/${this.idRancho}`);
  }

  getProgramaCosechaUsuario() {
    this.listaProgramas = this._recursos.getDatosLocales('pCosecha');
    this.listaProgramas = this.listaProgramas
      ? this.listaProgramas.filter(
          (d) => d.uID + '' === this.uid + '' && d.fecha === this.f
        )
      : [];
    if (this.listaProgramas.length == 1) {
      this.capturarCajas(this.listaProgramas[0]);
    }
  }
  getProgramaHorasDiasUsuario() {
    let especial = 0;
    this.listaProgramasHD = this._recursos.getDatosLocales('pHoraDia');
    this.listaProgramasHD = this.listaProgramas
      ? this.listaProgramasHD.filter(
          (d) => d.uID + '' === this.uid + '' && d.fecha === this.f
        )
      : [];
    if (this.listaProgramasHD.length == 0) {
      this.listaProgramasHD =
        this._recursos.getDatosLocales('pHoraDiaEspecial');
      especial =  1
      this.listaProgramasHD = this.listaProgramas
        ? this.listaProgramasHD.filter(
            (d) => d.uID + '' === this.uid + '' && d.fecha === this.f
          )
        : [];
    }
    if (this.listaProgramasHD.length == 1 || especial == 1) {
      this.capturaHorasDia(this.listaProgramasHD[0], especial);
    }
  }

  getProgramaVoleo(){

    this.navCtrl.navigateForward(
      `domingos/voleo/${this.f}`
    );
  }

  capturarCajas(dat) {
    this.navCtrl.navigateForward(
      `domingos/cosecha/${dat.idRancho}/${dat.idSupervisor}`
    );
  }
  capturaHorasDia(dat, especial = null) {
    setTimeout(() => {
      if (this.tipo == 4) {
        this.navCtrl.navigateForward(
          `domingos/dia/${dat.idRancho}/${dat.idSupervisor}/${especial}`
        );
      } else {
        this.navCtrl.navigateForward(
          `domingos/horas/${dat.idRancho}/${dat.idSupervisor}/${especial}`
        );
      }
    }, 100);
  }
}
