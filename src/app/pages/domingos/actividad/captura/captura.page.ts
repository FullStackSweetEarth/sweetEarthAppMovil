/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable curly */
/* eslint-disable prefer-const */
/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
import {
  IActividades,
  IActividadesRendimiento,
  IEmpleados,
} from 'src/app/interfaces/actividadesPlus';
import { AsyncService } from 'src/app/services/async.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { RecursosService } from 'src/app/services/recursos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-captura',
  templateUrl: './captura.page.html',
  styleUrls: ['./captura.page.scss'],
})
export class CapturaPage implements OnInit {
  plantilla: IEmpleados[] = [];
  rancho: any;
  idRancho: string;
  idApp: string | number;
  actividad: any;
  numActividad: any;
  tuneles: any;
  disponibles: any[] = [];
  allPlantillas: any[];
  plantillaAux: any[] = [];
  existe = '0';
  total: { pago: number; numSurco: number };
  idApp2;
  darkTheme: {
    container: { bodyBackgroundColor: string; buttonColor: string };
    dial: { dialBackgroundColor: string };
    clockFace: {
      clockFaceBackgroundColor: string;
      clockHandColor: string;
      clockFaceTimeInactiveColor: string;
    };
  };
  horaInicio: string;
  horaFin: string;
  disponibles2: any[];
  palabra: string;

  constructor(
    private _async: AsyncService,
    private activatedRoute: ActivatedRoute,
    private _recursos: RecursosService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private _noti: NotificacionesService
  ) {}

  ngOnInit() {
    environment.fechaPagoAvance = JSON.parse(
      localStorage.getItem('fechaPagoAvance')
    );

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
    this.total = {
      numSurco: 0,
      pago: 0,
    };
    this.getEmpleados();
    this.idRancho = this.activatedRoute.snapshot.paramMap.get('id');
    this.idApp = Number(
      this.activatedRoute.snapshot.paramMap.get('idActividad')
    );
    this.idApp2 = this.activatedRoute.snapshot.paramMap.get('idApp');
    this.rancho = this._async.getData(
      'ranchos',
      this.idRancho,
      'idRancho',
      'rancho'
    );
    this.actividad = this._async.getDatas(
      'pActividades',
      this.idApp + '',
      'id'
    );
    let act = this._async.getAllDatos('bitacoraAct');
    act = act.filter((d) => d.idProAact + '' === this.idApp + '');
    if (act.length > 0) {
      this.horaInicio = act[0].horaInicio;
      this.horaFin = act[0].horaFin;
    }
    this.tuneles = this._async.getDatas('ranchos', this.idRancho, 'idRancho');
    this.tuneles = Array.isArray(this.tuneles)
      ? []
      : this.tuneles.sectores.find((d) => d.sector === this.actividad.sector)
      ? this.tuneles.sectores.find((d) => d.sector === this.actividad.sector)
          .tuneles
      : [];
    if (this.tuneles.length == 0) {
      this._recursos.alertaNoti(
        'Error',
        'Sin semanas de vida',
        'Informar al deparamento de PLANEACIÓN'
      );
      this.back();
    }
    this.disponibles = this.getDisponibles();
    this.disponibles.sort(this.customSort);
    this.disponibles2 = this.getTodos();
    this.calcularTotalPago();
    this.recalcularTodosDescuentos();

  }

  getEmpleados() {
    this.plantilla = this._async.getColeccionDatos(
      'plantillas',
      environment.fechaPagoAvance,
      'fecha'
    );
    for (const p of this.plantilla) {
      p.porTarea = this.actividad?.porTarea>0? 1:0;
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
  addRendimeinto(rendimiento: IActividadesRendimiento[]) {
    if (
      !rendimiento.find((d) => Number(d.idActividad) === Number(this.idApp))
    ) {
      rendimiento.push({
        idActividad: Number(this.idApp),
        idApp: this.idApp2,
        actividad: this.actividad.actividad,
        idRancho: Number(this.idRancho),
        rancho: this.rancho,
        sector: this.actividad.sector,
        pago: 0,
        numSurcos: 0,
        horaInicio: null,
        horaFin: null,
        capturas: [
          {
            idTunel: null,
            numSurcos: null,
            pago: null,
            precio: null,
            tunel: null,
            numSurcosAnt: 0,
            idTunelAux: null,
          },
        ],
      });
      this.allPlantillas = this.allPlantillas.filter(
        (d) => d.fecha !== environment.fechaPagoAvance
      );
      for (const dat of this.plantilla) {
        dat.porTarea = this.actividad?.porTarea>0? 1:0;
        this.allPlantillas.push(dat);
      }
      localStorage.setItem('plantillas', JSON.stringify(this.allPlantillas));
    }
  }
  getDisponibles() {
    let tunelesCubiertos = [];
    let aux;
    let plantillaSemana = this._async.getAllDatos('plantillas');
    for (const plant of plantillaSemana) {
      // Ajustar para que tome la actividad progrmaada en varios dias
      if (
        !plant.actividades.rendimientos.find(
          (d) => d.idApp + '' === this.idApp2 + '' && this.existe !== '1'
        )
      ) {
        this.existe = '1';
        this.addRendimeinto(plant.actividades.rendimientos);
      }
      for (const rendimiento of plant.actividades.rendimientos.find(
        (d) => d.idApp + '' === this.idApp2 + ''
      ).capturas) {
        aux = tunelesCubiertos.find((d) => d.idTunel === rendimiento.idTunel);
        if (aux) aux.numSurcos += rendimiento.numSurcos;
        else tunelesCubiertos.push(rendimiento);
      }
    }
    let aux2 = [];
    let r = 0;
    let restar;
    for (const r1 of this.tuneles) {
      if (tunelesCubiertos.length > 0) {
        restar = tunelesCubiertos.find(
          (d) => Number(d.idTunel) === Number(r1.id)
        );
        r = Number(r1.numsurcos) - (restar ? restar.numSurcos : 0);
        aux2.push({
          idTunel: r1.id,
          restantes: r,
          nombre: r1.nombre,
        });
      } else {
        aux2.push({
          idTunel: r1.id,
          restantes: Number(r1.numsurcos),
          nombre: r1.nombre,
        });
      }
    }
    return aux2;
  }

  getTodos() {
    let aux2 = [];
    for (const r1 of this.tuneles) {
      aux2.push({
        idTunel: r1.id,
        restantes: Number(r1.numsurcos),
        nombre: r1.nombre,
      });
    }
    return aux2;
  }
  verificar(rendimiento) {
    if (
      Number(
        this.disponibles.find((d) => d.idTunel === rendimiento.idTunel)
          .restantes
      ) +
        Number(rendimiento.numSurcosAnt ? rendimiento.numSurcosAnt : 0) -
        Number(rendimiento.numSurcos) >=
      0
    ) {
      return true;
    } else {
      return false;
    }
  }
  async addTunel(tunel, rendi: IActividades) {
    if (
      !(tunel.numSurcos > 0) &&
      !(this.actividad.tipoActividad === 'GRUPAL')
    ) {
      return;
    }
    if (
      !(tunel.numSurcos > 0) &&
      (this.actividad ? !(this.actividad.tipoActividad === 'GRUPAL') : false) &&
      false
    ) {
      const alert = await this.alertController.create({
        header:
          'El registro no se elimina colocando 0, debe precionar el botón rojo para eliminar un registro',
        cssClass: 'custom-alert',
      });

      await alert.present();
      return;
    }
    if (
      (!(tunel.numSurcos > 0) || !(tunel.idTunel > 0)) && this.actividad
        ? !(this.actividad.tipoActividad === 'GRUPAL')
        : false
    ) {
      const alert = await this.alertController.create({
        header: 'Tiene que definir el tunel y el sector correctamente',
        cssClass: 'custom-alert',
      });

      await alert.present();
      tunel.numSurcos = null;
      tunel.idTunel = null;
      return;
    } else {
      console.log(tunel);
    }
    this.getDisponibles();
    this.allPlantillas = this.allPlantillas.filter(
      (d) => d.fecha !== environment.fechaPagoAvance
    );
    if (
      this.verificar(tunel) &&
      tunel.idTunel > 0 &&
      (this.actividad
        ? this.actividad.tipoActividad === 'GRUPAL'
          ? true
          : tunel.numSurcos > 0
        : tunel.numSurcos > 0)
    ) {
      let tunelInfo = this.tuneles.find(
        (d) => Number(d.id) === Number(tunel.idTunel)
      );
      tunel.tunel = tunelInfo.nombre;
      tunel.precio = Number(this.actividad?.porTarea)>0?  (tunelInfo.mtsl / tunelInfo.numsurcos) * this.actividad.pago: Math.round(
        (tunelInfo.mtsl / tunelInfo.numsurcos) * this.actividad.pago
      );
      let aux: any = rendi.rendimientos.find(
        (h) => Number(h.idActividad) === Number(this.idApp)
      );
      rendi.numSurcos -= aux.numSurcos;
      rendi.pago -= aux.pago;

      aux.numSurcos = 0;
      aux.pago = 0;
      tunel.pago = Number(tunel.precio) * Number(tunel.numSurcos);
      for (const f of aux.capturas) {
        aux.numSurcos += f.numSurcos;
        aux.pago += f.pago;
      }
      rendi.numSurcos += aux.numSurcos;
      rendi.pago += aux.pago;
      for (const dat of this.plantilla) {
        dat.porTarea = this.actividad?.porTarea>0? 1:0;
        this.allPlantillas.push(dat);
      }
      rendi.granTotal = 0;
      for (const item of rendi.rendimientos) {
        rendi.granTotal += item.pago;
      }
      if (!tunel.numSurcosAnt) {
        rendi.rendimientos
          .find((f) => Number(f.idActividad) === Number(this.idApp))
          .capturas.push({
            idTunel: null,
            numSurcos: null,
            pago: null,
            precio: null,
            tunel: null,
            numSurcosAnt: 0,
            idTunelAux: null,
          });
      }
      tunel.numSurcosAnt = tunel.numSurcos;
      tunel.idTunelAux = tunel.idTunel;
      localStorage.setItem('plantillas', JSON.stringify(this.allPlantillas));
      this.plantillaAux = this._async.getColeccionDatos(
        'plantillas',
        environment.fechaPagoAvance,
        'fecha'
      );
      this.disponibles = this.getDisponibles();
      this.disponibles.sort(this.customSort);
      this.disponibles2 = this.getTodos();
    } else {
      let restantes = Number(
        this.disponibles.find((d) => d.idTunel === tunel.idTunel).restantes
      );

      tunel.idTunel = null;
      tunel.numSurcos = null;
      if (tunel.numSurcosAnt > 0) {
        tunel.numSurcos = tunel.numSurcosAnt;
        tunel.idTunelAux = tunel.idTunel;
      } else {
        tunel.idTunel = null;
        tunel.numSurcos = null;
        tunel.idTunelAux = null;
      }
      this._recursos.toastM(
        'bottom',
        'No puede asignar tantos surcos a este tunel, solo están disponibles: ' +
          restantes,
        5000
      );
    }
    this.calcularTotalPago();
  }
  back() {
    // this.calcDesc();
    if (!this.validarHorario()) this.calcDescSinhR();
    
    this.recalcularTodosDescuentos();
    this.navCtrl.navigateBack(`domingos/actividad/${this.idRancho}`);
  }

  validarHorario() {
    if (
      this.actividad.precioHora > 0 ? !this.horaInicio || !this.horaFin : false
    ) {
      this._recursos.toastM(
        'bottom',
        'A la actividad se le debe definir horario !!!',
        3500
      );
      this._noti.lNotifi({
        title: 'IMPORTANTE',
        body: 'A la actividad se le debe definir horario !!!',
      });
      return false;
    } else return true;
  }
  async deleteTunel(arr, indice, rendi) {
    const alert = await this.alertController.create({
      header: '¿Está seguro que desea borrar el registro?',
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
            if (arr.length - 2 >= indice) {
              arr.splice(indice, 1);

              this.allPlantillas = this.allPlantillas.filter(
                (d) => d.fecha !== environment.fechaPagoAvance
              );

              let aux: any = rendi.rendimientos.find(
                (h) => Number(h.idActividad) === Number(this.idApp)
              );
              rendi.numSurcos -= aux.numSurcos;
              rendi.pago -= aux.pago;
              aux.numSurcos = 0;
              aux.pago = 0;
              for (const f of aux.capturas) {
                aux.numSurcos += f.numSurcos;
                aux.pago += f.pago;
              }
              rendi.numSurcos += aux.numSurcos;
              rendi.pago += aux.pago;
              for (const dat of this.plantilla) {
        dat.porTarea = this.actividad?.porTarea>0? 1:0;

                this.allPlantillas.push(dat);
              }
              rendi.granTotal = 0;
              for (const item of rendi.rendimientos) {
                rendi.granTotal += item.pago;
              }
              localStorage.setItem(
                'plantillas',
                JSON.stringify(this.allPlantillas)
              );
              this.plantillaAux = this._async.getColeccionDatos(
                'plantillas',
                environment.fechaPagoAvance,
                'fecha'
              );
              this.disponibles = this.getDisponibles();
              this.disponibles.sort(this.customSort);
              this.disponibles2 = this.getTodos();
            }
            this.calcularTotalPago();
          },
        },
      ],
    });

    await alert.present();
  }
  calcularTotalPago() {
    this.total.pago = 0;
    this.total.numSurco = 0;
    let Act: any;
    for (const empleado of this.plantilla) {
      empleado.porTarea = this.actividad?.porTarea>0? 1:0;

      Act = empleado.actividades.rendimientos.find(
        (d) => Number(d.idActividad) === Number(this.idApp)
      );
      Act = Act ? Act : this.addRendimeinto(empleado.actividades.rendimientos);
      if (Act) {
        this.total.pago += Act.pago;
        this.total.numSurco += Act.numSurcos;
      }
    }
  }

  asignarHorarios(event: any, type) {
    if (event.detail.value === undefined) {
      if (type == 1) {
        this.horaInicio = '2024-07-31T' + this._recursos.getHora24() + ':00';
      } else {
        this.horaFin = '2024-07-31T' + this._recursos.getHora24() + ':00';
      }
    }
    setTimeout(() => {
      if (this.horaFin && this.horaInicio) {
        // console.log(this.horaFin,this.horaInicio, 'horarios');
        if (this.horaFin.slice(-8) < this.horaInicio.slice(-8)) {
          this._recursos.alertaNoti(
            'Error',
            'Horario',
            'La hora de inicio tiene que ser menor que la final!!',
            'custom-alert-header-error'
          );
          this.horaFin = null;
          this.horaInicio = null;
          return;
        }
        let act = this._async.getAllDatos('bitacoraAct');
        act = act.filter((d) => d.idApp !== this.actividad.idApp);
        // Asignar a toda la plantilla horario
        let auxEmp;
        for (const empleado of this.plantilla) {
        empleado.porTarea = this.actividad?.porTarea>0? 1:0;

          auxEmp = empleado.actividades.rendimientos.find(
            (d) => d.idActividad === this.idApp
          );
          auxEmp.horaInicio = this.horaInicio.split('T')[1].substring(0, 5);
          auxEmp.horaFin = this.horaFin.split('T')[1].substring(0, 5);
          // Calcular la diferencia en milisegundos
          const inicio: Date = this.parseTime(auxEmp.horaInicio);
          const fin: Date = this.parseTime(auxEmp.horaFin);
          const diferenciaMs: number = fin.getTime() - inicio.getTime();

          // Convertir la diferencia a horas
          const diferenciaHoras: number = diferenciaMs / (1000 * 60 * 60);

          auxEmp.descuento = this.actividad.precioHora * diferenciaHoras;
        }
        let dat = {
          horaInicio: this.horaInicio,
          horaFin: this.horaFin,
          idApp: this.actividad.idApp,
          idProAact: this.actividad.id,
        };
        // Calcular descuento
        // this.calcDesc();
        this.calcularGranDescuento();
        act.push(dat);
        localStorage.setItem('bitacoraAct', JSON.stringify(act));
      }
    }, 100);
  }

  calcDesc() {
    // Se debe modificar para que tome lo de todas las actividades
    if (this.horaFin && this.horaInicio) {
      this.allPlantillas = this.allPlantillas.filter(
        (d) => d.fecha !== environment.fechaPagoAvance
      );
      let aux;
      for (const plantilla of this.plantilla) {
        plantilla.porTarea = this.actividad?.porTarea>0? 1:0;

        plantilla.descuento = 0;
        aux = plantilla.actividades.rendimientos.find(
          (d) => d.idApp === this.actividad.idApp
        );
        if (aux) {
          if (aux.numSurcos > 0) {
            const inicio: Date = this.parseTime(
              this.horaInicio.split('T')[1].slice(0, 5)
            );
            const fin: Date = this.parseTime(
              this.horaFin.split('T')[1].slice(0, 5)
            );

            // Calcular la diferencia en milisegundos
            const diferenciaMs: number = fin.getTime() - inicio.getTime();

            // Convertir la diferencia a horas
            const diferenciaHoras: number = diferenciaMs / (1000 * 60 * 60);

            aux.descuento = this.actividad.precioHora * diferenciaHoras;
          }
        }
        let totalDescuento = 0;
        for (const descuento of plantilla.actividades.rendimientos) {
          totalDescuento += descuento.descuento;
        }
        plantilla.descuento = totalDescuento;
      }
      for (const dat of this.plantilla) {
        dat.porTarea = this.actividad?.porTarea>0? 1:0;

        this.allPlantillas.push(dat);
      }
      localStorage.setItem('plantillas', JSON.stringify(this.allPlantillas));
    }
  }

  calcDescSinhR() {
    if (true) {
      this.allPlantillas = this.allPlantillas.filter(
        (d) => d.fecha !== environment.fechaPagoAvance
      );
      let aux;
      for (const plantilla of this.plantilla) {
        plantilla.porTarea = this.actividad?.porTarea>0? 1:0;

        plantilla.descuento = 0;
        aux = plantilla.actividades.rendimientos.find(
          (d) => d.idApp === this.actividad.idApp
        );
        if (aux) {
          if (aux.numSurcos > 0) {
            plantilla.descuento = -1;
          }
        }
      }
      for (const dat of this.plantilla) {
        dat.porTarea = this.actividad?.porTarea>0? 1:0;
        this.allPlantillas.push(dat);
      }

      localStorage.setItem('plantillas', JSON.stringify(this.allPlantillas));
    }
  }

  async distribuirRendimeintos() {
    for (const plantilla of this.plantilla) {
      plantilla.porTarea = this.actividad?.porTarea>0? 1:0;

      let rendi = plantilla.actividades.rendimientos.find(
        (d) => d.idApp === this.idApp2
      );
      plantilla.actividades.granTotal = 0;
      plantilla.actividades.pago = 0;
      plantilla.actividades.numSurcos = 0;
      plantilla.descuento = 0;
      rendi.pago = 0;
      rendi.numSurcos = 0;
      rendi.capturas.splice(0, rendi.capturas.length - 1);
    }
    this.calcularTotalPago();
    let disponibles = JSON.parse(JSON.stringify(this.disponibles2));
    disponibles.sort(this.customSort);
    this.allPlantillas = this.allPlantillas.filter(
      (d) => d.fecha !== environment.fechaPagoAvance
    );
    const activos = this.plantilla.filter((d) => d.check).length;
    let restantes = 0;
    let costo = 0;
    for (const tunel of disponibles) {
      tunel.costo = 0;
      let tunelInfo = this.tuneles.find(
        (d) => Number(d.id) === Number(tunel.idTunel)
      );
      let precio = Number(this.actividad?.porTarea)>0?(tunelInfo.mtsl / tunelInfo.numsurcos) * this.actividad.pago: Math.round(
        (tunelInfo.mtsl / tunelInfo.numsurcos) * this.actividad.pago
      );
      tunel.costo = precio * tunel.restantes;
      tunel.precio = precio * tunel.restantes;

      restantes += tunel.restantes;
      costo += tunel.costo;
    }
    let costoPersona = costo / activos;
    let aux = Number(costoPersona);
    let aux2;
    for (const plantilla of this.plantilla.filter((d) => d.check)) {
      aux = Number(costoPersona);
      for (const tunel of disponibles) {
        if (aux > 0) {
          let rendi = plantilla.actividades.rendimientos.find(
            (d) => d.idApp === this.idApp2
          );

          aux2 = rendi.capturas;
          if (tunel.restantes > 0) {
            if (aux > tunel.costo) {
              let tunelInfo = this.tuneles.find(
                (d) => Number(d.id) === Number(tunel.idTunel)
              );
              let precio = Number(this.actividad?.porTarea)>0?(tunelInfo.mtsl / tunelInfo.numsurcos) * this.actividad.pago: Math.round(
                (tunelInfo.mtsl / tunelInfo.numsurcos) * this.actividad.pago
              );
              aux2.unshift({
                idTunel: tunel.idTunel,
                idTunelAux: tunel.idTunel,
                numSurcos: tunel.restantes,
                numSurcosAnt: tunel.restantes,
                pago: Number(precio) * Number(tunel.restantes),
                precio: precio,
                tunel: tunel.nombre,
              });
              rendi.pago += Number(precio) * Number(tunel.restantes);
              rendi.numSurcos += Number(tunel.restantes);
              aux -= Number(tunel.costo);
              tunel.restantes = 0;
              tunel.costo = 0;
            } else {
              let tunelInfo = this.tuneles.find(
                (d) => Number(d.id) === Number(tunel.idTunel)
              );
              let precio = Number(this.actividad?.porTarea)>0?(tunelInfo.mtsl / tunelInfo.numsurcos) * this.actividad.pago: Math.round(
                (tunelInfo.mtsl / tunelInfo.numsurcos) * this.actividad.pago
              );

              aux2.unshift({
                idTunel: tunel.idTunel,
                idTunelAux: tunel.idTunel,
                numSurcos: aux / precio,
                numSurcosAnt: aux / precio,
                pago: Number(precio) * Number(aux / precio),
                precio: precio,
                tunel: tunel.nombre,
              });
              rendi.pago += Number(precio) * Number(aux / precio);
              rendi.numSurcos += Number(aux / precio);

              tunel.restantes -= Number(aux / precio);
              tunel.costo -= Number(precio) * Number(aux / precio);
              tunel.pago = Number(tunel.precio) * Number(tunel.numSurcos);
              plantilla.actividades.numSurcos = 0;
              plantilla.actividades.pago = 0;
              for (const f of rendi.capturas) {
                plantilla.actividades.numSurcos += f.numSurcos;
                plantilla.actividades.pago += f.pago;
              }
              plantilla.actividades.granTotal = 0;
              for (const item of plantilla.actividades.rendimientos) {
                plantilla.actividades.granTotal += item.pago;
              }
              break;
            }
          }
          // Realizar la distribución de los surcos
        }
      }
    }
    await this.calcularTotalPago();

    for (const dat of this.plantilla) {
      dat.porTarea = this.actividad?.porTarea>0? 1:0;

      this.allPlantillas.push(dat);
    }

    localStorage.setItem('plantillas', JSON.stringify(this.allPlantillas));
    this.plantillaAux = this._async.getColeccionDatos(
      'plantillas',
      environment.fechaPagoAvance,
      'fecha'
    );
    // console.log('A realizar');
  }

  parseTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = this._async.getFechaMexHoy();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  async distribuirRendimeintosv2() {
    // Leer cuantas personas fuern asignadas a cada tunel
    let tunelesPersonas: {
      [key: string]: {
        numEmpleado: number;
        surcosAsignar?: number;
        idTunel: number;
        precioSurco?: number;
      };
    } = {};
    let rendimientoActividad;
    for (const empleado of this.plantilla) {
      empleado.porTarea = this.actividad?.porTarea>0? 1:0;

      rendimientoActividad = empleado.actividades.rendimientos.find(
        (d) => d.idActividad + '' === this.actividad.id + ''
      );
      for (const tunel of rendimientoActividad
        ? rendimientoActividad.capturas
        : []) {
        if (tunel.idTunel > 0) {
          if (!tunelesPersonas[tunel.idTunel]) {
            tunelesPersonas[tunel.idTunel] = {
              numEmpleado: 0,
              surcosAsignar: 0,
              idTunel: tunel.idTunel,
              precioSurco: 0,
            };
          }

          // Incrementa el número de empleados en ese túnel
          tunelesPersonas[tunel.idTunel].numEmpleado += 1;
        }
      }
    }

    // Dividir el numero de personas entre lo surcos que tiene el tunel
    for (const tunel of this.tuneles) {
      if (tunelesPersonas[tunel.id]) {
        tunelesPersonas[tunel.id]['precioSurco'] = Number(this.actividad?.porTarea)>0?(tunel.mtsl / tunel.numsurcos) * this.actividad.pago: Math.round(
          (tunel.mtsl / tunel.numsurcos) * this.actividad.pago
        );
        tunelesPersonas[tunel.id]['surcosAsignar'] =
          tunel.numsurcos / tunelesPersonas[tunel.id]['numEmpleado'];
      }
    }

    // Recorrer la plantilla y calcular pago
    for (const empleado of this.plantilla) {
      empleado.porTarea = this.actividad?.porTarea>0? 1:0;

      rendimientoActividad = empleado.actividades.rendimientos.find(
        (d) => d.idActividad + '' === this.actividad.id + ''
      );

      let rendi = empleado.actividades.rendimientos.find(
        (d) => d.idApp === this.idApp2
      );
      if (rendimientoActividad) {
        rendimientoActividad.pago = 0;
        rendimientoActividad.numSurcos = 0;
      }
      for (const tunel of rendimientoActividad
        ? rendimientoActividad.capturas
        : []) {
        if (tunel.idTunel > 0) {
          tunel.numSurcos = tunelesPersonas[tunel.idTunel].surcosAsignar;
          tunel.precio = tunelesPersonas[tunel.idTunel].precioSurco;
          tunel.pago = tunel.numSurcos * tunel.precio;
          tunel.numSurcosAnt = tunel.numSurcos;
        }
        // Calcular total de la Actividad
        rendimientoActividad.pago += tunel.pago;
        rendimientoActividad.numSurcos += tunel.numSurcos;
      }
      empleado.actividades.pago = 0;
      for (const f of rendi.capturas) {
        empleado.actividades.numSurcos += f.numSurcos;
        empleado.actividades.pago += f.pago;
      }
      empleado.actividades.granTotal = 0;
      for (const item of empleado.actividades.rendimientos) {
        empleado.actividades.granTotal += item.pago;
      }
    }
    await this.calcularTotalPago();
    this.allPlantillas = this.allPlantillas.filter(
      (d) => d.fecha !== environment.fechaPagoAvance
    );
    for (const dat of this.plantilla) {
      dat.porTarea = this.actividad?.porTarea>0? 1:0;
      this.allPlantillas.push(dat);
    }

    localStorage.setItem('plantillas', JSON.stringify(this.allPlantillas));
    this.plantillaAux = this._async.getColeccionDatos(
      'plantillas',
      environment.fechaPagoAvance,
      'fecha'
    );
  }

  // Función para dividir la parte numérica y la parte alfabética
  customSort(a: any, b: any): number {
    // Expresión regular para separar la parte numérica y alfabética
    const regex = /^(\d+)([A-Za-z]*)$/;

    const aMatch = a.nombre.match(regex);
    const bMatch = b.nombre.match(regex);

    if (aMatch && bMatch) {
      // Extraer y convertir la parte numérica
      const aNum = parseInt(aMatch[1], 10);
      const bNum = parseInt(bMatch[1], 10);

      // Comparar la parte numérica primero
      if (aNum !== bNum) {
        return aNum - bNum;
      }

      // Si la parte numérica es igual, comparar la parte alfabética
      return aMatch[2].localeCompare(bMatch[2]);
    }

    return 0;
  }
  calcularDescuentoIndividual(empleado) {
    if(!empleado.horaInicio || !empleado.horaFin){
      return;
    }
console.log(empleado.horaInicio,empleado.horaFin);
    
    if(empleado.horaInicio >empleado.horaFin){
      this.getEmpleados();
      this._recursos.alertaNoti(
        'Error',
        'Horario',
        'La hora de inicio tiene que ser menor que la final!!',
        'custom-alert-header-error'
      );
      return;
    }
    // Calcular la diferencia en milisegundos
    const inicio: Date = this.parseTime(empleado.horaInicio);
    const fin: Date = this.parseTime(empleado.horaFin);
    const diferenciaMs: number = fin.getTime() - inicio.getTime();

    // Convertir la diferencia a horas
    const diferenciaHoras: number = diferenciaMs / (1000 * 60 * 60);

    empleado.descuento = empleado.pago>0?(this.actividad.precioHora * diferenciaHoras):0;

    this.calcularGranDescuento();
  }
  recalcularTodosDescuentos() {
    for (const empleado of this.plantilla) {
      empleado.porTarea = this.actividad?.porTarea>0? 1:0;

      for (const rendimiento of empleado.actividades.rendimientos) {
        if(!(rendimiento.horaInicio < rendimiento.horaFin)){
          return;
        }
        // Calcular la diferencia en milisegundos
        const inicio: Date = this.parseTime(rendimiento.horaInicio);
        const fin: Date = this.parseTime(rendimiento.horaFin);
        const diferenciaMs: number = fin.getTime() - inicio.getTime();
        // Convertir la diferencia a horas
        const diferenciaHoras: number = diferenciaMs / (1000 * 60 * 60);
        rendimiento.descuento = rendimiento.pago>0? (this.actividad.precioHora * diferenciaHoras):0;
      }
    }
    this.calcularGranDescuento();
  }

  calcularGranDescuento(){
    this.allPlantillas = this.allPlantillas.filter(
      (d) => d.fecha !== environment.fechaPagoAvance
    );
    for (const empleado of this.plantilla) {
      empleado.porTarea = this.actividad?.porTarea>0? 1:0;

      empleado.descuento = 0;
      for (const voleo of empleado.voleos.rendimientos) {
        empleado.descuento +=
          Number(voleo.descuento) > 0 ? Number(voleo.descuento) : 0;
      }
      for (const actividad of empleado.actividades.rendimientos) {
        empleado.descuento +=
          Number(actividad.descuento) > 0 ?actividad.pago>0? Number(actividad.descuento):0 : 0;
      }
    }
    
    for (const dat of this.plantilla) {
      dat.porTarea = this.actividad?.porTarea>0? 1:0;
      this.allPlantillas.push(dat);
    }
    localStorage.setItem('plantillas', JSON.stringify(this.allPlantillas));
  }
}
