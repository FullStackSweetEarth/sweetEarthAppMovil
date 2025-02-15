/* eslint-disable object-shorthand */
/* eslint-disable curly */
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ICaptura, ISector } from '../interfaces/papeleta';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class RecursosService {
  app: any;
  db: any;
  storage: any;
  sincronizar = 0;
  constructor(
    private alertController: AlertController,
    public datepipe: DatePipe,
    private toastController: ToastController
  ) {
    this.app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  getNumberArr() {
    let numbers = [];
    for (let index = 1; index < 101; index++) {
      numbers.push(index);
    }
    return numbers;
  }

  initVarPapeleta(dat, fecha): ICaptura {
    let data: ICaptura;
    return (data = {
      fecha: dat
        ? dat.fecha
        : fecha !== null
        ? fecha
        : this.getFechaHoy().fecha,
      horaEnvio: dat
        ? dat.horaEnvio
        : this.getFechaHoy().fecha + 'T' + this.getFechaHoy().hora,
      idRancho: dat ? dat.idRancho : null,
      // numLicencia: dat? dat.numLicencia:  null,
      numRancho: null,
      papeleta: dat ? dat.papeleta : null,
      rancho: null,
      sector: [],
      status: 1,
      totalCajas: 0,
      kilogramosCampo: 0,
      kilogramosProceso: 0,
    });
  }

  initVariableSector() {
    let data: ISector;
    return (data = {
      idPlantacion: 0,
      cajas: null,
      fechaHora: '',
      kilogramosProceso: null,
      sector: '',
      sku: 0,
      skuTitulo: null,
      horaInicio: null,
      horaFin: null,
      idSupervisor: 0,
      kilogramosCampo: null,
      numLicencia: null,
      status: 1,
    });
  }

  ordernarAsc(data, nombre) {
    return data.sort(function (a, b) {
      if (a[nombre] > b[nombre]) {
        return 1;
      }
      if (a[nombre] < b[nombre]) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }
  ordernarDESC(data, nombre) {
    return data.sort(function (a, b) {
      if (a[nombre] < b[nombre]) {
        return 1;
      }
      if (a[nombre] > b[nombre]) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }
  ordernarFirstNull(data, nombre) {
    return data.sort(function (a, b) {
      if (a[nombre] === null && b[nombre] !== null) {
        return -1; // a va antes que b
      } else if (a[nombre] !== null && b[nombre] === null) {
        return 1; // b va antes que a
      } else {
        return 0; // Mantener el orden actual
      }
    });
  }

  async alertaNoti(
    header,
    subHeader,
    mensaje,
    color = 'custom-alert-header-ok'
  ) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: mensaje,
      buttons: ['OK'],
      cssClass: color,
    });

    await alert.present();
  }
  async alertaNotiOpciones(header, subHeader, mensaje, opciones) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: mensaje,
      buttons: this.generarOpciones(opciones),
    });

    await alert.present();
  }
  generarOpciones(opciones: any[]) {
    const arr = [];
    for (const opcion of opciones) {
      arr.push({
        text: opcion,
        handler: () => {
          // Lógica al hacer clic en el botón "Aceptar"
          return 34;
        },
      });
    }
    return arr;
  }

  asiganrH(data) {}

  getHora(fecha) {
    return this.datepipe.transform(fecha, 'HH:mm');
  }

  async toastM(
    position: 'top' | 'middle' | 'bottom',
    msj: string,
    duracion: number,
    tipo = 'success'
  ) {
    const toast = await this.toastController.create({
      message: msj,
      duration: duracion,
      position: position,
      cssClass: tipo === 'success' ? 'success-toast' : 'error-toast',
    });

    await toast.present();
  }

  getDatosLocalesG(tipo, nombre) {
    if (tipo ? JSON.parse(localStorage.getItem(tipo)) : false) {
      return JSON.parse(localStorage.getItem(tipo)).find(
        (d) => d.nombreFiltro + '' === nombre + ''
      );
    } else return null;
  }
  getDatosLocalesGAll(tipo, nombre) {
    if (JSON.parse(localStorage.getItem(tipo))) {
      return JSON.parse(localStorage.getItem(tipo)).filter(
        (d) => d.nombreFiltro + '' === nombre + ''
      );
    } else return null;
  }

  addDatosLocalesG(tipo, nombre, datos) {
    datos.nombreFiltro = nombre;
    let todos = [];
    if (JSON.parse(localStorage.getItem(tipo)))
      todos = JSON.parse(localStorage.getItem(tipo)).filter(
        (d) => d.nombreFiltro + '' !== nombre + ''
      );
    todos.push(datos);
    if (datos != null || datos.length > 0) {
      localStorage.setItem(tipo, JSON.stringify(todos));
    }
  }
  addDatosLocalesGAll(tipo, nombre, datos) {
    let todos = [];
    if (JSON.parse(localStorage.getItem(tipo)))
      todos = JSON.parse(localStorage.getItem(tipo)).filter(
        (d) => d.nombreFiltro + '' !== nombre + ''
      );
    for (const d of datos) {
      d.nombreFiltro = nombre;
      todos.push(d);
    }
    if (datos != null || datos.length > 0) {
      localStorage.setItem(tipo, JSON.stringify(todos));
    }
  }
  addDatosLocales(tipo, nombre, datos) {
    datos.nombreFiltro = nombre;
    let todos = [];
    if (JSON.parse(localStorage.getItem(tipo)))
      todos = JSON.parse(localStorage.getItem(tipo)).filter(
        (d) => d.nombreFiltro + '' !== nombre + ''
      );
    todos.push(datos);
    if (datos != null || datos.length > 0)
      localStorage.setItem(tipo, JSON.stringify(todos));
  }

  getFechaHoy() {
    let f: any = new Date()
      .toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
      .split('/');
    let h: any = f[2].replace(',', '').split(' ');
    f[2] = h[0];
    h = h[1];
    f =
      f[2] +
      '-' +
      (Number(f[1]) > 9 ? Number(f[1]) : '0' + Number(f[1])) +
      '-' +
      (Number(f[0]) > 9 ? Number(f[0]) : '0' + Number(f[0]));

    return { fecha: f, hora: h };
  }
  getHora24() {
    const fecha: any = new Date();

    // Obtén la hora en formato HH:mm utilizando toLocaleTimeString
    const opciones: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Mexico_City',
    };
    const formato24Horas = fecha.toLocaleTimeString('es-MX', opciones);
    return formato24Horas;
  }
  getDatosLocales(tipo) {
    if (tipo ? JSON.parse(localStorage.getItem(tipo)) : null) {
      return JSON.parse(localStorage.getItem(tipo));
    } else {
      return [];
    }
  }

  ordenar(atributo, tipo, data) {
    tipo = tipo == 1 ? 0 : 1;
    if (tipo == 1) {
      data.sort(function (a, b) {
        if (a[atributo] < b[atributo]) return 1;
        if (a[atributo] > b[atributo]) return -1;
        return 0;
      });
    } else {
      data.sort(function (a, b) {
        if (a[atributo] > b[atributo]) return 1;
        if (a[atributo] < b[atributo]) return -1;
        return 0;
      });
    }
  }
  restarDias(fecha, dias) {
    const milisegundosPorDia = 24 * 60 * 60 * 1000; // Milisegundos en un día
    const tiempoActual = fecha.getTime(); // Tiempo actual en milisegundos
    const tiempoRestado = tiempoActual - dias * milisegundosPorDia; // Resta los días
    return new Date(tiempoRestado); // Crea una nueva fecha
  }

  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  cleanLocalStorage() {
    const docRef = doc(this.db, 'flowControls', 'cleanLocalStorage');

    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        if (this.sincronizar !== 0) {
          // Limpear
          console.log('limpear');
          const keysToKeep = [
            'appVersion',
            'actividades',
            'calendario',
            'diasFichas',
            'climas',
            'empleados',
            'evaluacionesRubros',
            'fumigacion',
            'horaFumigador',
            'horariosLs',
            'idTipoUsuario',
            'menu',
            'pActividades',
            'paga_reclutador',
            'programaActividadesSN',
            'programaVoleo',
            'ranchos',
            'reclutadores',
            'skus',
            'supervisores',
            'supervisores2',
            'uid',
            'unidades',
            'variedades',
            'versiones',
          ];

          // Obtener todas las claves almacenadas
          const allKeys = Object.keys(localStorage);

          // Eliminar las claves que no están en la lista de exclusión
          allKeys.forEach((key) => {
            if (!keysToKeep.includes(key)) {
              localStorage.removeItem(key);
            }
          });
        }
        this.sincronizar = 1;
        console.log('Datos en tiempo real:', docSnap.data());
      } else {
        console.log('No se encontraron datos');
      }
    });
  }
}
