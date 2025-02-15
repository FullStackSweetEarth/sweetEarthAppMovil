import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IEmpleados } from 'src/app/interfaces/actividadesPlus';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-voleo-captura',
  templateUrl: './voleo-captura.page.html',
  styleUrls: ['./voleo-captura.page.scss'],
})
export class VoleoCapturaPage implements OnInit {
  fecha: string;
  palabra: string;
  idPrograma: string;
  plantilla: IEmpleados[] = [];
  plantillaAll: any;
  programa: any;
  disponibles: number;
  horaInicio: string;
  horaFin: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private _recursos: RecursosService,
    private _async: AsyncService
  ) {}

  ngOnInit() {
    this.fecha = this.activatedRoute.snapshot.paramMap.get('fecha');
    this.idPrograma = this.activatedRoute.snapshot.paramMap.get('idPrograma');
    this.plantilla = this._async.getAllDatos('plantillas');
    this.plantilla = this.plantilla.filter((d) => d.fecha === this.fecha);
    // GET DETALLES
    this.programa = this._async.getAllDatos('programaVoleo');
    this.programa = this.programa.find(
      (d) => d.id + '' === this.idPrograma + ''
    );
    console.log('PROGRAMA', this.programa);
    this.initVoleo();
    this.calcularDisponibles();
    this.recalcularTodosDescuentos();
  }
  getDatos() {
    this.plantilla = this._async.getAllDatos('plantillas');
    this.plantilla = this.plantilla.filter((d) => d.fecha === this.fecha);
  }

  initVoleo() {
    for (const p of this.plantilla) {
      // Verificar si el usuario ya tien inicialisado el voleo que se seleccinó
      if (
        !p.voleos.rendimientos.find(
          (d) => d.idProgramaVoleo + '' === this.idPrograma + ''
        )
      ) {
        p.voleos.rendimientos.push({
          idProgramaVoleo: Number(this.idPrograma),
          producto: this.programa.producto,
          pago: null,
          sacos: null,
          horaInicio: null,
          horaFin: null,
          descuento: 0,
        });
      }
    }
    this.save();
  }
  calcularPagos(dato, datos) {
    console.log(this.disponibles);
    this.calcularDisponibles();
    if (this.disponibles < 0) {
      this.getDatos();
      this._recursos.alertaNoti(
        'Error',
        'Exceso de sacos',
        `Solo se programaron ${this.programa.sacos} sacos`
      );
      return;
    }
    dato.pago = dato.sacos * this.programa.precio;
    datos.total = 0;
    for (const d of datos.rendimientos) {
      datos.total += Number(d.pago);
    }
    this.save();
  }
  calcularDisponibles() {
    this.disponibles = 0;
    for (const plantilla of this.plantilla) {
      this.disponibles += Number(
        plantilla.voleos.rendimientos.find(
          (d) => d.idProgramaVoleo + '' === this.idPrograma + ''
        ).sacos
      );
    }
    this.disponibles = Number(this.programa.sacos) - this.disponibles;
  }

  save() {
    this.plantillaAll = this._async.getAllDatos('plantillas');
    this.plantillaAll = this.plantillaAll.filter(
      (d) => d.fecha + '' !== this.fecha + ''
    );
    console.log('ff', this.plantillaAll);
    // return;
    for (const p of this.plantilla) {
      this.plantillaAll.push(p);
    }
    localStorage.setItem('plantillas', JSON.stringify(this.plantillaAll));
  }

  back() {
    this.recalcularTodosDescuentos();
    this.navCtrl.navigateBack(`domingos/voleo/${this.fecha}`);
  }

  asignaHorariosAll() {
    if(this.horaInicio == null || this.horaFin == null){
      return;
    }
    if (!(this.horaInicio < this.horaFin)) {
      
      this._recursos.alertaNoti(
        'Error',
        'Horario erroneo',
        'La hora de inicio tiene que ser menor a la final !!!',
        'custom-alert-header-error'
      );
      return;
    }
    for (const empleado of this.plantilla) {
      for (const rendimiento of empleado.voleos.rendimientos) {
        rendimiento.horaInicio = this.horaInicio;
        rendimiento.horaFin = this.horaFin;
        // Calcular la diferencia en milisegundos
        const inicio: Date = this.parseTime(rendimiento.horaInicio);
        const fin: Date = this.parseTime(rendimiento.horaFin);
        const diferenciaMs: number = fin.getTime() - inicio.getTime();

        // Convertir la diferencia a horas
        const diferenciaHoras: number = diferenciaMs / (1000 * 60 * 60);

        rendimiento.descuento = rendimiento.pago> 0? (this.programa.precioHora * diferenciaHoras):0;
      }
    }
    this.save();
  }
  parseTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = this._async.getFechaMexHoy();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  calcularIndividualDescuento(rendimiento) {
    // Validar horario
    if(rendimiento.horaInicio>rendimiento.horaFin){
      this._recursos.alertaNoti(
        'Error',
        'Horario erroneo',
        'La hora de inicio debe ser menor que la final!!',
        'custom-alert-header-error'
      );
      this.getDatos();
      return;
    }
    // Calcular la diferencia en milisegundos
    const inicio: Date = this.parseTime(rendimiento.horaInicio);
    const fin: Date = this.parseTime(rendimiento.horaFin);
    const diferenciaMs: number = fin.getTime() - inicio.getTime();

    // Convertir la diferencia a horas
    const diferenciaHoras: number = diferenciaMs / (1000 * 60 * 60);

    rendimiento.descuento = rendimiento.pago> 0? (this.programa.precioHora * diferenciaHoras):0;
    this.save();
  }

  recalcularTodosDescuentos() {
    for (const empleado of this.plantilla) {
      for (const rendimiento of empleado.voleos.rendimientos) {
        if (!(rendimiento.horaInicio < rendimiento.horaFin)) {
          return;
        }
        // Calcular la diferencia en milisegundos
        const inicio: Date = this.parseTime(rendimiento.horaInicio);
        const fin: Date = this.parseTime(rendimiento.horaFin);
        const diferenciaMs: number = fin.getTime() - inicio.getTime();
        // Convertir la diferencia a horas
        const diferenciaHoras: number = diferenciaMs / (1000 * 60 * 60);
        rendimiento.descuento = rendimiento.pago> 0? (this.programa.precioHora * diferenciaHoras):0;
      }
    }
    this.calcularGranDescuento();
  }

  calcularGranDescuento() {
    for (const empleado of this.plantilla) {
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
    this.save();
  }
}
