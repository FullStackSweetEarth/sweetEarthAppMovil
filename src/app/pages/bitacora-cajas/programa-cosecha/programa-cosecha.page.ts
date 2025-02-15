import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RecursosService } from 'src/app/services/recursos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-programa-cosecha',
  templateUrl: './programa-cosecha.page.html',
  styleUrls: ['./programa-cosecha.page.scss'],
})
export class ProgramaCosechaPage implements OnInit {
  listaProgramaCosecha: any[] = [];
  palabra = '';
  fecha = localStorage.getItem('fechaCosecha')
  constructor(private navCtrl: NavController, private _recursos: RecursosService) { }

  ngOnInit() {
    this.listaProgramaCosecha = this._recursos.getDatosLocales('actCosecha');
    this.listaProgramaCosecha = this.listaProgramaCosecha.length>0?this.listaProgramaCosecha.filter(d => d.fecha === this.fecha):[];
  }
  back(){
    this.navCtrl.navigateBack(`bitacora-cajas`);
  }

  capturar(dato){
    localStorage.setItem('programaCosechaCaptura',JSON.stringify(dato));
    this.navCtrl.navigateForward('bitacora-cajas/programa-cosecha/capturar-cajas');
  }

}
