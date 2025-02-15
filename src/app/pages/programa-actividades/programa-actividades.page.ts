import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, Gesture, GestureConfig, GestureController, IonModal } from '@ionic/angular';

import { OverlayEventDetail } from '@ionic/core/components';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';
@Component({
  selector: 'app-programa-actividades',
  templateUrl: './programa-actividades.page.html',
  styleUrls: ['./programa-actividades.page.scss'],
})
export class ProgramaActividadesPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  @ViewChildren('pressElement', { read: ElementRef }) pressElements: QueryList<ElementRef>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _recursos: RecursosService,
    private alertController: AlertController,
    private gestureCtrl: GestureController,
    private _async: AsyncService
  ) {}
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;

  customActionSheetOptions = {
    header: 'Sector',
    subHeader: 'Selecciona un sector',
  };
  customActionSheetOptions2 = {
    header: 'Nivel',
    subHeader: 'Selecciona un sector',
  };
  idRancho: number;
  listaSectores: any[] = [];
  rancho: any;
  listaNiveles = [
    {
      value: 1,
      name: '1L',
    },
    {
      value: 2,
      name: '2L',
    },
    {
      value: 3,
      name: '3L',
    },
    {
      value: 4,
      name: '4L',
    },
    {
      value: 5,
      name: '5L',
    },
    {
      value: 6,
      name: '6L',
    },
    {
      value: 7,
      name: '7L',
    },
    {
      value: 8,
      name: '8L',
    },
    {
      value: 9,
      name: '9L',
    },
    {
      value: 10,
      name: '10L',
    },
  ];
  registro: {
    idPlantacion: number;
    sector?: string;
    nivel: string;
    idActividad;
    comentario;
    actividad: string;
    fecha?: string;
    idApp?: string;
  } = {
    comentario: null,
    idActividad: null,
    idPlantacion: null,
    nivel: null,
    actividad: null
  };

  listaActividades: any[] = [];
  buscador: '';
  listaDatos: any[] = [];
  buscador2: '';
  fecha;
  nuevaFecha: any;
  hoy: any;
  
  private pressStartTime: number | null = null;
  private pressDuration = 2000; // 2 seconds
  private pressTimeout: any;
  private isPressing: boolean = false;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm(dato) {
    if(!dato.idActividad){
      
    const alert = await this.alertController.create({
      header: 'Sin Actividad',
      subHeader: 'No a definido una actividad' ,
      message: 'Si desea continuar con el registro seleccione una actividad',
    });
    await alert.present();
      return;
    }
    let todos = this._recursos
      .getDatosLocales('bitacoraActividades')
      .filter((d) => d.fecha+'-'+d.idPlantacion !== this.fecha+'-'+dato.idPlantacion);

    dato.fecha = this.fecha;
    dato.sector = this.listaSectores.find(
      (d) => d.plantacionID === dato.idPlantacion
    ).sector;
    dato.idApp = dato.idApp? dato.idApp: this._recursos.generateUUID();
    this.listaDatos=this.listaDatos.filter(d => d.idActividad+','+d.idPlantacion+','+d.fecha !== dato.idActividad+','+dato.idPlantacion+','+this.fecha)
    this.listaDatos.push(dato);
    for (const dat of this.listaDatos) {
      todos.push(dat);
    }
    localStorage.setItem('bitacoraActividades', JSON.stringify(todos));
    this.getDatos();
    dato.actividad = null;
    dato.comentario = null;
    dato.idActividad = null;
    dato.nivel = null;
    this.registro.idApp = null;
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }



  ngOnInit() {
    this.idRancho = Number(
      this.activatedRoute.snapshot.paramMap.get('idRancho')
    );
    
    const diasARestar = JSON.parse(localStorage.getItem('diasFichas')); // Cantidad de días a restar
    this.nuevaFecha = this._recursos.restarDias(this._async.getFechaMexHoy(), diasARestar - 1);
    this.nuevaFecha = this.nuevaFecha.toISOString().split('T')[0];

    this.hoy = this._recursos.getFechaHoy().fecha;
    this.fecha = this._recursos.getFechaHoy().fecha;
    this.getSectores();
    this.getDatos();
  }

  getSectores() {
    let rancho = this._recursos
      .getDatosLocales('ranchos')
      .find((d) => d.idRancho + '' === this.idRancho + '');
    this.rancho = rancho ? rancho.rancho : '';
    this.listaSectores = rancho ? rancho.sectores : [];
    this.listaActividades = this._recursos.getDatosLocales('actividades');
  }
  getDatos() {
    this.listaDatos = this._recursos.getDatosLocales('bitacoraActividades');
    this.listaDatos = this.listaDatos.filter(d => d.fecha === this.fecha && d.idPlantacion === this.registro.idPlantacion);
    this._recursos.ordernarAsc(this.listaDatos,'actividad')
  }

  async eliminar(dato) {
    
    const alert = await this.alertController.create({
      header: '¿Está seguro que esea borrar el registo?',
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
            let todos = this._recursos
            .getDatosLocales('bitacoraActividades')
            .filter((d) => d.fecha+'-'+d.idPlantacion !== this.fecha+'-'+dato.idPlantacion);
        
            this.listaDatos = this.listaDatos.filter(
              (d) => d.idActividad +'-'+ d.idPlantacion !== dato.idActividad+'-'+dato.idPlantacion
            );
            for (const dat of this.listaDatos) {
              todos.push(dat);
            }
            localStorage.setItem('bitacoraActividades', JSON.stringify(todos));
          },
        },
      ],
    });

    await alert.present();
    
  }

  pressTimer: any;
  pressedItem: any;
  startPress() {
    this.pressTimer = setTimeout(() => {
    }, 500); // Ajusta el tiempo según sea necesario
  }

  endPress() {
    clearTimeout(this.pressTimer);
  }

  deleteItem(f){
    console.log(f);
  }

}
