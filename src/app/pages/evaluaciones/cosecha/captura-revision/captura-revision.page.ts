import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ICapturaE, IEvaluaciones } from 'src/app/interfaces/evaluaciones';
import { RecursosService } from 'src/app/services/recursos.service';

@Component({
  selector: 'app-captura-revision',
  templateUrl: './captura-revision.page.html',
  styleUrls: ['./captura-revision.page.scss'],
})
export class CapturaRevisionPage implements OnInit {
  listaRanchos: any[] = [];
  form: ICapturaE;
  listaSectores: any[] = [];
  listaTuneles: any[] = [];
  rubros: any[] = [];

  numEmpleado: string;
  fecha: string;
  idSector: string;
  idRancho: string;
  nombre: string;
  constructor(
    private _recursos: RecursosService,
    private navCont: NavController,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.numEmpleado = this.activatedRoute.snapshot.paramMap.get('numEmpleado');
    this.fecha = this.activatedRoute.snapshot.paramMap.get('fecha');
    this.idRancho = this.activatedRoute.snapshot.paramMap.get('idRancho');
    this.idSector = this.activatedRoute.snapshot.paramMap.get('idSector');
    this.nombre = this.activatedRoute.snapshot.paramMap.get('nombre');
    this.rubros = this._recursos.getDatosLocales('evaluacionesRubros');


    this.listaRanchos = this._recursos.getDatosLocales('ranchos');
    this.initVar();
  }
  initVar() {
    this.form = {
      idRancho: Number(this.idRancho)>0?this.idRancho: null,
      idSector:  Number(this.idSector)>0?this.idSector: null,
      idTunel: null,
      estacas: null,
      hora: null,
      rubros: this.rubros
    };
    if(Number(this.form.idRancho)>0){
      this.getSctores();
      this.getTuneles();
    }
  }
  getSctores() {
    this.listaSectores = this.listaRanchos.find(
      (d) => d.idRancho === this.form.idRancho
    ).sectores;
  }
  back() {
    this.navCont.navigateBack(`evaluaciones/cosecha/revisiones/${this.numEmpleado}/${this.fecha}/${this.nombre}`);
  }

  getTuneles() {
    this.listaTuneles = this.listaSectores.find(
      (d) => d.plantacionID + '' === this.form.idSector + ''
    ).tuneles;
  }

  asignarHorarios(event: any, type) {
    if (event.detail.value === undefined) {
      this.form.hora = '2024-07-31T' + this._recursos.getHora24() + ':00';
    }
  }

  sumar(datos) {
    datos.frutos =datos.frutos === null?1: 1+datos.frutos;
  }
  restar(datos) {
    if(datos.frutos >0){

      datos.frutos -= 1;
    }
  }
  addEvaluacion(){
    let aux: any = this._recursos.getDatosLocales(
      'bitacoraEvaluacionCosecha'
    );  
    this.form.tunel = this.listaTuneles.find(d=> d.id === this.form.idTunel ).tunel;
    this.removeOrCreateCaptura(aux,this.fecha,this.numEmpleado, this.form.idRancho, this.form.idSector, this.form.idTunel, this.form)
    localStorage.setItem('bitacoraEvaluacionCosecha', JSON.stringify(aux));
    this._recursos.toastM('bottom','Registro exitoso',2000)
    this.initVar();
  }
   removeOrCreateCaptura(
    evaluaciones: IEvaluaciones[],
    fecha: string,
    numEmpleado: number | string,
    idRancho: number | string,
    idSector: number | string,
    idTunel: number,
    capturaData: ICapturaE
  ): void {
    // Encuentra o crea la evaluación por fecha
    let evaluacion = evaluaciones.find(e => e.fecha === fecha);
    if (!evaluacion) {
      evaluacion = { fecha, empleados: [] };
      evaluaciones.push(evaluacion);
    }
  
    // Encuentra o crea el empleado
    let empleado = evaluacion.empleados!.find(e => e.numEmpelado === numEmpleado);
    if (!empleado) {
      empleado = { numEmpelado: numEmpleado, nombre: '', historial: [] };
      evaluacion.empleados!.push(empleado);
    }
  
    // Encuentra o crea el historial por fecha
    let historial = empleado.historial.find(h => h.fecha === fecha);
    if (!historial) {
      historial = { fecha, ranchos: [] };
      empleado.historial.push(historial);
    }
  
    // Encuentra o crea el rancho
    let rancho = historial.ranchos.find(r => r.rancho === idRancho.toString());
    let ranchoD = this.listaRanchos.find(d => d.idRancho === idRancho);
    if (!rancho) {
      rancho = { rancho: idRancho.toString(), nombre:ranchoD.rancho, sectores: [] };
      historial.ranchos.push(rancho);
    }
  
    // Encuentra o crea el sector
    let sector = rancho.sectores.find(s => s.sector === idSector.toString());
    if (!sector) {
      sector = { sector: idSector.toString(), nombre:this.listaSectores.find(d => d.plantacionID === idSector).sector.toString(), capturas: [] };
      rancho.sectores.push(sector);
    }
  
    // Filtra las capturas que coincidan con el idTunel, idRancho y idSector para eliminarla si existe
    sector.capturas = sector.capturas.filter(
      captura => !(captura.idTunel === idTunel && captura.idRancho === idRancho && captura.idSector === idSector)
    );
  
    // Agrega la nueva captura
    sector.capturas.push(capturaData);
  }
  
  
}
