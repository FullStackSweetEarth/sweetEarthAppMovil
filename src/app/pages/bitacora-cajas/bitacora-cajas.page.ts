import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { RecursosService } from 'src/app/services/recursos.service';
import { environment } from 'src/environments/environment';

import { OverlayEventDetail } from '@ionic/core/components';
import { IonModal } from '@ionic/angular/common';
export interface IPlantillaCosechador {
  fecha: string;
  empleados: IEmpleados[];
}
interface IEmpleados {
  numEmpleado: string;
  nombre: string;
  totales: ITotales[];
  granTotal: number;
  rendimientos: IRendimientos[];
}
interface ITotales {
  idCultivo: number;
  cajas: number;
}
interface IRendimientos {
  idProgramaCosecha: number;
  cajas: ICajas[];
}
interface ICajas {
  idCultivo: number;
  cajas: number;
  fecha: string;
  hora: string;
  fecha_hora: string;
}

@Component({
  selector: 'app-bitacora-cajas',
  templateUrl: './bitacora-cajas.page.html',
  styleUrls: ['./bitacora-cajas.page.scss'],
})
export class BitacoraCajasPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  detallesModel = false;
  fecha: any;
  empleados: any[] = [];
  plantilla: IPlantillaCosechador;
  userSearch: string = '';
  cultivos: any;
  totales: ITotales[] = [];
  frambuesa = 'assets/imagenes/frambuesa.svg';
  zarzamora = 'assets/imagenes/zarzamora.svg';
  palabra = '';
  hoy: any;
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';

  isModalOpen = false;
  constructor(
    private _recursos: RecursosService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}
  ionViewDidEnter() {
    let datos = this._recursos
      .getDatosLocales('plantillaCosechadores')
      .find((d) => d.fecha === this.fecha);
    this.plantilla = datos ? datos : this.initDatos();
  }
  ngOnInit() {
    this.hoy = this._recursos.getFechaHoy().fecha;

    this.fecha = this.getFecha()
      ? this.getFecha()
      : this._recursos.getFechaHoy().fecha;
    this.empleados = this._recursos
      .getDatosLocales('empleados')
      .filter((d) => d.codigo !== null);
    this.setFechaCosecha(this.fecha);
    environment.fechaPagoAvance = this.fecha;
    this.cultivos = this._recursos.getDatosLocales('variedades');
    for (const cultivo of this.cultivos) {
      if (cultivo.id !== '3') {
        this.totales.push({
          idCultivo: cultivo.id,
          cajas: null,
        });
      }
    }
  }
  setFechaCosecha(fecha) {
    localStorage.setItem('fechaCosecha', fecha);
  }

  getFecha() {
    return localStorage.getItem('fechaCosecha');
  }
  initDatos() {
    const allPlantillas: IPlantillaCosechador[] = this._recursos
      .getDatosLocales('plantillaCosechadores')
      .filter((d) => d.fecha !== this.fecha);
    allPlantillas.push({
      fecha: this.fecha,
      empleados: [],
    });
    localStorage.setItem(
      'plantillaCosechadores',
      JSON.stringify(allPlantillas)
    );
    return {
      fecha: this.fecha,
      empleados: [],
    };
  }

  setOpen(isOpen: boolean) {
    this.detallesModel = isOpen;
  }

  continuar() {
    this.navCtrl.navigateForward(`bitacora-cajas/programa-cosecha`);
  }

  back() {
    this.navCtrl.navigateBack(``);
  }

  addEmpleado(empleado) {
    const numEmpleado = empleado.codigo ? empleado.codigo : empleado.clave;
    // Idnetificar si ya existe el empleado
    if (
      this.plantilla.empleados.find(
        (d) => d.numEmpleado + '' === numEmpleado + ''
      )
    ) {
      this._recursos.toastM('bottom', 'El empleado ya existe !!!', 3000);
    } else {
      let allPlantilla: any[] = this._recursos.getDatosLocales(
        'plantillaCosechadores'
      );
      allPlantilla = allPlantilla.filter((d) => d.fecha !== this.fecha);

      this.plantilla.empleados.push({
        numEmpleado: empleado.codigo ? empleado.codigo : empleado.clave,
        nombre: empleado.nombre,
        totales: this.totales,
        granTotal: 0,
        rendimientos: [],
      });
      allPlantilla.push(this.plantilla);
      localStorage.setItem(
        'plantillaCosechadores',
        JSON.stringify(allPlantilla)
      );
      this.userSearch = '';
      this._recursos.toastM(
        'bottom',
        'Empleado agregado exitosamente !!!',
        3000
      );
    }
  }
  actualizarPlantilla() {
    this.setFechaCosecha(this.fecha);
    let datos = this._recursos
      .getDatosLocales('plantillaCosechadores')
      .find((d) => d.fecha === this.fecha);
    this.plantilla = datos ? datos : this.initDatos();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss('el pepe', 'confirm');
  }

  setOpen2(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async deleteEmpleado(numEmpleado) {
    const alert = await this.alertController.create({
      header: `¿Está seguro que desea borrar el empleado ${numEmpleado}?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Si',
          cssClass: 'alert-button-confirm',
          handler: () => {
            // Eliminar empleado de lista
            this.plantilla.empleados = this.plantilla.empleados.filter(
              (d) => d.numEmpleado + '' !== numEmpleado
            );

            let allPlantilla: any[] = this._recursos.getDatosLocales(
              'plantillaCosechadores'
            );
            allPlantilla = allPlantilla.filter((d) => d.fecha !== this.fecha);
            allPlantilla.push(this.plantilla);

            localStorage.setItem(
              'plantillaCosechadores',
              JSON.stringify(allPlantilla)
            );
          },
        },
      ],
    });

    await alert.present();
  }
}
