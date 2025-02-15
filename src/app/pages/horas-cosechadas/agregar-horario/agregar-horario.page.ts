/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ICosechaGuardar, IHorarioCosecha, IRancho } from 'src/app/interfaces/papeleta';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';



@Component({
  selector: 'app-agregar-horario',
  templateUrl: './agregar-horario.page.html',
  styleUrls: ['./agregar-horario.page.scss'],
})
export class AgregarHorarioPage implements OnInit {
  capturaHorario: IHorarioCosecha;
  nuevoHorario: IHorarioCosecha = {
    fecha: '',
    idRancho: null,
    idSupervisor: null,
    sector: 0,
    CosHoraInicio: '',
    CosHoraFin: '',
    GalHoraInicio: '',
    GalHoraFin: '',
    NumCosechadores: null,
    NumGaleristas: null,
    plantacionID: null,
    estatus: 1,
    kilogramosGalera: null,
    kilogramosCampo: null,
  };
  idRanch: number;
  idSuper: number;
  filtroSectores: any[] = [];
  horarios: IHorarioCosecha[] = [];
  date: string;
  sector: any;
  Toast: any;
  ranchos: IRancho[] = [];
  capturas: ICosechaGuardar[] = [];
  formulario = 'accordion-collapsed';
  asoiados: any[] = [];
  capturasCos: any[] = [];
  rancho: any;
  darkTheme: NgxMaterialTimepickerTheme;
  inicio: any;
  papeletas: any;
  existe = false;

  constructor(private navCtrl: NavController,
    private rutaActiva: ActivatedRoute, public datepipe: DatePipe,
    private alertController: AlertController, private _recursos: RecursosService, private _async: AsyncService) { }

  ngOnInit() {

    this.papeletas = this._async.getData('capturaCosecha').filter(d => d.fecha+'' === this._recursos.getFechaHoy().fecha )
    this.inicio = this._async.getData('horariosLs').find(d => d.id === '1').inicio;
    this.darkTheme = {
      container: {
          bodyBackgroundColor: '#424242',
          buttonColor: '#fff'
      },
      dial: {
          dialBackgroundColor: '#555',
      },
      clockFace: {
          clockFaceBackgroundColor: '#555',
          clockHandColor: '#9fbd90',
          clockFaceTimeInactiveColor: '#fff'
      }
  };
    this.capturasCos = this._async.getData('capturaCosecha')
    ? this._async.getData('capturaCosecha')
    : [];
    const date = this._async.getFechaMexHoy();
    this.date = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.idRanch = this.rutaActiva.snapshot.params.rch;
    this.idSuper = this.rutaActiva.snapshot.params.sup;
    this.sector = this.rutaActiva.snapshot.params.sec;
    if(Number(this.sector )>0){
      this.existe = true;

    }
    this.limpiarVariables();
    this.filtrarSectores();
    if (Number(this.sector) > 0) {
      this.cargarDatos();
    }
    this.nuevoHorario = {
      fecha: this.date,
      idRancho: this.idRanch,
      idSupervisor: this.idSuper,
      sector: 0,
      CosHoraInicio: '',
      CosHoraFin: '',
      GalHoraInicio: '',
      GalHoraFin: '',
      NumCosechadores: null,
      NumGaleristas: null,
      plantacionID: null,
      estatus: 1,
      kilogramosGalera: null,
      kilogramosCampo: null,
    };
    this.getRancho();
  }

  getRancho(){
    this.rancho =  this._async.getData('ranchos').find(d => d.idRancho === this.idRanch).rancho;
  }


  cargarDatos() {
    if (this.horarios.find(b => b.fecha == this.date && b.sector == this.sector)) {
      this.capturaHorario = this.horarios.find(b => b.fecha == this.date && b.sector == this.sector);
    }
  }
  limpiarVariables() {
    this.capturaHorario = {
      fecha: this.date,
      idRancho: this.idRanch,
      idSupervisor: null,
      sector: 0,
      CosHoraInicio: '',
      CosHoraFin: '',
      GalHoraInicio: '',
      GalHoraFin: '',
      NumCosechadores: null,
      NumGaleristas: null,
      plantacionID: null,
      estatus: 1,
      kilogramosGalera: null,
      kilogramosCampo: null,
    };
    this.horarios = JSON.parse(localStorage.getItem('horariosCosecha')) ? JSON.parse(localStorage.getItem('horariosCosecha')) : [];
    this.capturas = JSON.parse(localStorage.getItem('capturaCosecha')) ? JSON.parse(localStorage.getItem('capturaCosecha')) : [];
  }
  limpiarVariables2() {
    this.capturaHorario = {
      fecha: this.date,
      idRancho: this.idRanch,
      idSupervisor: null,
      sector: 0,
      CosHoraInicio: '',
      CosHoraFin: '',
      GalHoraInicio: '',
      GalHoraFin: '',
      NumCosechadores: null,
      NumGaleristas: null,
      plantacionID: null,
      estatus: 1,
      kilogramosGalera: null,
      kilogramosCampo: null,
    };
  }

  filtrarSectores() {
    let sec; let ranch; let aso;
    ranch = JSON.parse(localStorage.getItem('ranchos'));
    const ranchos: any[] = ranch?ranch:[];
    sec = ranchos.find(b => b.idRancho == this.capturaHorario.idRancho).sectores;
    const sectoresRancho = sec?sec:[];
    this.filtroSectores = sectoresRancho;
    aso = this._async.getData('empleados').filter(dat =>  dat.idsupervisor === this.idSuper);
    this.asoiados = aso?aso:[];
  }

  Guardar() {
    if (this.capturaHorario.sector) {
      const plantacion = this.filtroSectores.find(b => b.sector === this.capturaHorario.sector).plantacionID;
      this.capturaHorario.plantacionID = plantacion;
      this.capturaHorario.estatus = 1;

      // if (this.capturaHorario.CosHoraInicio.length == 0 || this.capturaHorario.CosHoraFin.length == 0 || this.capturaHorario.GalHoraInicio.length == 0 || this.capturaHorario.GalHoraFin.length == 0) {
      //   this._recursos.alertaNoti('Formulario', 'Error', 'Campo de hora vacio !!');
      // } else {
        // if (this.capturaHorario.CosHoraInicio < this.inicio) {
        //   this._recursos.alertaNoti('Formulario', 'Error', `El inicio de cosecha no puede ser menor de las ${this.inicio} AM !!`);
        // } else {
          // if (this.capturaHorario.CosHoraFin < this.capturaHorario.CosHoraInicio) {
          //   this._recursos.alertaNoti('Formulario', 'Error', 'La hora de inicio de cosecha tiene que ser mayor a la final !!');
          //   return;
          // }
          if (this.capturaHorario.GalHoraFin < this.capturaHorario.GalHoraInicio) {
            this._recursos.alertaNoti('Formulario', 'Error', 'La hora de inicio de galera tiene que ser mayor a la final !!');
            return;
          }

          let nuevoHora: IHorarioCosecha[] = [];
          if (this.horarios) {
            nuevoHora = this.horarios;
          }
          if (this.capturaHorario.sector == 0) {
            this._recursos.alertaNoti('Formulario', 'Error', 'Selecione sector !!');
          } else {
            // if (this.capturaHorario.NumCosechadores == null) {
            //   this._recursos.alertaNoti('Formulario', 'Error', 'Ingrese el numero de cosechadores !!');
            // } else {
              if (this.capturaHorario.NumGaleristas == null) {
                this._recursos.alertaNoti('Formulario', 'Error', 'Ingrese el numero de galeristas !!');
              } else {
                if (this.capturaHorario.kilogramosGalera == null) {
                  this._recursos.alertaNoti('Formulario', 'Error', 'Ingrese el kg de proceso de Galera !!');
                } else {
                  if (this.capturaHorario.kilogramosCampo == null) {
                    this._recursos.alertaNoti('Formulario', 'Error', 'Ingrese el kg de proceso de campo !!');
                  } else {
                    // if (this.capturaHorario.CosHoraFin <= this.capturaHorario.CosHoraInicio) {
                    //   this._recursos.alertaNoti('Formulario', 'Error', 'La hora final de cosecha no puede ser menor o igual a la de inicio !!');
                    // } else {
                      if (false) {
                        this._recursos.alertaNoti('Formulario', 'Error', 'La hora inicio de galera no puede ser menor a la de fin de cosecha !!');
                      } else {
                        // if (this.capturaHorario.GalHoraFin <= this.capturaHorario.GalHoraInicio || this.capturaHorario.GalHoraFin < this.capturaHorario.CosHoraFin) {
                        if (this.capturaHorario.GalHoraFin <= this.capturaHorario.GalHoraInicio ) {
                          this._recursos.alertaNoti('Formulario', 'Error', 'La hora final de galera no puede ser menor o igual a la de fin de cosecha !!');
                        } else {


                          this.capturaHorario.idSupervisor = this.idSuper;
                          if (this.horarios.length > 0) {
                            if (this.horarios.find(b => b.fecha == this.date)) {

                              if (this.horarios.find(b => b.sector == this.capturaHorario.sector)) {
                                if (this.horarios.find(b => b.idRancho == this.idRanch && b.idSupervisor == this.idSuper && b.fecha == this.date && b.sector == this.capturaHorario.sector)) {
                                  for (let i = 0; i < this.horarios.length; i++) {
                                    if (this.horarios[i].idRancho == this.idRanch && this.horarios[i].idSupervisor == this.idSuper && this.horarios[i].sector == this.capturaHorario.sector && this.horarios[i].fecha == this.date) {
                                  
                                      nuevoHora[i] = this.capturaHorario;
                                    }
                                  }
                                } else {
                                  nuevoHora.push(this.capturaHorario);
                                }
                              } else {
                                nuevoHora.push(this.capturaHorario);
                              }
                            } else {
                              nuevoHora.push(this.capturaHorario);
                            }
                          } else {
                            nuevoHora.push(this.capturaHorario);
                          }
                          const data = this.capturasCos.filter(d => d.fecha === this.capturaHorario.fecha+''
                            && d.idRancho+'' === this.capturaHorario.idRancho+'');
                          if(data){
                            for (const papeletas of data) {
                              for (const sector of papeletas.sector) {
                                if(sector.idPlantacion === this.capturaHorario.plantacionID){
                                  this.capturaHorario.horaEnvio = sector.horaEnvio;
                                  break;
                                }
                              }
                            }
                          }
                          localStorage.setItem('horariosCosecha', JSON.stringify(nuevoHora));
                          this._recursos.toastM('bottom', 'Registro exitoso', 1000);
                          this.limpiarVariables2();
                        }
                      }
                    // }
                  }
                }
              }
            // }

          }

        // }
      // }

    } else {
      this._recursos.alertaNoti('Formulario', 'Error', 'Tiene que seleccionar un sector para poder continuar !!');
    }
  }

  alerta(msj: string) {
  }


  back() {
    this.navCtrl.navigateForward(`horas-cosechadas/${this.idRanch}/${this.idSuper}`);
  }
  verificarPapeleta(){
    const plantacion = this.filtroSectores.find(b => b.sector === this.capturaHorario.sector).plantacionID;
    this.existe = false;
    for (const plantilla of this.papeletas) {
      this.existe = plantilla.sector.find(d => d.idPlantacion+'' === plantacion+'')?true:false;
      if(this.existe){
        break;
      }
    }
    
    if(!this.existe){
      this._recursos.alertaNoti('Sector sin licencia registrada',"Error","Debe primero tener sus licencias registradas para poder registrar los horarios, mientras no regisre las licencias el sistema no lo dejará continuar!!!")
    }
  } 
}
