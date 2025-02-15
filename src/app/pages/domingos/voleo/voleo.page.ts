import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RecursosService } from 'src/app/services/recursos.service';

@Component({
  selector: 'app-voleo',
  templateUrl: './voleo.page.html',
  styleUrls: ['./voleo.page.scss'],
})
export class VoleoPage implements OnInit {
  fecha: string;
  programas: any[] = [];
  palabra

  constructor(private activatedRoute: ActivatedRoute, private _recursos: RecursosService,
      private navCtrl: NavController,) { }

  ngOnInit() {
    this.fecha = this.activatedRoute.snapshot.paramMap.get('fecha');
    console.log(this.fecha);
    let dat= this._recursos.getDatosLocales('programaVoleo');
    this.programas = dat.filter(d => d.fecha === this.fecha)?dat.filter(d => d.fecha === this.fecha):[];

  }
  
  back() {
    this.navCtrl.navigateBack(`domingos/plantilla`);
  }

  capturar(id){
    this.navCtrl.navigateForward(`domingos/voleo/${this.fecha}/voleo-captura/${id}`);
  }

}
