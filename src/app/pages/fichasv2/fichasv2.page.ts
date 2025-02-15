/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { duration } from 'html2canvas/dist/types/css/property-descriptors/duration';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';

@Component({
  selector: 'app-fichasv2',
  templateUrl: './fichasv2.page.html',
  styleUrls: ['./fichasv2.page.scss'],
})
export class Fichasv2Page implements OnInit {
  idRancho: number;
  idSupervisor: number;
  key = '';
  listaDatos: any[] = [];
  fecha: any;
  palabra;
  listaEmpleados: any[] = [];
  palabra2;
  nuevaFecha: any;
  rancho: any;
  fecha2: any;
  supervisor: any;
  constructor(
    private navCtrl: NavController,
    private _recursos: RecursosService,
    private _actRou: ActivatedRoute,
    private _async:AsyncService
  ) {}

  ngOnInit() {
    this.fecha = this._recursos.getFechaHoy().fecha;
    this.fecha2 = this._recursos.getFechaHoy().fecha;
    this.restringirFechas(),
      (this.idRancho = Number(this._actRou.snapshot.paramMap.get('idRancho')));
    this.idSupervisor = Number(
      this._actRou.snapshot.paramMap.get('idSupervisor')
    );
    this.rancho =  JSON.parse(localStorage.getItem('ranchos')).find(d => Number(d.idRancho) === Number(this.idRancho)).rancho;
    this.supervisor =  JSON.parse(localStorage.getItem('supervisores2')).find(d => Number(d.id) === Number(this.idSupervisor)).nombre;
    this.listaEmpleados = this._recursos.getDatosLocales('empleados').filter(d => d.codigo>0);
    this.generarKey();
    this.getDatos();
  }
  generarKey() {
    this.key = `${this.idRancho}-${this.idSupervisor}-${this.fecha}`;
  }

  back() {
    this.navCtrl.navigateBack(`/`);
  }

  getDatos() {
    this.listaDatos = this._recursos.getDatosLocalesGAll(
      'bitacora_fichas',
      this.key
    );
    this.listaDatos = this.listaDatos
      ? this.listaDatos.length > 0
        ? this.listaDatos
        : this.generarBitacoras()
      :  this.generarBitacoras();
      this._recursos.ordernarAsc(this.listaDatos,'nombre');
    this.addDatos();
  }
  generarBitacoras() {
    let empleados: any[] = this._recursos.getDatosLocales('empleados');
    empleados = empleados.filter(
      (d) => Number(d.idsupervisor) === this.idSupervisor
    );
    empleados = empleados ? empleados : [];
    this.listaDatos = [];
    for (const empleado of empleados) {
      this.listaDatos.push({
        idRancho: this.idRancho,
        idSupervisor: this.idSupervisor,
        numEmpleado: empleado.numEmpleado,
        nombre: empleado.nombre,
        fecha: this.fecha,
        rancho: this.rancho,
        rendimientos: this.generarRendi(),
      });
    }
    this._recursos.ordernarAsc(this.listaDatos, 'nombre');
    return this.listaDatos;
  }

  generarRendi() {
    let rendimientos = this._recursos
      .getDatosLocales('variedades')
  // .filter((d) => d.id !== '3');
    for (const d of rendimientos) {
      d.idCultivo = d.id;
      d.cajas = 0;
    }
    return rendimientos;
  }

  addDatos() {
    this._recursos.addDatosLocalesGAll(
      'bitacora_fichas',
      this.key,
      this.listaDatos
    );
  }
  addEmpleado(empleado) {
    if (!this.listaDatos.find((d) => d.numEmpleado === empleado.numEmpleado)) {
      this.listaDatos.push({
        idRancho: this.idRancho,
        idSupervisor: this.idSupervisor,
        numEmpleado: empleado.numEmpleado,
        nombre: empleado.nombre,
        fecha: this.fecha,
        rancho: this.rancho,
        rendimientos: this.generarRendi(),
      });
      this._recursos.toastM('bottom', 'Registro exitoro', 3000);
      this.palabra2 = '';
    } else {
      this._recursos.toastM(
        'bottom',
        'El usuario ya está en la lista !!!',
        3000
      );
    }
  }

  delete(i) {
    this.listaDatos = this.listaDatos.filter((d) => d.numEmpleado !== i);
    let date: any = JSON.parse(localStorage.getItem('bitacora_fichas_delete'));
    date = date ? date : [];
    let dat = date.find((d) => d.key === this.key);
    if (dat) {
      dat.empleados.push(i);
    } else {
      date.push({
        idRancho: this.idRancho,
        idSupervisor: this.idSupervisor,
        fecha: this.fecha,
        key:this.key,
        empleados: [],
      });
      date[date.length-1].empleados.push(i);
    }
    localStorage.setItem('bitacora_fichas_delete', JSON.stringify(date));
    this.addDatos();
  }
  restringirFechas() {
    const diasARestar = JSON.parse(localStorage.getItem('diasFichas')); // Cantidad de días a restar
    
    this.nuevaFecha = this._recursos.restarDias(this._async.getFechaMexHoy(), diasARestar - 1);
    this.nuevaFecha = this.nuevaFecha.toISOString().split('T')[0];
  }
  clear(e){
  }
  getCultivoImagen2(cultivo: any): string {
    if (!cultivo || !cultivo.nombre) return ''; // Evita errores si es undefined
    const cultivoNombre = cultivo.nombre.toLowerCase(); // Aplica lowercase
    console.log(cultivoNombre);
    return `assets/imagenes/${cultivoNombre}.svg`;
  }
}
