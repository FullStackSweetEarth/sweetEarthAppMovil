import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';

@Component({
  selector: 'app-captura-rendimintos',
  templateUrl: './captura-rendimintos.page.html',
  styleUrls: ['./captura-rendimintos.page.scss'],
})
export class CapturaRendimintosPage implements OnInit {
  actividad: any;
  empleados: any[] = [];
  palabra;
  palabra2;
  disponibles = [];
  tuneles: any[] = [];
  horaInicio = null;
  horaFin = null;
  isModalOpen: boolean = false;
  empleadosAux: any[];
  isModalOpen2 = false;

  async canDismiss(data?: undefined, role?: string) {
    return role !== 'gesture';
  }

  constructor(
    private _asyn: AsyncService,
    private navCtrl: NavController,
    private _recursos: RecursosService,
    private alertController:AlertController
  ) {}

  ngOnInit() {
    setTimeout(async () => {
      
      this.actividad = this._asyn.getDatas('metaActividades');
      // Preguntar si es Sector o Rancho
      // console.log('meta', this.actividad);
      this.empleados = this._asyn.getDatas('rendimientosActividades');
      this.empleados =
        this.empleados.length > 0
          ? (this.empleados.filter((d) => d.id == this.actividad.idActPro).length>0?this.empleados.filter((d) => d.id == this.actividad.idActPro):this.addEmpleadosAsignados())
          : this.addEmpleadosAsignados();
          for (const empleado of this.empleados) {
            empleado.show = false;
          }
      console.log('empleados', this.empleados);
      this.empleadosAux = this._asyn.getAllDatos('empleados');
      this.saveLocalData();
      this.getDisponibles();
    }, 300);
  }
  back() {
    this.navCtrl.navigateForward(`actividades`);
  }
  addEmpleadosAsignados() {
    
    if(this.actividad.clasificacion+'' === 'SECTOR' || this.actividad.clasificacion+'' === 'RANCHO'){
      this.isModalOpen2 = true;
      return [];
    }else{
      
      // alert('entró');
      // Obtener empleado que sean del supervisor y retornar la lista de empleados
      let empleado = this._asyn.getAllDatos('empleados');
      empleado = empleado.filter(
        (d) => d.idsupervisor === this.actividad.idSupervisor
      );
      for (const emp of empleado) {
        emp.id = this.actividad.idActPro;
        emp.idPrograma = this.actividad.idPrograma;
        emp.fecha = this.actividad.fecha;
        emp.horaInicio = null;
        emp.horaFin = null;
        emp.clasificacion = this.actividad.clasificacion;
        emp.rendimientos = [
          {
            idTunel: null,
            idTunelAaux: null,
            tunel:'',
            numSurcos: 0,
            pago: 0,
          },
        ];
      }
      console.log('empleados s', empleado, 'clave', this.actividad.idSupervisor);
      return empleado;
    }
  }
  
  cargarPlantilla() {
    
      // Obtener empleado que sean del supervisor y retornar la lista de empleados
      let empleado = this._asyn.getAllDatos('empleados');
      empleado = empleado.filter(
        (d) => d.idsupervisor === this.actividad.idSupervisor
      );
      for (const emp of empleado) {
        emp.id = this.actividad.idActPro;
        emp.idPrograma = this.actividad.idPrograma;
        emp.fecha = this.actividad.fecha;
        emp.horaInicio = null;
        emp.horaFin = null;
        emp.clasificacion = this.actividad.clasificacion;
        emp.rendimientos = [
          {
            idTunel: null,
            idTunelAaux: null,
            tunel:'',
            numSurcos: 0,
            pago: 0,
          },
        ];
      }
      // console.log('empleados s', empleado, 'clave', this.actividad.idSupervisor);
      this.empleados =  empleado;
      
      this.saveLocalData();
      this.getDisponibles();
  }


  saveLocalData() {
    // console.log(this.empleados, 'rrrrr');
    // return;
    let todos: any[]  =this._asyn.getDatas('rendimientosActividades');
    todos = todos.filter( d => d.id != this.actividad.idActPro+'');
    for (const empleado of this.empleados) {
      // empleado.show = false;
      todos.push(empleado);
    }
    localStorage.setItem(
      'rendimientosActividades',
      JSON.stringify(todos)
    );
  }

  getDisponibles() {
    let ranchos = this._asyn.getAllDatos('ranchos');
    let sectores = ranchos.find(
      (d) => d.idRancho + '' === this.actividad.idRancho + ''
    ).sectores;
    this.tuneles = sectores.find(
      (d) => d.idSector + '' === this.actividad.idSector
    ).tuneles;
    for (const tunel of this.tuneles) {
      tunel.restantes = Number(tunel.numsurcos);
    }
    console.log(
      sectores.find((d) => d.idSector + '' === this.actividad.idSector).tuneles,
      this.actividad.idRancho,
      'rancho'
    );
    // Obtener rendimientos de empleados y reduc la cantidad de surcos que tiene cada tunel
    // y esta diferencia guardarla enl avariable de sectores en un atriduto de restantes.
    // Obtener tuneles rendimiento
    for (const empleado of this.empleados) {
      for (const rendimiento of empleado.rendimientos) {
        if (rendimiento.idTunel > 0) {
          if (
            this.tuneles.find((d) => d.id + '' === rendimiento.idTunel + '')
          ) {
            this.tuneles.find(
              (d) => d.id + '' === rendimiento.idTunel + ''
            ).restantes -= rendimiento.numSurcos;
          }
        }
      }
    }
  }

  verificarTunel(idTunel) {
    if (!(this.tuneles.find((d) => d.id + '' === idTunel + '').restantes > 0)) {
      this._recursos.alertaNoti(
        'Error',
        'Tunel sin surcos',
        'El tunel no cuenta con surcos, corrobore su información antes de capturar!!',
        'custom-alert-header-error'
      );
    }
  }

  addRendimiento(data, rendimientos) {
    // Agregar verificaciones comprobar que el registro que se está realizando es factible.
    // es decir. si se definen 4 surcos par aun tunel que solo tiene 3 se deberá imdir el registro
    // Recalcular disponivilidad
    this.getDisponibles();
    if (
      !(
        this.tuneles.find((d) => d.id + '' === data.idTunel + '').restantes >= 0
      )
    ) {
      this._recursos.alertaNoti(
        'Error',
        'Tuneles insuficientes',
        'Esta rebasando la cantidad de surcos disponibles. Solo están disponibles: ' +
          (this.tuneles.find((d) => d.id + '' === data.idTunel + '').restantes +
            data.numSurcos),
        'custom-alert-header-error'
      );
      data.numSurcos = 0;
    this.getDisponibles();

      return;
    }
    data.tunel = this.tuneles.find((d) => d.id + '' === data.idTunel + '').tunel;
    data.idTunelAaux = data.idTunel;
    if (rendimientos[rendimientos.length - 1].numSurcos !== 0) {
      rendimientos.push({
        idTunel: null,
        idTunelAaux: null,
        tunel:'',
        numSurcos: 0,
        pago: 0,
      });
    }
    this.saveLocalData();
  }
  delete(rendimeintos, index) {
    this.getDisponibles();
    rendimeintos.splice(index, 1);
    this.saveLocalData();
  }
  updateHoraEmpleado(data) {
    if (!data.horaInicio || !data.horaFin) {
      return;
    }
    if (data.horaInicio > data.horaFin) {
      this._recursos.alertaNoti(
        'Error',
        'Horario erroneo',
        'La hora de inicio tiene que ser menor a la final !!!',
        'custom-alert-header-error'
      );
      return;
    }
    this.saveLocalData();
  }

  asignaHorariosAll() {
    if (!this.horaInicio || !this.horaFin) {
      return;
    }
    // alert('pruebas')
    if (this.horaInicio > this.horaFin) {
      this._recursos.alertaNoti(
        'Error',
        'Horario erroneo',
        'La hora de inicio tiene que ser menor a la final !!!',
        'custom-alert-header-error'
      );
      return;
    }
    for (const empleado of this.empleados) {
      empleado.horaInicio = this.horaInicio;
      empleado.horaFin = this.horaFin;
    }
    this.saveLocalData();
  }
  setOpen2(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  addEmpleado(empleado){
    let numEmpleado = empleado.clave?empleado.clave: empleado.codigo;
    if(this.empleados.find(d => d.clave+'' === numEmpleado+'' || d.codigo === numEmpleado+'')){
      this._recursos.toastM('bottom','El empleado ya esta en la lista de rendimeintos',2000);
      return;
    }
    empleado.id = this.actividad.idActPro;
    empleado.idPrograma = this.actividad.idPrograma;
    empleado.horaInicio = null;
    empleado.horaFin = null;
    empleado.fecha = this.actividad.fecha;
    empleado.clasificacion = this.actividad.clasificacion;

    empleado.rendimientos = [
      {
        idTunel: null,
        idTunelAaux: null,
        tunel:'',
        numSurcos: 0,
        pago: 0,
      },
    ];
    this.empleados.push(empleado);
    this.saveLocalData();
    this._recursos.toastM('bottom','El empleado se agregó con éxito',2000);

  }
  async deleteEmpleado(index, numEmpleado){
    
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
            this.empleados.splice(index, 1);
            this.saveLocalData();
          },
        },
      ],
    });

    await alert.present();
  }
}
