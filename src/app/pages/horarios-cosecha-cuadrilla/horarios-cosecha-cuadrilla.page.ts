import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, NavController } from '@ionic/angular';
import { RecursosService } from 'src/app/services/recursos.service';

import { OverlayEventDetail } from '@ionic/core/components';
import {
  IHorariosCosechaCuadrilla,
  IEmpleadoCuadrilla,
} from 'src/app/interfaces/horariosCosecha';

@Component({
  selector: 'app-horarios-cosecha-cuadrilla',
  templateUrl: './horarios-cosecha-cuadrilla.page.html',
  styleUrls: ['./horarios-cosecha-cuadrilla.page.scss'],
})
export class HorariosCosechaCuadrillaPage implements OnInit {
  detallesCuadrillas: IHorariosCosechaCuadrilla;
  fecha: string;
  isModalOpen: boolean;
  palabra: string;
  empleados: any;
  empleadosAux: any;
  @ViewChild(IonModal) modal!: IonModal;
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  modal2 = true;
  empleadosCuadrilla: IEmpleadoCuadrilla[];
  uid: string;
  idSupervisor: any;
  hoy: string;

  @ViewChild('header', { static: false }) header!: ElementRef;
  constructor(
    private _recursos: RecursosService,
    private alertController: AlertController,
        private navCtrl: NavController
  ) {}

  ionViewDidEnter() {
    setTimeout(() => {
      const header = document.querySelector('ion-header') as HTMLElement;
      if (header) {
        const headerHeight = header.offsetHeight;
        console.log("Altura del header:", headerHeight);
        document.documentElement.style.setProperty('--header-height', `${headerHeight+280}px`);
        document.documentElement.style.setProperty('--header-height-2', `${headerHeight+110}px`);
      } else {
        console.error("No se encontró el ion-header en el DOM.");
      }
    }, 100); // Pequeño delay para asegurar que se renderiza
  }

  ngOnInit() {
    
    this.uid = localStorage.getItem('uid');
    if (
      this._recursos
        .getDatosLocales('supervisores2')
        .find((d) => d.uID + '' === this.uid)
    ) {
      this.idSupervisor = this._recursos
        .getDatosLocales('supervisores2')
        .find((d) => d.uID + '' === this.uid).id;
    } else {
      this.idSupervisor = 0;
    }

    this.empleados = this._recursos.getDatosLocales('empleados');
    this.empleadosAux = this._recursos.getDatosLocales('empleados');
    this.hoy = this._recursos.getFechaHoy().fecha;
    this.fecha = this._recursos.getFechaHoy().fecha;
    this.changueDate();
  }

  setOpen2(isOpen: boolean) {
    alert('setOpen2');
    this.isModalOpen = isOpen;
  }
  verificar() {
    console.log('verificar');
  }
  changueDate() {
    this.detallesCuadrillas = this._recursos
      .getDatosLocales('bitacoraHorariosCuadrillas')
      .find(
        (d) =>
          d.idSupervisor + '' === this.idSupervisor + '' &&
          d.fecha + '' === this.fecha + ''
      );
    if(!this.detallesCuadrillas){
      this.detallesCuadrillas = this.createCuadrilla();
      this.save();
    }
    for (const cuadrilla of this.detallesCuadrillas.cuadrillas) {
      cuadrilla.showInfo = false;
    }
  }
  

  createCuadrilla():IHorariosCosechaCuadrilla{
     // Filtrar los datos del supervisor
     const datosSupervisor = this._recursos
     .getDatosLocales('bitacoraHorariosCuadrillas')
     .filter(
       (d) =>
         d.idSupervisor + '' === this.idSupervisor + '' 
     );

     const fechasOrdenadas = datosSupervisor
        .map(d => new Date(d.fecha)) // Convertir fechas a objetos Date
        .sort((a, b) => b.getTime() - a.getTime()); // Ordenar por fecha

    // Encontrar la fecha más reciente que no sea la fecha buscada
    const fechaMasReciente = fechasOrdenadas.find(f => f.toISOString().split('T')[0] !== this.fecha);

    // Obtener las cuadrillas de la fecha más reciente
    const cuadrillasMasRecientes: IHorariosCosechaCuadrilla = datosSupervisor.find(d => d.fecha === fechaMasReciente.toISOString().split('T')[0])
    if(cuadrillasMasRecientes){
      cuadrillasMasRecientes.fecha = this.fecha;
      cuadrillasMasRecientes.idSupervisor = this.idSupervisor;
      for (const cuadrilla of cuadrillasMasRecientes.cuadrillas) {
        cuadrilla.sectores = [];
        for (const empleado of cuadrilla.empleado) {
          empleado.incidencias = [];
        }
      }
    }
    return cuadrillasMasRecientes?cuadrillasMasRecientes :{
      cuadrillas:[
        {
          empleado:[],
          nombre:null,
          sectores:[],
          palabra:null,
          showInfo:null
        }
      ],
      fecha: this.fecha+'',
      idSupervisor: this.idSupervisor
    };
  }

  save() {
    let allData = this._recursos
      .getDatosLocales('bitacoraHorariosCuadrillas')
      .filter(
        (d) =>
          d.idSupervisor + '-' + d.fecha + '' !==
          this.idSupervisor + '-' + this.fecha + ''
      );
    allData.push(this.detallesCuadrillas);
    localStorage.setItem('bitacoraHorariosCuadrillas', JSON.stringify(allData));
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.modal2 = false;
    setTimeout(() => {
      this.modal2 = true;
    }, 300);
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      this.message = `Hello, ${event.detail.data}!`;
    }
  }
  openAddEmp(empleados) {
    this.modal2 = true;
    this.empleadosCuadrilla = empleados;
    document.getElementById('addEmp').click();
    document.getElementById('addEmp').click();
    // this.modal.present();
  }

  addEmpleado(emp) {
    let empleadoExiste = 0;
    for (const cuadrilla of this.detallesCuadrillas.cuadrillas) {
      if (
        cuadrilla.empleado.find(
          (e) => e.numEmpleado + '' === emp.numEmpleado + ''
        )
      ) {
        empleadoExiste++;
      }
      
    }
    if (
      empleadoExiste >0
    ) {
      this._recursos.toastM(
        'bottom',
        'El empleado ya ha sido agregado!!!',
        2000
      );
      return;
    }emp.bloqueado = false;
    emp.incidencias = [];
    this.empleadosCuadrilla.push(emp);
    this._recursos.toastM('bottom', 'El empleado agregado con exito!!!', 2000);

    this.save();
  }

  async deleteEmpleado(numEmpleado, cuadrilla) {
    const alert = await this.alertController.create({
      header: '¿Está seguro que desea borrar al empleado?',
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
            // Filtrar el empleado de la cuadrilla
            cuadrilla.empleado = cuadrilla.empleado.filter(
              (e) => e.numEmpleado + '' !== numEmpleado + ''
            );

            // // Actualizar la lista de empleados en la cuadrilla
            // this.empleadosCuadrilla = cuadrilla.empleado;

            // Guardar los cambios
            this.save();
          },
        },
      ],
    });

    await alert.present();
  }

  setName(nombre, index) {
    let cuatrilla = [...this.detallesCuadrillas.cuadrillas];

    // Eliminar el registro en la posición 1 del nuevo array
    cuatrilla.splice(index, 1);
    if (cuatrilla.find((d) => d.nombre + '' === nombre + '')) {
      this._recursos.alertaNoti(
        'Error',
        'Nombre de cuadrilla existente',
        'El nombre que intentas definir ya está asignado, por favor defina uno nuevo!!',
        'custom-alert-header-error'
      );
      this.changueDate();
      return;
    }
    this.save();
  }

  addCuadrilla() {
    this.detallesCuadrillas.cuadrillas.push({
      empleado: [],
      nombre: null,
      sectores: [],
      palabra: null,
      showInfo: null,
    });
    setTimeout(() => {
      
      const container = document.getElementById('infoCuadrilla');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  async deleteCuadrilla(nombre){
    
    const alert = await this.alertController.create({
      header: '¿Está seguro que desea borrar toda la cuadrilla?',
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
            // Filtrar el empleado de la cuadrilla
            this.detallesCuadrillas.cuadrillas = this.detallesCuadrillas.cuadrillas.filter(d => d.nombre+'' !== nombre+'');

            // Guardar los cambios
            this.save();
          },
        },
      ],
    });

    await alert.present();
  }
  addSector(cuadrilla){
    this.navCtrl.navigateForward(`horarios-cosecha-cuadrilla/capurar-horarios/${this.fecha}/${this.idSupervisor}/${cuadrilla}`);
  }

  addIncidnecia(cuadrilla, numEmpleado){
    
    this.navCtrl.navigateForward(`horarios-cosecha-cuadrilla/capurar-incidencias/${this.fecha}/${this.idSupervisor}/${cuadrilla}/${numEmpleado}`);

  }
  
  back() {
    
    for (const cuadrilla of this.detallesCuadrillas.cuadrillas) {
      cuadrilla.showInfo = false;
    }
    this.save();
    this.navCtrl.navigateForward(``);
  }
}
