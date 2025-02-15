import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import {
  ICuadrilla,
  IHorariosCosechaCuadrilla,
  IIncidenciasCuadrillaEmpleado,
} from 'src/app/interfaces/horariosCosecha';
import { RecursosService } from 'src/app/services/recursos.service';

@Component({
  selector: 'app-capurar-incidencias',
  templateUrl: './capurar-incidencias.page.html',
  styleUrls: ['./capurar-incidencias.page.scss'],
})
export class CapurarIncidenciasPage implements OnInit {
  fecha: any;
  idSupervisor: any;
  cuadrilla: any;
  numEmpleado: string;
  detallesCuadrillas: IHorariosCosechaCuadrilla;
  incidenciasDetalles: any;
  cuadrillaDetalles: ICuadrilla;
  registro:{hora: string, comentario: string};

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private _recursos: RecursosService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.fecha = this.activatedRoute.snapshot.paramMap.get('fecha');
    this.idSupervisor =
      this.activatedRoute.snapshot.paramMap.get('idSupervisor');
    this.cuadrilla = this.activatedRoute.snapshot.paramMap.get('cuadrilla');
    this.numEmpleado = this.activatedRoute.snapshot.paramMap.get('numEmpleado');
    this.getDatos();
    this.initVar();
  }
  initVar(){
    this.registro = {
      comentario:null,hora:null
    }
  }

  getDatos() {
    this.detallesCuadrillas = this._recursos
      .getDatosLocales('bitacoraHorariosCuadrillas')
      .find(
        (d) =>
          d.idSupervisor + '' === this.idSupervisor + '' &&
          d.fecha + '' === this.fecha + ''
      );

    this.cuadrillaDetalles = this.detallesCuadrillas.cuadrillas.find(
      (d) => d.nombre + '' === this.cuadrilla
    );
    console.log(this.cuadrillaDetalles,"data");
    this.incidenciasDetalles = this.cuadrillaDetalles.empleado.find(
        (f) => f.numEmpleado + '' === this.numEmpleado + ''
      );
  }
  back() {
    this.navCtrl.navigateForward(`horarios-cosecha-cuadrilla`);
  }
  async deleteRegistro(index){
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
           this.incidenciasDetalles.incidencias.splice(index, 1);
            this.save();
          },
        },
      ],
    });

    await alert.present();
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
  addIncidencia(){
    if(!this.registro.hora){
      this._recursos.alertaNoti(
        'Error',
        'Campo obligatorio',
        'Tienes que definir la hora de la incidencia!!',
        'custom-alert-header-error'
      );
      return;
    }
    if(!this.registro.comentario){
      this._recursos.alertaNoti(
        'Error',
        'Campo obligatorio',
        'Tienes que definir un comentario para la incidencia!!',
        'custom-alert-header-error'
      );
      return;
    }
    this.incidenciasDetalles.incidencias = this.incidenciasDetalles.incidencias.filter(d => d.hora !== this.registro.hora);
    this.incidenciasDetalles.incidencias.push(this.registro);
    this.initVar();
    this.save();
  }
}
