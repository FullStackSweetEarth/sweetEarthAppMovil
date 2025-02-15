/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-var */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import html2canvas from 'html2canvas';

import {
  NgSignaturePadOptions,
  SignaturePadComponent,
} from '@almothafar/angular-signature-pad';
import { IActividades } from 'src/app/interfaces/actividadesPlus';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { IEmpleado } from '../../usuario/usuario.page';
import { AlertController, NavController } from '@ionic/angular';
import { IEmpleados } from 'src/app/interfaces/actividadesPlus';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cosecha',
  templateUrl: './cosecha.page.html',
  styleUrls: ['./cosecha.page.scss'],
})
export class CosechaPage implements OnInit {
  foto: any;
  horas: {horaI, horaF};
  @ViewChild('signature2')
  public signaturePad: SignaturePadComponent;

  public signaturePadOptions: NgSignaturePadOptions = {
    minWidth: 2,
    canvasWidth: 300,
    canvasHeight: 180,
    backgroundColor: '#f6ecb700',
  };
  paga_reclutador: number;
  ngAfterViewInit() {
    if (this.signaturePad) {
      this.signaturePad.set('minWidth', 2); // set szimek/signature_pad options at runtime
      this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    }
  }
  async limp() {
    if (this.signaturePad) {
      const alert = await this.alertController.create({
        header: '¿Está seguro que desea borrar la firma?',
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
              this.foto = null;
              this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
            },
          },
        ],
      });

      await alert.present();
    }
  }

  drawComplete(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onEnd event
    this.foto = this.signaturePad.toDataURL();
  }

  plantilla: IEmpleados[] = [];
  disponibles: any[] = [];
  allPlantillas: IEmpleados[] = [];
  plantillaAux: IEmpleados[] = [];
  idRancho: string;
  idSupervisor: number;
  cultivos: any[] = [];
  fecha: any;
  info: any;
  info2: any;
  edi = false;
  palabra: string;
  constructor(
    private _async: AsyncService,
    private activatedRoute: ActivatedRoute,
    private _recursos: RecursosService,
    private navCtrl: NavController,

    private alertController: AlertController
  ) {}

  ngOnInit() {
    if (this.signaturePad) {
      this.signaturePad.set('minWidth', 2); // set szimek/signature_pad options at runtime
      this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    }
    this.paga_reclutador = Number(localStorage.getItem('paga_reclutador'));

    environment.fechaPagoAvance = JSON.parse(
      localStorage.getItem('fechaPagoAvance')
    );

    this.fecha = environment.fechaPagoAvance;
    this.idRancho = this.activatedRoute.snapshot.paramMap.get('idRancho');
    this.idSupervisor = Number(
      this.activatedRoute.snapshot.paramMap.get('idSupervisor')
    );
    this.cultivos = this._async
      .getAllDatos('variedades');
    this.precioCajas();
    this.getEmpleados();
    setTimeout(() => {
      this.addRendimientos();
    }, 1000);
  }

  initVar(){
    this.horas = {
      horaI: null,
      horaF: null
    }
  }
  precioCajas() {
    const encontrar = this._async
      .getAllDatos('pCosecha')
      .filter(
        (d) =>
          d.idRancho === this.idRancho + '' &&
          d.idSupervisor === this.idSupervisor + '' &&
          d.fecha === this.fecha
      );
    let bus;
    if (encontrar.length > 0) {
      this.info = encontrar[0];
      
    let cos: any = this._async.getAllDatos('bitacoraCosHoras');
    cos = cos.find((d) => d.id === this.info.id);
    if (cos) {
      this.horas={
        horaI:cos.horaInicio,
        horaF: cos.horaFin
      } 
    }else{
      this.initVar();
    }
      for (const cultivo of this.cultivos) {
        bus = encontrar.find((d) => d.idCultivo + '' === cultivo.id + '');
        this.info[cultivo.id] = {
          precio: null,
          nombre: null,
        };
        this.info[cultivo.id].precio = bus ? bus.precioCJM : 0;
        this.info[cultivo.id].p = bus ? bus.precioCJM : 0;
        this.info[cultivo.id].nombre = cultivo.nombre;
      }console.log(this.info,'info');
    } else {
      this._recursos.toastM(
        'bottom',
        'No Hay programacion para el supervisor y rancho seleccionado',
        5000
      );
      this.back();
    }
  }

  getEmpleados() {
    this.plantilla = this._async.getColeccionDatos(
      'plantillas',
      environment.fechaPagoAvance,
      'fecha'
    );
    for (const p of this.plantilla) {
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
  addRendimientos() {
    for (const empleado of this.plantillaAux) {
      if (empleado.cosecha.rendimientos.length === 0) {
        for (const cultivo of this.cultivos) {
          empleado.cosecha.rendimientos.push({
            idCultivo: cultivo.id,
            cultivo: cultivo.nombre,
            idRancho: Number(this.idRancho),
            idSupervisor: Number(this.idSupervisor),
            capturas: {
              cajas: null,
              pago: 0,
              precio: 0,
              rangoFinal: 0,
              rangoInicial: 0,
            },
            nombre: '',
            pago: null,
            supervisor: '',
          });
        }
      }
    }
  }

  updatePagos() {
    console.log('hola');
    for (const empleado of this.plantillaAux) {
      empleado.cosecha.cajas = 0;
      empleado.cosecha.pago = 0;
      for (const rendi of empleado.cosecha.rendimientos.filter(
        (d) =>
          d.idRancho + '' === this.idRancho + '' &&
          d.idSupervisor + '' === this.idSupervisor + ''
      )) {
        // alert('hola')
        rendi.capturas.pago =
          rendi.capturas.cajas * this.info[rendi.idCultivo]['precio'];
        empleado.cosecha.cajas += rendi.capturas.cajas;
        empleado.cosecha.pago += rendi.capturas.pago;
      }
    }
    console.log(this.plantillaAux,'');
    return;
    this.saveChange();
  }
  saveChange() {
    this.allPlantillas = this._async.getAllDatos('plantillas');
    this.allPlantillas = this.allPlantillas.filter(
      (d) => d.fecha !== environment.fechaPagoAvance
    );
    for (const dat of this.plantillaAux) {
      this.allPlantillas.push(dat);
    }
    localStorage.setItem('plantillas', JSON.stringify(this.allPlantillas));
  }
  back() {
    this.navCtrl.navigateBack(`escoger-rancho/7`);
  }
  verRecibo(empleado) {
    this.info2 = empleado;
    document.getElementById('precios2').click();
  }
  cerrar() {
    let aux = this.info2;
    aux.firma = this.foto ? this.foto : null;
    aux.recibos[aux.recibos.length - 1].firma = this.foto ? this.foto : null;
    this.foto = null;
    setTimeout(() => {
      let allPlantillas = this._recursos.getDatosLocales('plantillas');
      allPlantillas = allPlantillas.filter(
        (d) => d.fecha !== environment.fechaPagoAvance
      );
      allPlantillas = allPlantillas ? allPlantillas : [];
      for (const dat of this.plantillaAux) {
        allPlantillas.push(dat);
      }
      localStorage.setItem('plantillas', JSON.stringify(allPlantillas));
      this.getEmpleados();
    }, 100);
  }
  

  asignarHorarios() {
    setTimeout(() => {
      if (this.horas.horaF && this.horas.horaI) {
        let cos = this._async.getAllDatos('bitacoraCosHoras');
        cos = cos.filter((d) => Number(d.id) !== Number(this.info.id));

        let dat = {
          horaInicio: this.horas.horaI,
          horaFin: this.horas.horaF,
          id: this.info.id
        };
        cos.push(dat);
        localStorage.setItem('bitacoraCosHoras', JSON.stringify(cos));
      }
    }, 100);
  }
  getCultivoImagen(cultivo: any): string {
    if (!cultivo || !cultivo.cultivo) return ''; // Evita errores si es undefined
    const cultivoNombre = cultivo.cultivo.toLowerCase(); // Aplica lowercase
    return `assets/imagenes/${cultivoNombre}.svg`;
  }
  getCultivoImagen2(cultivo: any): string {
    if (!cultivo || !cultivo.nombre) return ''; // Evita errores si es undefined
    const cultivoNombre = cultivo.nombre.toLowerCase(); // Aplica lowercase
    return `assets/imagenes/${cultivoNombre}.svg`;
  }
}
