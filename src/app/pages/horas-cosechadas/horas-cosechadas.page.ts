import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IHorarioCosecha } from 'src/app/interfaces/papeleta';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';

@Component({
  selector: 'app-horas-cosechadas',
  templateUrl: './horas-cosechadas.page.html',
  styleUrls: ['./horas-cosechadas.page.scss'],
})
export class HorasCosechadasPage implements OnInit {
  idRancho: string;
  idSupervisor: string;
  listaHorarios: any[] = [];
  horarios: IHorarioCosecha[] = [];
  date: string;
  fecha: any;
  editar = 0;
  rancho: any;
  h: any;

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    private _recursos: RecursosService,
    private _async: AsyncService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('idTipoUsuario')) {
      this.editar = Number(localStorage.getItem('idTipoUsuario'));
    }
    this.idRancho = this.activatedRoute.snapshot.paramMap.get('idRancho');
    this.getRancho();

  }

  ionViewDidEnter() {
    let date = this._async.getFechaMexHoy();
    this.date = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.h = this._async.getFechaMexHoy();
    this.h = this.datepipe.transform(this.h, 'yyyy-MM-dd');
    this.fecha = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.idRancho = this.activatedRoute.snapshot.paramMap.get('idRancho');
    this.idSupervisor =
      this.activatedRoute.snapshot.paramMap.get('idSupervisor');
    this.obtenerHorarios();
    this.getRancho();
  }

  getRancho(){
    this.rancho =  this._async.getData('ranchos').find(d => d.idRancho === this.idRancho).rancho;
  }
  back() {
    this.navCtrl.navigateBack(`/`);
  }
  obtenerHorarios(fecha = null) {
    this.horarios = JSON.parse(localStorage.getItem('horariosCosecha'))
      ? JSON.parse(localStorage.getItem('horariosCosecha'))
      : [];
    let v = this.horarios.filter(
      (b) =>
        b.idSupervisor === this.idSupervisor &&
        b.fecha == (fecha !== null ? fecha : this.date) &&
        b.idRancho === this.idRancho
    );
    let filtrado = v ? v : [];
    this.listaHorarios = filtrado;
    this.date = fecha !== null ? fecha : this.date;
  }
  modificar(sector: number) {
    this.navCtrl.navigateForward([
      'horas-cosechadas',
      this.idRancho,
      this.idSupervisor,
      'agregar-horario',
      sector,
      this.idRancho,
      this.idSupervisor,
    ]);
  }
  continuar() {
    this.navCtrl.navigateForward(
      `horas-cosechadas/${this.idRancho}/${this.idSupervisor}/agregar-horario/sector/${this.idRancho}/${this.idSupervisor}`
    );
  }

  editarRegistros(fecha) {
    let cargado = false;
    fecha = this.datepipe.transform(fecha, 'yyyy-MM-dd');
    if(this.fecha === this.date){
      return;
    }
    for (const horario of this.horarios.filter(
      (b) =>
        b.idSupervisor === this.idSupervisor &&
        b.fecha + '' === this.fecha + '' &&
        b.idRancho === this.idRancho && b.estatus == 1
    )) {
      if (horario.estatus == 0) {
        cargado = true;
        break;
      }
      horario.fecha = fecha;
    }
    if(!cargado && this.horarios.filter(
      (b) =>
        b.idSupervisor === this.idSupervisor &&
        b.fecha + '' === this.fecha + '' &&
        b.idRancho === this.idRancho && b.estatus == 1
    ).length>0){
      this.fecha = fecha;
      localStorage.setItem('horariosCosecha', JSON.stringify(this.horarios));
      this._recursos.toastM('bottom', 'Actualización exitoso', 1000);
      this.obtenerHorarios(fecha);
    }else{
      this._recursos.toastM('bottom', 'Los registros ya se encuentran cagados y no se pueden editar', 4000);

    }
  }
  eliminarHorarios(){
    localStorage.setItem('horariosCosecha', JSON.stringify(this.horarios.filter(
      (b) =>
        b.idSupervisor === this.idSupervisor &&
        b.fecha + '' !== this.fecha + '' &&
        b.idRancho === this.idRancho
    )));
      this._recursos.toastM('bottom', 'Eliminación exitoso', 1000);
      this.obtenerHorarios(this.fecha);
    
  }
  aviso(){
    this._recursos.toastM('bottom', 'Solo puedes cargar datos de la fecha actual', 1000);
  }
}
