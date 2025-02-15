import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import {
  IFcaptura,
  IFCapturasAll,
  IFTipoAplicacion,
} from 'src/app/interfaces/fumigacion';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-capturas',
  templateUrl: './capturas.page.html',
  styleUrls: ['./capturas.page.scss'],
})
export class CapturasPage implements OnInit {
  listaProductos: any[] = [];
  listaProductosFiltro: any[] = [];
  listaEquipos: any[] = [];
  listaSectores: any[] = [];
  productoSeleccionado: any;
  datoEquipo: any;
  addSector: any;
  fecha: string;
  fechaHora: string;
  idRancho: number;
  idCaptura: string;
  captura: IFcaptura;
  capturasAll: IFCapturasAll[];
  Toast: any;
  banderaValidarForm = false;
  cantidadProducto: number;
  cantidadConvertida: number;
  unidadMedida: string;
  listaUnidades: any[] = ['Kg', 'g', 'L', 'ml', 'm3'];

  txtError: string;
  listaError: any[] = [];
  listaTipoAplicacion: IFTipoAplicacion[] = [];
  horarios: any;
  unidad: any;
  darkTheme: NgxMaterialTimepickerTheme;
  climas: any[] = [];

  constructor(
    private parametros: ActivatedRoute,
    public datepipe: DatePipe,
    private modalctrl: ModalController,
    private router: Router,
    private navCtrl: NavController,
    private _async: AsyncService,
    private _recursos: RecursosService
  ) {}

  ngOnInit() {
    this.darkTheme = {
      container: {
        bodyBackgroundColor: '#424242',
        buttonColor: '#fff',
      },
      dial: {
        dialBackgroundColor: '#555',
      },
      clockFace: {
        clockFaceBackgroundColor: '#555',
        clockHandColor: '#9fbd90',
        clockFaceTimeInactiveColor: '#fff',
      },
    };
    let fum;
    let captaLL;
    let rh;
    this.datoEquipo = 0;
    this.txtError = '';
    this.Toast = Swal.mixin({
      toast: true,
      position: 'center-end',
      showConfirmButton: false,
      timer: 3500,
    });

    this.idRancho = this.parametros.snapshot.params.id;
    captaLL = JSON.parse(localStorage.getItem('capturaFumigacion'));

    this.capturasAll = captaLL ? captaLL : [];
    const date = this._async.getFechaMexHoy();
    this.fecha = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.fechaHora = this.datepipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
    const idGenerate: any = this.generateUUID();

    this.idCaptura = this.parametros.snapshot.params.idCaptura
      ? this.parametros.snapshot.params.idCaptura
      : idGenerate;
    fum = JSON.parse(localStorage.getItem('fumigacion'));
    const fumigacion = fum ? fum : [];
    this.climas = JSON.parse(localStorage.getItem('climas'));
    this.climas = this.climas ? this.climas : [];
    this.listaTipoAplicacion = fumigacion.tipoAplicacion;
    this.listaProductos = fumigacion.productos;

    this.listaEquipos = fumigacion.equipos.filter(
      (b) => b.idRancho == this.idRancho
    );
    this.horarios = fumigacion.horarios.find((b) => b.fecha == this.fecha)
      ? fumigacion.horarios.find((b) => b.idRancho == this.idRancho)
      : null;
    rh = JSON.parse(localStorage.getItem('ranchos'));
    const ranchos = rh ? rh : [];
    this.listaSectores = ranchos.find(
      (b) => b.idRancho === this.idRancho
    ).sectores;
    this.listaSectores = this.listaSectores.filter((b) =>
      idGenerate.numRancho ? b.numeroRancho === idGenerate.numRancho : true
    );
    this.obtenerCaptura();
    this.limiarNuevo();
  }

  limiarNuevo() {
    this.productoSeleccionado = '';
    this.cantidadProducto = null;
    this.unidadMedida = '0';
    this.datoEquipo = 0;
    this.addSector = 0;
    this.validarDatos();
  }

  verDato() {}

  obtenerCaptura() {
    const capturaDia = this.capturasAll.find((b) => b.fecha == this.fecha);
    this.captura = {
      id: this.idCaptura,
      idRancho: this.idRancho,
      horaInicio: '',
      horaFin: '',
      temperatura: '',
      velocidadViento: '',
      clima: '',
      agua: '',
      idTipoAplicacion: 0,
      productos: [],
      equipos: [],
      sectores: [],
      sincronizado: 1,
    };
    if (capturaDia.captura.find((b) => b.id == this.idCaptura)) {
      this.captura = capturaDia.captura.find((b) => b.id == this.idCaptura);
    } else {
      capturaDia.captura.push(this.captura);
      localStorage.setItem(
        'capturaFumigacion',
        JSON.stringify(this.capturasAll)
      );
    }
  }

  agregarProducto() {
    this.validarDatos();
    if (
      this.listaProductos.find(
        (b) => b.nombreCorto == this.productoSeleccionado
      )
    ) {
      const idProducto = this.listaProductos.find(
        (b) => b.nombreCorto == this.productoSeleccionado
      ).id;
      if (!this.captura.productos.find((b) => b.idProducto == idProducto)) {
        if (this.cantidadProducto > 0 && this.cantidadProducto > 0) {
          if (
            this.listaUnidades.find(
              (b) => b.unidadDestino == this.unidadMedida
            ) ||
            true
          ) {
            this.captura.productos.push({
              idProducto,
              nombreProdo: this.productoSeleccionado,
              cantidad: this.cantidadConvertida,
              unidadMedida: this.unidad,
            });
            localStorage.setItem(
              'capturaFumigacion',
              JSON.stringify(this.capturasAll)
            );
            this.Toast.fire({
              title: 'Agregado',
              icon: 'success',
            });
            this.limiarNuevo();
          } else {
            this.Toast.fire({
              title: 'Selecciona Una Unidad de Medida',
              icon: 'error',
            });
          }
        } else {
          this.Toast.fire({
            title: 'Ingresa la Cantidad',
            icon: 'error',
          });
        }
      } else {
        this.Toast.fire({
          title: 'Este producto ya se encuentra registrado',
          icon: 'error',
        });
      }
    } else {
      this.Toast.fire({
        title: 'Selecciona un producto',
        icon: 'error',
      });
    }
  }

  modificarProducto(idProducto: number) {
    this.productoSeleccionado = this.listaProductos.find(
      (b) => b.id == idProducto
    ).nombreCorto;
    this.cantidadProducto = this.captura.productos.find(
      (b) => b.idProducto == idProducto
    ).cantidad;
    this.unidadMedida = this.captura.productos.find(
      (b) => b.idProducto == idProducto
    ).unidadMedida;
  }

  eliminarProduto(idProducto: number) {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'que quieres quitar este producto',
      icon: 'warning',
      showCancelButton: true,
      heightAuto: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const eliminar = this.captura.productos.filter(
          (b) => b.idProducto !== idProducto
        );
        this.captura.productos = eliminar;
        localStorage.setItem(
          'capturaFumigacion',
          JSON.stringify(this.capturasAll)
        );
        this.Toast.fire({
          title: 'Eliminado Correctamente!',
          icon: 'success',
        });
      }
    });
    this.validarDatos();
  }
  convertir() {
    if (this.listaUnidades.length > 0) {
      const tes = this.listaUnidades.find(
        (d) => d.unidadDestino === this.unidadMedida
      );
      this.cantidadConvertida = Number(
        (this.cantidadProducto * (tes ? tes.factor : 1)).toFixed(3)
      );
    }
  }
  validarDatos() {
    this.banderaValidarForm = false;
    this.listaError = [];
    if (this.captura.horaInicio == '') {
      this.banderaValidarForm = true;
      this.listaError.push('Selecciona la hora de Inicio');
    }
    if (this.captura.horaFin == '') {
      this.banderaValidarForm = true;
      this.listaError.push('Selecciona la hora de Fin');
    }
    if (this.captura.horaInicio > this.captura.horaFin) {
      this.banderaValidarForm = true;
      this.listaError.push(
        'La hora de inicio no debe ser Mayor a la hora de fin'
      );
    }
    // validar horarios
    if (this.horarios !== null) {
      if (
        this.captura.horaInicio < this.horarios.horaI ||
        this.captura.horaFin > this.horarios.horaF
      ) {
        this.banderaValidarForm = true;
        this.listaError.push(
          'Los horarios son de ' +
            this.horarios.horaI +
            ' y terminan a las ' +
            this.horarios.horaF
        );
      }
    }
    if (this.captura.idTipoAplicacion == 0) {
      this.banderaValidarForm = true;
      this.listaError.push('Seleciona el tipo de aplicacion');
    }
    this.captura.sincronizado = 1;
    localStorage.setItem('capturaFumigacion', JSON.stringify(this.capturasAll));
  }

  agregarEquipo() {
    this.validarDatos();
    if (this.datoEquipo == 0) {
      this.Toast.fire({
        title: 'Selecciona Un Equipo',
        icon: 'error',
      });
    } else {
      if (!this.captura.equipos.find((b) => b.idAnterior == this.datoEquipo)) {
        const idEquipo = this.listaEquipos.find(
          (b) => b.idAnterior == this.datoEquipo
        ).id;
        this.captura.equipos.push({
          id: idEquipo,
          idAnterior: this.datoEquipo,
        });
        localStorage.setItem(
          'capturaFumigacion',
          JSON.stringify(this.capturasAll)
        );
        this.Toast.fire({
          title: 'Agregado',
          icon: 'success',
        });
        this.datoEquipo = 0;
      } else {
        this.Toast.fire({
          title: 'Este equipo ya se encuentra registrado',
          icon: 'error',
        });
      }
    }
  }

  eliminarEquipo(idEquipo: number) {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'que quieres quitar este equipo',
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const eliminar = this.captura.equipos.filter((b) => b.id !== idEquipo);
        this.captura.equipos = eliminar;
        localStorage.setItem(
          'capturaFumigacion',
          JSON.stringify(this.capturasAll)
        );
        this.Toast.fire({
          title: 'Eliminado Correctamente!',
          icon: 'success',
        });
      }
    });
  }

  agregarSector() {
    this.validarDatos();
    if (this.addSector == 0) {
      this.Toast.fire({
        title: 'Selecciona Un Sector',
        icon: 'error',
      });
    } else {
      if (
        !this.captura.sectores.find((b) => b.idPlantacion == this.addSector)
      ) {
        const sector = this.listaSectores.find(
          (b) => b.plantacionID == this.addSector
        ).sector;
        this.captura.sectores.push({
          idPlantacion: this.addSector,
          sector,
        });
        const capturasToday = this.capturasAll.find(
          (b) => b.fecha == this.fecha
        );
        capturasToday.numRancho = this.listaSectores.find(
          (b) => b.plantacionID == this.addSector
        ).numeroRancho;
        localStorage.setItem(
          'capturaFumigacion',
          JSON.stringify(this.capturasAll)
        );
        this.Toast.fire({
          title: 'Agregado',
          icon: 'success',
        });
        this.addSector = 0;
      } else {
        this.Toast.fire({
          title: 'Este sector ya se encuentra registrado',
          icon: 'error',
        });
      }
    }
  }

  eliminarSector(idPlantacion: number) {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'que quieres quitar este sector',
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const eliminar = this.captura.sectores.filter(
          (b) => b.idPlantacion !== idPlantacion
        );
        this.captura.sectores = eliminar;
        localStorage.setItem(
          'capturaFumigacion',
          JSON.stringify(this.capturasAll)
        );
        this.Toast.fire({
          title: 'Eliminado Correctamente!',
          icon: 'success',
        });
      }
    });
  }

  regresar() {
    this.router.navigate(['/fumigacion/capturas', this.idRancho]);
  }
  nuevo() {
    this.navCtrl.navigateBack(`fumigacion/${this.idRancho}/capturas`);
  }

  eliminarAplicacion() {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Que Quieres Eliminar la aplicacion',
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const capturaDia = this.capturasAll.find((b) => b.fecha == this.fecha);
        const eliminar = capturaDia.captura.filter(
          (b) => b.id + '' !== this.idCaptura + ''
        );
        capturaDia.captura = eliminar;
        if (!capturaDia.eliminados) {
          capturaDia.eliminados = [];
        }
        capturaDia.eliminados.push(this.idCaptura);
        localStorage.setItem(
          'capturaFumigacion',
          JSON.stringify(this.capturasAll)
        );
        this.Toast.fire({
          title: 'Eliminado Correctamente!',
          icon: 'success',
        });
        this.back();
      }
    });
  }

  buscarProducto() {
    this.listaProductosFiltro = [];
    if (this.productoSeleccionado.length > 0) {
      const expresion = new RegExp(`${this.productoSeleccionado}.*`, 'i');
      this.listaProductosFiltro = this.listaProductos.filter((b) =>
        expresion.test(b.nombreCorto)
      );
    }
  }
  seleccionarProducto(seleccion, unidad = '') {
    this.productoSeleccionado = seleccion;
    this.unidad = unidad;
    this.unidadMedida = unidad;
    this.listaUnidades = JSON.parse(localStorage.getItem('unidades')).filter(
      (d) => d.nombreCorto === this.unidad
    );
    this.listaProductosFiltro = [];
  }

  back() {
    this.navCtrl.navigateBack(`fumigacion/${this.idRancho}`);
  }

  generateUUID() {
    // Public Domain/MIT
    let d = new Date().getTime(); //Timestamp
    let d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }
  addClima(){
    this.captura.clima = this.climas.find(d => d.id+'' === this.captura.idClima+'').nombre;
  }
  validarHora(){
    if(this.captura.horaFin && this.captura.horaInicio){

      if(this.captura.horaFin < this.captura.horaInicio){
        this.captura.horaFin =undefined;
        this._recursos.alertaNoti('Error','Hora Final Erronea','La hora final tiene que ser mayor que la hora de inicio. A partir de las 13 horas, ya son horas de la tarde.','custom-alert-header-error')
      }
    }
  }
}
