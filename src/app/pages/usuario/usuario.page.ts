/* eslint-disable no-var */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { RecursosService } from 'src/app/services/recursos.service';
export interface IEmpleado {
  clave: string;
  codigo: string;
  curp: string;
  idEstatus: string;
  idsupervisor: string;
  nombre: string;
  numEmpleado: string;
  rancho: string;
  paterno: string;
  materno: string;
}
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  palabra = '';
  presentingElement: any;
  empleado: IEmpleado;
  empleados: any[] = [];
  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private _recursos: RecursosService,
  ) {}

  back() {
    this.navCtrl.navigateBack(`/`);
  }
  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.empleados = this._recursos.ordernarAsc(
      this._recursos.getDatosLocales('empleados'),
      'numEmpleado'
    );
    this.initVar();
  }

  initVar() {
    this.empleado = {
      clave: null,
      codigo: null,
      curp: null,
      idEstatus: null,
      idsupervisor: null,
      nombre: null,
      numEmpleado: null,
      rancho: null,
      paterno: null,
      materno: null,
    };
  }

  async addExterno() {
    if (this.esCURPValida(this.empleado.curp)) {
      this.registro();
      
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        subHeader:'CURP no válida',
        message: '¿Desea continuar sin agregár CURP al empleado?',
        buttons: [{
          text: 'No',
          handler: () => {
          },
        },{
          text: 'Si',
          handler: () => {
            this.registro();
          },
        }],
      });
    await alert.present();

    }
  }

  registro() {
    this.empleado.clave = 'EXT-' + (Math.floor(Math.random() * 90000) + 10000);
    this.empleado.numEmpleado = this.empleado.clave;
    this.empleado.nombre +=
      ' ' + this.empleado.paterno + ' ' + this.empleado.materno;
    this.empleado.idEstatus = '1';
    this.empleado.idsupervisor = '1';
    this.empleado.rancho = 'Sin Rancho';
    this.empleados = this.empleados.filter(
      (d) => d.curp !== this.empleado.curp
    );
    this.empleados.push(this.empleado);
    localStorage.setItem('empleados', JSON.stringify(this.empleados));
    this._recursos.toastM('bottom','Registro Exitoso',3000);
    this.initVar();
  }
  esCURPValida(curp) {
    var re = /^[A-Z]{4}\d{6}[H,M][A-Z]{5}[A-Z0-9]\d$/;
    return re.test(curp);
  }
}
