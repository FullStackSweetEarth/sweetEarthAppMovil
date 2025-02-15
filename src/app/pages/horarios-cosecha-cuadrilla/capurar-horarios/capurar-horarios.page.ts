import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import {
  ICuadrilla,
  IHorariosCosechaCuadrilla,
  ISectsCuadrilla,
} from 'src/app/interfaces/horariosCosecha';
import { IHorarioCosecha } from 'src/app/interfaces/papeleta';
import { RecursosService } from 'src/app/services/recursos.service';

@Component({
  selector: 'app-capurar-horarios',
  templateUrl: './capurar-horarios.page.html',
  styleUrls: ['./capurar-horarios.page.scss'],
})
export class CapurarHorariosPage implements OnInit {
  fecha;
  idSupervisor: string;
  cuadrilla: string;
  cuadrillaDetalles: ICuadrilla;
  horaInicio: string;
  horaFin: string;
  registro: ISectsCuadrilla;
  listaRanchos: any[] = [];
  listaSectores: any[] = [];
  detallesCuadrillas: IHorariosCosechaCuadrilla;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _recursos: RecursosService,
    private navCtrl: NavController,
        private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.fecha = this.activatedRoute.snapshot.paramMap.get('fecha');
    this.listaRanchos = this._recursos.getDatosLocales('ranchos');
    this.idSupervisor = this.activatedRoute.snapshot.paramMap.get('idSupervisor');
    this.cuadrilla = this.activatedRoute.snapshot.paramMap.get('cuadrilla');
    this.getDatos();
    this. initVar();
  }
  getDatos(){
    this.detallesCuadrillas = this._recursos
    .getDatosLocales('bitacoraHorariosCuadrillas')
    .find(
      (d) =>
        d.idSupervisor + '' === this.idSupervisor + '' &&
        d.fecha + '' === this.fecha + ''
    );
  this.cuadrillaDetalles = this.detallesCuadrillas.cuadrillas.find(
    (d) => d.nombre + '' === this.cuadrilla
  )
  }

  initVar() {
    this.registro = {
      horaFin: null,
      horaInicio: null,
      idPlantacion: null,
      idRancho: null,
    };
  }

  getSetores(){
    this.listaSectores = this.listaRanchos.find(d => d.idRancho+'' === this.registro.idRancho+'').sectores
  }

  back() {
    this.navCtrl.navigateForward(`horarios-cosecha-cuadrilla`);
  }
  validarHora(){
    if(!this.registro.horaInicio || !this.registro.horaFin){
      return;
    }
    if(this.registro.horaInicio > this.registro.horaFin){
      this._recursos.alertaNoti(
        'Error',
        'Horario mal definidas',
        'La hora de inicio tiene que ser menor que la final. Pon atención al seleccionar la hora e intenta de nuevo!!',
        'custom-alert-header-error'
      );
      return;
    }
  }
  addSector(){
    if(!this.registro.horaInicio || !this.registro.horaFin){
      this._recursos.alertaNoti(
        'Error',
        'Horario no definidas',
        'El horario es obligatorio, no puedes dejar el registro sin estos datos !!!',
        'custom-alert-header-error'
      );
      return;
    }
    if(this.registro.horaInicio > this.registro.horaFin){
      this._recursos.alertaNoti(
        'Error',
        'Horario mal definidas',
        'La hora de inicio tiene que ser menor que la final. Pon atención al seleccionar la hora e intenta de nuevo!!',
        'custom-alert-header-error'
      );
      return;
    }

    if(!this.registro.idPlantacion){
      this._recursos.alertaNoti(
        'Error',
        'Sector no definido',
        'El sector es obligatorio, no puedes dejar el registro sin estos datos !!!',
        'custom-alert-header-error'
      );
      return;
    }
    // Validar entre horarios
    let existe = 0;
    for (const sector of this.cuadrillaDetalles.sectores) {
      if((sector.horaInicio <this.registro.horaInicio && this.registro.horaInicio < sector.horaFin)||
      (sector.horaInicio <this.registro.horaFin && this.registro.horaFin < sector.horaFin)){
        existe++;
      }
    }
    if(existe>0){
      this._recursos.alertaNoti(
        'Error',
        'El horario está mal',
        'El horario que intentas registrar tiene cruce con otro sector !!!',
        'custom-alert-header-error'
      );
      return;
    }
    if(this.cuadrillaDetalles.sectores.find(d => d.idPlantacion === this.registro.idPlantacion)){
      let existe = this.cuadrillaDetalles.sectores.find(d => d.idPlantacion === this.registro.idPlantacion);
      existe.horaInicio = this.registro.horaInicio;
      existe.horaFin = this.registro.horaFin;
    }else{
      this.registro.rancho = this.listaRanchos.find(d => d.idRancho+'' === this.registro.idRancho+'').rancho;
      this.registro.nombre = this.listaSectores.find(d => d.plantacionID+'' === this.registro.idPlantacion+'').sector;
      this.cuadrillaDetalles.sectores.push(this.registro);
    }this._recursos.toastM('bottom',"Registro Exitoso !!", 1500);
    this.save();
    this.initVar();
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
  
  async deleteRegistro(index) {
    const alert = await this.alertController.create({
      header: '¿Está seguro que desea eliminar el registro?',
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
           this.cuadrillaDetalles.sectores.splice(index, 1);
           this.save();

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
}
