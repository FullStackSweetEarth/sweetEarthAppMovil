import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RecursosService } from 'src/app/services/recursos.service';

@Component({
  selector: 'app-cosecha',
  templateUrl: './cosecha.page.html',
  styleUrls: ['./cosecha.page.scss'],
})
export class CosechaPage implements OnInit {
  
  uid;
  listaEmpleados: any[] = [];
  palabra;
  hoy
  constructor(private _recursos:RecursosService,
    private navCont: NavController) { }

  ngOnInit() {
    this.uid = localStorage.getItem('uid');
    this.hoy = this._recursos.getFechaHoy().fecha;
    this.getEmpleados();
  }

  getEmpleados(){
    this.listaEmpleados = [];
    this.listaEmpleados = this._recursos.getDatosLocales('empleados').filter(d => d.uID+'' === this.uid);
  }
  revisiones(numEmpleado: string, nombre:string){
    this.navCont.navigateForward(`evaluaciones/cosecha/revisiones/${numEmpleado}/${this.hoy}/${nombre}`);
  }
  back(){
    this.navCont.navigateBack(`/`);


  }

}
