import {  Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ICaptura } from 'src/app/interfaces/papeleta';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';



@Component({
  selector: 'app-cosecha',
  templateUrl: './cosecha.page.html',
  styleUrls: ['./cosecha.page.scss'],
})
export class CosechaPage implements OnInit{
  id: string = '';
  capturas: ICaptura[] = [];
  inter = 0;
  date: any;
  rancho: string;

  constructor(
    private navCtrl: NavController, private activatedRoute: ActivatedRoute, private _async: AsyncService,
    private _recursos: RecursosService) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getRancho();
  }

  ngOnInit() {
    this.date = this._recursos.getFechaHoy().fecha;
  }

  ionViewDidEnter(){
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getRancho()
    this.getData();
  }
  getRancho(){
    this.rancho =  this._async.getData('ranchos').find(d => d.idRancho === this.id).rancho;
  }

  getData() {
    this.capturas = this._recursos.ordernarAsc(
      this._async.getData('capturaCosecha') ? this._async.getData('capturaCosecha').filter(d => d.idRancho === Number(this.id) && d.fecha+'' === this.date+'') : [], 'fecha');
  }

  addPapeleta(papeleta = 0) {
    this.navCtrl.navigateForward(`cosecha/${this.id}/add-papeleta/${papeleta}`);
  }

  back() {
    this.navCtrl.navigateBack(`/`);
  }
  
  public trackBy(index: number, value: any) {
    return value.papeleta;
  }
  eliminarPapeleta(papeleta){
    this.capturas = this.capturas.filter((dat) => dat.papeleta !== Number(papeleta));
    localStorage.setItem('capturaCosecha', JSON.stringify(this.capturas));
    this.getData();
  }
  
  public deletePapeleta(papeleta: any, evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();
    
    
    this.capturas = this.capturas.filter((dat) => dat.papeleta !== Number(papeleta.papeleta));
    localStorage.setItem('capturaCosecha', JSON.stringify(this.capturas));
    this.getData();
  }
}
