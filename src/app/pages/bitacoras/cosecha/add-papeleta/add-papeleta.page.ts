/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable prefer-const */
/* eslint-disable no-underscore-dangle */
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';
import { ActivatedRoute } from '@angular/router';
import { ICaptura, ISector } from 'src/app/interfaces/papeleta';
import { DatePipe } from '@angular/common';

import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-papeleta',
  templateUrl: './add-papeleta.page.html',
  styleUrls: ['./add-papeleta.page.scss'],
})
export class AddPapeletaPage implements OnInit, AfterViewInit, OnDestroy {
  sizeInfo: 0.7;
  datos: ICaptura;
  capturas: ICaptura[] = [];
  sectorD: ISector;
  supervisores: any[] = [];
  skus: any[] = [];
  numbers: number[] = [];
  idRacho: string;
  sectores: any[] = [];
  customPickerOptions: any;
  selYear: any;
  max="06:18 pm";

  // Fecha hora
  hoy = new Date('yyyy-MM-dd');
  name: string =
    new Date().toISOString().split('T')[0] +
    'T' +
    new Date().toTimeString().split(' ')[0];
  dia = this.hoy.getUTCDate();

  tiempo: any;
  papeleta: string;
  capturasAux: ICaptura;
  papeletass: any[] = [1];
  papeletaAx: string;
  rancho: any;
  darkTheme: NgxMaterialTimepickerTheme;

  constructor(
    private _async: AsyncService,
    private _recursos: RecursosService,
    private activatedRoute: ActivatedRoute,
    private datepipe: DatePipe,
    private navCtrl: NavController
  ) {}

  ngOnDestroy(): void {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.darkTheme = {
      container: {
          bodyBackgroundColor: '#424242',
          buttonColor: '#fff'
      },
      dial: {
          dialBackgroundColor: '#555',
      },
      clockFace: {
          clockFaceBackgroundColor: '#555',
          clockHandColor: '#9fbd90',
          clockFaceTimeInactiveColor: '#fff'
      }
  };
    this.idRacho = this.activatedRoute.snapshot.paramMap.get('id');
    this.papeleta = this.activatedRoute.snapshot.paramMap.get('papeleta');
    this.papeletaAx = this.activatedRoute.snapshot.paramMap.get('papeleta');
    this.getRancho();
    this.getData();
  }

  
  getRancho(){
    this.rancho =  this._async.getData('ranchos').find(d => d.idRancho === this.idRacho).rancho;
  }

  getData() {
    this.supervisores = this._async.getData('supervisores');
    this.capturas = this._async.getData('capturaCosecha')
      ? this._async.getData('capturaCosecha')
      : [];
    this.getCapturas();
    this.sectores = this._recursos.ordernarAsc(
      this._async.getData('ranchos', this.idRacho, 'idRancho', 'sectores'),
      'sector'
    );
    this.datos.rancho = this.sectores[0].rancho;

    this.numbers = this._recursos.getNumberArr();
  }

  getCapturas(validar = false) {
    if (this.papeletaAx + '' === '0' && validar) {
      this.navCtrl.navigateRoot(
        `/cosecha/${this.idRacho}/add-papeleta/${this.datos.papeleta}`
      );
    }
    this.capturasAux = this._async.getData('capturaCosecha')
      ? this._async
          .getData('capturaCosecha')
          .find((dat) => dat.papeleta === Number(this.papeleta))
      : undefined;
    if (this.capturasAux) {
      this.initVar(this.capturasAux.fecha);
    } else {
      this.initVar();
    }
  }
  cambiarPapeleta(valor){
    this.papeleta = valor;
    this.papeletaAx = valor;
    this.capturasAux = this._async.getData('capturaCosecha')
      ? this._async
          .getData('capturaCosecha')
          .find((dat) => dat.papeleta === Number(this.papeleta))
      : undefined;
    if (this.capturasAux) {
      this.initVar(this.capturasAux.fecha);
    } else {
      this.initVar();
    }
  }

  getSkus() {
    this.skus = this._recursos.ordernarAsc(
      this._async
        .getData('skus')
        .filter(
          (data) =>
            data.cultivoID ===
            (this.sectores.find(
              (dat) => dat.plantacionID === this.sectorD.idPlantacion
            )
              ? this.sectores.find(
                  (dat) => dat.plantacionID === this.sectorD.idPlantacion
                ).cultivoID
              : null)
        ),
      'sku'
    );
  }

  initVar(fecha = null) {
    this.datos = this._recursos.initVarPapeleta(this.datos, fecha);
    this.datos.papeleta =
      this.datos.papeleta > 0 ? this.datos.papeleta : Number(this.papeleta);
    this.datos.idRancho = Number(this.idRacho);
    this.sectorD = this._recursos.initVariableSector();
  }

  asignarHora(hora) {
    this.tiempo = hora;
  }

  papeletaSave() {
    if (this.validar(this.datos.papeleta, 'Te falta definir la papeleta') == 1)
      return;
    if (
      this.validar(this.sectorD.numLicencia, 'Te falta definir la licencia') ==
      1
    )
      return;
    if (
      this.validar(this.sectorD.idPlantacion, 'Te falta definir el sector') == 1
    )
      return;
    if (this.validar(this.sectorD.sku, 'Te falta definir el SKU') == 1) return;
    if (this.validar(this.sectorD.cajas, 'Te falta definir las cajas') == 1)
      return;
    if (
      this.validar(
        this.sectorD.idSupervisor,
        'Te falta definir el supervisor'
      ) == 1
    )
      return;
      
    if(!this.validarHora()){
      this._recursos.alertaNoti('Error',"Hora de envio incorrecta","Deben de prestar atención si la hora que cargan es de la mañana o de la tarde.")
      return;
    }
    // Asignación de datos faltantes
    this.sectorD.horaEnvio =
      this.datos.horaEnvio.length == 19
        ? this.datos.horaEnvio
        : this.datos.horaEnvio.substr(0, 19);
    this.sectorD.fechaHora = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm'
    );
    this.sectorD.skuTitulo = this.skus.find(
      (data) => data.idsku === this.sectorD.sku
    ).sku;
    this.sectorD.sector = this.sectores.find(
      (b) => b.plantacionID == this.sectorD.idPlantacion
    ).sector;
    this.sectorD.supervisor = this.supervisores.find(
      (dat) => dat.id === this.sectorD.idSupervisor
    ).nombre;
    this.datos.numRancho = this.sectores.find(
      (b) => b.plantacionID == this.sectorD.idPlantacion
    ).numeroRancho;
    this.datos.totalCajas = Number(this.sectorD.cajas);
    this.datos.sector.push(this.sectorD);

    // Comprobar si existen registros
    if (this.capturasAux ) {
      let papeleta: ICaptura = this._async
        .getData('capturaCosecha')
        .find(
          (dat) =>
            dat.fecha === this._async.getFechaMexHoy().toISOString().split('T')[0] &&
            dat.idRancho === Number(this.idRacho) &&
            dat.papeleta === Number(this.datos.papeleta)
        );

      // Comprobar la existencia del registro
      if (
        papeleta
          ? papeleta.sector.find(
              (dat) =>
                dat.sector === this.sectorD.sector &&
                dat.numLicencia === this.sectorD.numLicencia
            )
          : false
      ) {
        // Buscar por la id de la papelete y el sector el archivo a actualizar.
        this.capturas.find(
          (dat) => dat.papeleta === Number(this.datos.papeleta)
        ).sector[
          this.capturas
            .find((dat) => dat.papeleta === Number(this.datos.papeleta))
            .sector.findIndex(
              (dat) =>
                dat.sector === this.sectorD.sector &&
                dat.numLicencia === this.sectorD.numLicencia
            )
        ] = this.sectorD;

        let existe = this.capturas.find(
          (dat) => dat.papeleta === Number(this.datos.papeleta)
        )
        if(existe) existe.totalCajas =this.sectorD.cajas;
        this.capturas.find(
          (dat) => dat.papeleta === Number(this.datos.papeleta)
        ).status = 1;

        this.addData();
        this._recursos.toastM('bottom', 'Actualización exitosa', 1500);
      } else {
        if(this.papeleta+"" !== this.datos.papeleta+""){
          this.addData(this.datos);
        }else{

          let existe = this.capturas.find(
            (dat) => dat.papeleta === Number(this.datos.papeleta)
          )
          if(existe) existe.totalCajas += this.sectorD.cajas;
          if(existe){
  
            this.capturas
              .find((dat) => dat.papeleta === Number(this.datos.papeleta))
              .sector.push(this.sectorD);
              this.capturas.find(
                (dat) => dat.papeleta === Number(this.datos.papeleta)
              ).status = 1;
          }
          this.addData();
          this._recursos.toastM('bottom', 'Registro exitoso', 1500);
        }
      }
    } else {
      if (this.capturas.length > 0) {
        if (
          this.capturas.find(
            (dat) => dat.papeleta === Number(this.datos.papeleta)
          )
        ) {
          this.capturas.find(
            (dat) => dat.papeleta === Number(this.datos.papeleta)
          ).status = 1;
        }
      }
      this.addData(this.datos);
      this.papeleta = this.datos.papeleta.toString();
      this._recursos.toastM('bottom', 'Registro exitoso', 1500);
    }
    this.getCapturas(true);

    if(this.papeleta+"" !== this.datos.papeleta+""){

      setTimeout(() => {
        
        this.navCtrl.navigateRoot(
          `/cosecha/${this.idRacho}/add-papeleta/${this.datos.papeleta}`
        );
      }, 300);
    }
    this.initVar();
  }

  validar(valor, mensaje) {
    if (valor == null || valor == 0) {
      this._recursos.alertaNoti('Formulario', 'Incompleto', mensaje);
      return 1;
    }
    return 0;
  }

  addData(datos = null) {
    if (datos) {
      this.capturas.push(datos);
    }
    localStorage.setItem('capturaCosecha', JSON.stringify(this.capturas));
    this.getCapturas();
  }
  back() {
    this.navCtrl.navigateBack(`cosecha/${this.idRacho}`);
  }

  editar(sector) {
    if (sector.status === 0) {
      return;
    }
    this.datos.horaEnvio = sector.horaEnvio;
    this.sectorD = sector;
  }

  eliminarSector(sector) {
    this.capturas.find(
      (dat) => dat.papeleta === Number(this.datos.papeleta)
    ).sector = this.capturas
      .find((dat) => dat.papeleta === Number(this.datos.papeleta))
      .sector.filter(
        (dat) => dat.sector !== sector && dat.numLicencia !== sector.numLicencia
      );
    this.addData();
    this.getCapturas();
  }
  public trackBy(index: number, value: any) {
    return value.sector;
  }
  public deleteSector(sector: any, evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();

    this.capturas.find(
      (dat) => dat.papeleta === Number(this.datos.papeleta)
    ).sector = this.capturas
      .find((dat) => dat.papeleta === Number(this.datos.papeleta))
      .sector.filter(
        (dat) =>
          dat.sector !== sector.sector && dat.numLicencia !== sector.numLicencia
      );
    this.addData();
    this.getCapturas();
  }

  eliminarPapeleta(papeleta) {
    this.capturas = this.capturas.filter(
      (dat) => dat.papeleta !== Number(papeleta)
    );
    this.addData();
    this.back();
  }
  validarHora(){
      return this.datos.horaEnvio >= environment.horaI &&  this.datos.horaEnvio <= environment.horaF;
  }
}
