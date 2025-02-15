/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-var */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import html2canvas from 'html2canvas';

import {
  NgSignaturePadOptions,
  SignaturePadComponent,
} from '@almothafar/angular-signature-pad';
import { RecursosService } from 'src/app/services/recursos.service';
import { environment } from 'src/environments/environment';
import { IActividades, IEmpleados } from 'src/app/interfaces/actividadesPlus';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { IEmpleado } from '../../usuario/usuario.page';
import { ActivatedRoute } from '@angular/router';
import { AsyncService } from 'src/app/services/async.service';
@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.page.html',
  styleUrls: ['./plantilla.page.scss'],
})
export class PlantillaPage implements OnInit {
  app = initializeApp(environment.firebaseConfig);
  storag = getStorage(this.app);
  @ViewChild('signature')
  public signaturePad: SignaturePadComponent;

  public signaturePadOptions: NgSignaturePadOptions = {
    minWidth: 2,
    canvasWidth: 300,
    canvasHeight: 180,
    backgroundColor: '#f6ecb700',
  };
  foto: string;
  imagenCreada: string;
  imgcreada: boolean;
  fecha: any;
  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
    },
  ];
  actionSheetButtons: (
    | { text: string; role: string; data: { action: string } }
    | { text: string; data: { action: string }; role?: undefined }
  )[];
  nuevaFecha: any;
  hoy: any;
  noEncontrado: any;
  uid: any;
  reclutadores: any[] = [];
  reclutadores2: any;
  paga_reclutador;
  volver: string;
  isModalOpen: boolean = false;
  devMode: boolean;

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

  drawStart(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onBegin event
  }

  page = null;

  empleados: any[] = [];
  empleadosAux: any[] = [];
  palabra: any = '';
  palabra2: any = '';
  bandera1 = false;
  bitacoraRG: any = false;
  plantilla: any[] = [];
  plantillas: any[] = [];
  plantilasTodas: any[] = [];
  info: IEmpleados;

  presentingElement: any;
  empleado: any;
  
  recargarPlantilla = environment.recargarPlantilla;
  conFirma = 0;

  async canDismiss(data?: any, role?: string) {
    return true;
  }
  constructor(
    private navCtrl: NavController,
    private _recursos: RecursosService,
    private alertController: AlertController,
    public actionSheetCtrl: ActionSheetController,
    private activatedRoute: ActivatedRoute,
    private _async: AsyncService
  ) {}



  ngOnInit() {
    this.devMode = environment.devMode;
    this.presentingElement = document.querySelector('.ion-page');
    this.paga_reclutador = Number(localStorage.getItem('paga_reclutador'));
    this.hoy = this._recursos.getFechaHoy().fecha;
    environment.fechaPagoAvance = this._recursos.getFechaHoy().fecha;
    this.fecha =  this._recursos.getFechaHoy().fecha;
    localStorage.setItem('fechaPagoAvance', JSON.stringify(this.fecha));
    environment.fechaPagoAvance = localStorage.getItem('fechaPagoAvance');
    this.getReclutadores();

    const diasARestar = JSON.parse(localStorage.getItem('diasFichas')); // Cantidad de días a restar
    this.uid = localStorage.getItem('uid');
    this.nuevaFecha = this._recursos.restarDias(this._async.getFechaMexHoy(), diasARestar - 1);
    this.nuevaFecha = this.nuevaFecha.toISOString().split('T')[0];
    this.actionSheetButtons = [
      {
        text: 'Delete',
        role: 'destructive',
        data: {
          action: 'delete',
        },
      },
      {
        text: 'Share',
        data: {
          action: 'share',
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ];
    this.initVar();
  }
  initVar() {
    this.empleado = {
      clave: null,
      codigo: null,
      curp: null,
      idEstatus: null,
      idsupervisor: null,
      nombre: null,
      numEmpleado: null,
      rancho: null,
      paterno: null,
      materno: null,
    };
  }
  async addExterno() {
    if (true) {
      this.registro();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        subHeader: 'CURP no válida',
        message: '¿Desea continuar sin agregár CURP al empleado?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              // this.registro();
            },
          },
          {
            text: 'Si',
            handler: () => {
              this.registro();
            },
          },
        ],
      });
      await alert.present();
    }
  }

  registro() {
    this.empleado.clave = 'EXT-' + (Math.floor(Math.random() * 90000) + 10000);
    this.empleado.numEmpleado = this.empleado.clave;
    this.empleado.idEstatus = '1';
    this.empleado.idsupervisor = '1';
    this.empleado.rancho = 'Sin Rancho';
    this.empleados = this.empleados.filter(
      (d) => d.curp !== this.empleado.curp
    );
    this.addEmpleado(this.empleado);
    this.empleados.push(this.empleado);
    localStorage.setItem('empleados', JSON.stringify(this.empleados));
    this._recursos.toastM('bottom', 'Registro Exitoso', 3000);
    this.initVar();
    this.getEmpleados();
  }
  esCURPValida(curp) {
    var re = /^[A-Z]{4}\d{6}[H,M][A-Z]{5}[A-Z0-9]\d$/;
    return re.test(curp);
  }
  ionViewDidEnter() {
    this.getEmpleados();
  }

  getEmpleados() {
    localStorage.setItem('fechaPagoAvance', JSON.stringify(this.fecha));

    environment.fechaPagoAvance = this.fecha;
    this.empleados = this._recursos.getDatosLocales('empleados');
    this.empleadosAux = this._recursos.getDatosLocales('empleados');
    this.plantillas = this._recursos.getDatosLocales('plantillas');
    this.reclutadores = this._recursos.getDatosLocales('reclutadores');
    if (this.plantillas.length > 0) {
      this.noEncontrado = false;
    } else {
      this.noEncontrado = true;
    }
    this.plantillas = this.plantillas === null ? [] : this.plantillas;
    this.plantillas = this.plantillas.filter(
      (d) => d.fecha + '' === '' + this.fecha
    );
    console.log(this.plantillas);
    // this._recursos.ordernarAsc(this.plantillas, 'firma');
    this.plantillas =  this.plantillas.sort((a, b) => {
      if (a.firma === undefined && b.firma !== undefined) {
        return -1; // a va antes que b
      } else if (a.firma !== undefined && b.firma === undefined) {
        return 1; // b va antes que a
      } else {
        return 0; // Mantener el orden actual
      }
    });
  }

  back() {
    this.navCtrl.navigateBack(`/`);
  }

  buscar() {
    setTimeout(() => {
      if (this.palabra.length > 0 && this.palabra !== null) {
        this.bandera1 = true;
        const pre = this.empleados.filter((d) =>
          d.nombre
            .toLocaleLowerCase()
            .includes(this.palabra.toLocaleLowerCase())
        );
        this.empleadosAux = pre;
      } else {
        this.empleadosAux = [];
        this.bandera1 = false;
      }
    }, 200);
  }
  limpear() {
    setTimeout(() => {
      this.bandera1 = false;
      this.palabra = '';
    }, 100);
  }

  addEmpleado(empleado: IEmpleados) {
    if (this.plantillas.find((d) => d.codigo === empleado.numEmpleado)) {
      this._recursos.toastM('bottom', 'El usuario ya ha sido añadido', 3000);
      return;
    }
    empleado.uid = this.uid;
    empleado.fecha = this.fecha;
    empleado.status = 0;
    empleado.actividades = {
      pago: 0,
      numSurcos: 0,
      granTotal: 0,
      rendimientos: [],
    };
    empleado.cosecha = {
      pago: 0,
      cajas: 0,
      rendimientos: [],
    };
    empleado.porHora = {
      horas: 0,
      horaI: null,
      horaF: null,
      paga: 0,
      precio: 0,
      idRancho: 0,
      idSupervisor: 0,
      rendiminetos: { actividades: [], cosecha: [] },
    };
    empleado.porDia = {
      idRancho: 0,
      idSupervisor: 0,
      paga: 0,
      precio: 0,
      activo: false,
      rendiminetos: { actividades: [], cosecha: [] },
    };
    empleado.reclutados = [];
    empleado.reclutador_precio = Number(
      localStorage.getItem('paga_reclutador')
    );
    // Recibo
    empleado.recibos = [
      {
        actividades: empleado.actividades,
        cosecha: empleado.cosecha,
        porHora: empleado.porHora,
        porDia: empleado.porDia,
        firma: null,
      },
    ];
    empleado.voleos = {total:0, rendimientos:[]}
    this.plantillas.push(empleado);
    
    let allPlantillas = this._recursos.getDatosLocales('plantillas');
    allPlantillas = allPlantillas.filter(
      (d) => d.fecha !== environment.fechaPagoAvance
    );
    allPlantillas = allPlantillas ? allPlantillas : [];
    for (const dat of this.plantillas) {
      allPlantillas.push(dat);

    }
    
    localStorage.setItem('plantillas', JSON.stringify(allPlantillas));

    this.bandera1 = false;
    this._recursos.ordenar('nombre', 1, this.plantilla);
    this.palabra = '';
    this.empleadosAux = this.empleadosAux.filter(
      (d) => d.numEmpleado + '' !== empleado.nombre + ''
    );
    this.noEncontrado = false;
    this._recursos.toastM('bottom', 'Asociado Registrado Exitosamente', 3000);
  }

  async open() {
    this.info.reclutador = this.reclutadores2.find(
      (d) => d.numEmpleado === this.info.numEmpleado && d.fecha === this.fecha
    );
    if(this.info.descuento == -1){
      
    const alert = await this.alertController.create({
      header: 'Actividades sin Horarios',
      subHeader: 'Sin horarios en las actividades' ,
      message: 'Necesita registrar los horarios de las actividades para permitir firmar al empleado !!!',
    });
    await alert.present();
    }else{
      document.getElementById('precios').click();
    }
  }
  cerrar() {
    let aux = this.plantillas.find(d => d.clave+'' === this.info.numEmpleado ||  d.codigo+'' === this.info.numEmpleado)
    aux.firma = this.foto ? this.foto : null;
    aux.recibos[aux.recibos.length - 1].firma = this.foto
      ? this.foto
      : null;
    this.foto = null;
    this.uploadFile(this.foto);
    setTimeout(() => {
      let allPlantillas = this._recursos.getDatosLocales('plantillas');
      allPlantillas = allPlantillas.filter(
        (d) => d.fecha !== environment.fechaPagoAvance
      );
      allPlantillas = allPlantillas ? allPlantillas : [];
      for (const dat of this.plantillas) {
        allPlantillas.push(dat);
      }
      localStorage.setItem('plantillas', JSON.stringify(allPlantillas));
      if(this.volver){
        document.getElementById('c').click();
          this.navCtrl.navigateBack(this.info.ruta);
          
      }else{
        
        this.getEmpleados();
      }
    }, 100);
  }

  async uploadFile(file) {
    if (file) {
      const storageRef = ref(this.storag, 'recibos/' + 'arhcivo.png');
      const snapshot = await uploadBytes(
        storageRef,
        this.base64ToFile(file, 'capucha.png')
      );
      const downloadURL = await getDownloadURL(storageRef);
    }
  }
  base64ToFile(base64String, filename) {
    const parts = base64String.split(';base64,');
    const mimeType = parts[0].split(':')[1];
    const imageData = atob(parts[1]);
    const arrayBuffer = new ArrayBuffer(imageData.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < imageData.length; i++) {
      uintArray[i] = imageData.charCodeAt(i);
    }
    const blob = new Blob([uintArray], { type: mimeType });
    const file = new File([blob], filename, { type: mimeType });
    return file;
  }

  crearImagen() {
    html2canvas(document.getElementById('reciboIMG')).then((canvas) => {
      this.imagenCreada = canvas.toDataURL();
      const a = document.createElement('a');
      a.href = this.imagenCreada;
      a.download = 'image.png';
      a.click();
    });
    this.imgcreada = true;
  }

  continuar() {
    this.navCtrl.navigateForward(`escoger-rancho/7`);
  }

  filtrando() {
    if (this.palabra2 === '') {
      this.noEncontrado = false;
    } else {
      this.noEncontrado = !(
        this.plantillas.filter((d) =>
          this.valdador(
            ['numEmpleado', 'nombre'],
            this.palabra2.toString().toLowerCase(),
            d
          )
        ).length > 0
      );
    }
  }
  valdador(atributos, clave, data) {
    for (const atributo of atributos) {
      if ((data[atributo] + '').toString().toLowerCase().includes(clave)) {
        return true;
      }
    }
  }
  onButtonLongPress(event: any) {
    // Aquí puedes realizar las acciones que desees
  }
  obtenerHorarios() {}
  async deletePlantilla(empleado: IEmpleados) {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      subHeader: 'Eliminación del empleado N° ' + empleado.numEmpleado,
      message: '¿Desea eliminar el empleado del registro?',
      buttons: [
        {
          text: 'No',
          handler: () => {},
        },
        {
          text: 'Si',
          handler: () => {
            const todas = this._recursos
              .getDatosLocales('plantillas')
              .filter(
                (d) =>
                  d.numEmpleado + '-' + d.fecha !==
                  empleado.numEmpleado + '-' + empleado.fecha
              );
            localStorage.setItem('plantillas', JSON.stringify(todas));
            this.getEmpleados();
          },
        },
      ],
    });
    await alert.present();
  }

  async verificar() {
    if (
      !(
        this.empleadosAux.filter((d) =>
          this.valdador(
            ['numEmpleado', 'nombre'],
            this.palabra.toString().toLowerCase(),
            d
          )
        ).length > 0
      )
    ) {
      const alert = await this.alertController.create({
        header: 'Agregar Asociado',
        subHeader: 'El Asociado ' + this.palabra + ' no existe',
        message: '¿Desea dal de ta el Asociado?',
        buttons: [
          {
            text: 'No',
            handler: () => {},
          },
          {
            text: 'Si',
            handler: () => {
              document.getElementById('open-modal-99').click();
            },
          },
        ],
      });
      await alert.present();
    }
  }
  activarReclutador() {
    const dato = {
      numEmpleado: this.info.numEmpleado,
      fecha: this.info.fecha,
      nombre:
        this.info.nombre +
        (this.info.paterno ? ' ' + this.info.paterno : '') +
        (this.info.materno ? ' ' + this.info.materno : ''),
    };
    let reclutadores: any[];
    if (this.info.reclutador) {
      reclutadores = this._recursos.getDatosLocales('reclutadores2');
      reclutadores.push(dato);
    } else {
      reclutadores = this._recursos.getDatosLocales('reclutadores2');
      reclutadores = reclutadores.filter(
        (d) =>
          d.fecha+d.numEmpleado  !== this.info.fecha+this.info.numEmpleado
      );
    }
    localStorage.setItem('reclutadores2', JSON.stringify(reclutadores));
    this.getReclutadores();
  }
  getReclutadores() {
    this.reclutadores2 = this._recursos.getDatosLocales('reclutadores2');
    this.reclutadores2 = this.reclutadores2 ? this.reclutadores2 : [];
    this.reclutadores2 = this.reclutadores2.filter(
      (d) => d.fecha + '' === this.fecha + ''
    );
  }
  validarTipo() {
    return !(Number(this.info.numEmpleado) > 0);
  }
  addEmpleadoReclutador() {
    for (const empleado of this.plantillas) {
      empleado.reclutados = empleado.reclutados
        ? empleado.reclutados.filter(
            (d) => d.numEmpleado !== this.info.numEmpleado
          )
        : [];
    }
    if (
      this.plantillas.find(
        (d) => d.numEmpleado + '' === this.info.idReclutador + ''
      )
    ) {
      this.plantillas.find(
        (d) => d.numEmpleado === this.info.idReclutador
      ).reclutados = [];
      for (const emp of this.plantillas) {
        if (emp.idReclutador + '' === '' + this.info.idReclutador) {
          this.plantillas
            .find((d) => d.numEmpleado === this.info.idReclutador)
            .reclutados.push({
              numEmpleado: emp.numEmpleado,
              nombre:
                emp.nombre +
                (emp.paterno ? ' ' + emp.paterno : '') +
                (emp.materno ? ' ' + emp.materno : ''),
            });
        }
      }
    }
    let allPlantillas = this._recursos.getDatosLocales('plantillas');
    allPlantillas = allPlantillas.filter(
      (d) => d.fecha !== environment.fechaPagoAvance
    );
    allPlantillas = allPlantillas ? allPlantillas : [];
    for (const dat of this.plantillas) {
      allPlantillas.push(dat);
    }
    localStorage.setItem('plantillas', JSON.stringify(allPlantillas));
  }
  esNumber(numEmpleado){
    return Number(numEmpleado)>0;
  }
  
  setOpen2(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
