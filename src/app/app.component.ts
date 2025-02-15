/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AsyncService } from './services/async.service';

import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { DatePipe } from '@angular/common';
import { RecursosService } from './services/recursos.service';
import { AuthService } from './services/auth.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { NotificacionesService } from './services/notificaciones.service';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { ReporteErroresService } from './services/reporte-errores.service';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { Browser } from '@capacitor/browser';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IEmpleados } from './interfaces/actividadesPlus';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  date: string;
  banderaSincronizar = false;
  banderaSincronizarTerminado = false;
  deshabilitar = false;
  auth = getAuth();
  public appPages = [{ title: 'Cosecha', url: '/cosecha', icon: 'leaf' }];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  versionActual = 'Sweet Earth V3.0.0'; // Se cambiaron los imputs del formulario de fumigación y el idioma de la página
  msjUpdate = `En esta actualización, el proceso de registro de horarios de cosecha se realiza más de una vez al sincronizar. También, las alertas de error aparecerán en la parte superior de la pantalla. Si ven un mensaje de error, significa que tienen un problema de red y deben intentarlo de nuevo.`;
  versionActual2 = '4.0.0 Beta'; // Se cambiaron los imputs del formulario de fumigación y el idioma de la página

  url: any;
  fechaupdate: any;
  date2: string;
  m = false;
  v: any;
  ur: any;
  ranchos: any[] = [];
  loading: HTMLIonLoadingElement;

  constructor(
    private _async: AsyncService,
    public datepipe: DatePipe,
    private _recursos: RecursosService,
    private _auth: AuthService,
    private navCtrl: NavController,
    private _noti: NotificacionesService,
    private _rError: ReporteErroresService,
    private backgroundMode: BackgroundMode,
    private loadingController: LoadingController,
    private _router: Router
  ) {
    if (!this._recursos.getDatosLocalesG('versiones', this.versionActual)) {
      // Limpear datos locales

      this._recursos.alertaNoti(
        this.versionActual,
        'Actualización',
        this.msjUpdate
      );
      this._recursos.addDatosLocalesG('versiones', this.versionActual, {
        nada: 1,
      });
    }
  }
  generarNoti() {
    setTimeout(() => {
      this._noti.lNotifi({ body: 'test2', title: 'titulo2' });
      this.generarNoti();
    }, 10000);
  }

  async ngOnInit() {
    // Escucha de controles de flujo
    this._recursos.cleanLocalStorage();
    this.ranchos = this._recursos.getDatosLocales('ranchos');
    this._auth.getRango();
    this._auth.session();
    const setStatusBar = async () => {
      await StatusBar.setBackgroundColor({ color: '#12876B' });
      await StatusBar.setStyle({ style: Style.Dark });
    };
    setStatusBar();
    const dat = this._async.getFechaMexHoy();
    this.date2 = this.datepipe.transform(dat, 'yyyy-MM-dd HH:mm:ss');
    if (JSON.parse(localStorage.getItem('actualizacion'))) {
      this.fechaupdate = JSON.parse(localStorage.getItem('actualizacion'));
    }
    this._auth.session();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const uid = user.uid;
        environment.uid = uid;
        setTimeout(() => {
          this.sync();
        }, 1000);
        this.m = true;
      } else {
        this.m = false;
        this.navCtrl.navigateForward('/login');
      }
    });
    this.backgroundMode.enable();

    this._rError.getRegistrosErrores().then((a) => a);
    this._async.clean();
    const f = this._async.getFechaMexHoy();
    const year = f.getFullYear().toString();

    const date = this._async.getFechaMexHoy();
    this.date = this.datepipe.transform(date, 'yyyy-MM-dd');
  }

  // Actualizar localStorage
  sync() {
    this._auth.session();

    this._async.sync().subscribe(async (v: any) => {
      this.url = v.appVersion.url;
      localStorage.setItem('appVersion', JSON.stringify(v.appVersion));
      localStorage.setItem('calendario', JSON.stringify(v.calendario));
      localStorage.setItem('ranchos', JSON.stringify(v.rancho));
      localStorage.setItem('skus', JSON.stringify(v.skus));
      localStorage.setItem('supervisores', JSON.stringify(v.supervisor));
      localStorage.setItem('supervisores2', JSON.stringify(v.supervisor2));
      localStorage.setItem('fumigacion', JSON.stringify(v.fumigacion));
      localStorage.setItem('variedades', JSON.stringify(v.variedades));
      localStorage.setItem('menu', JSON.stringify(v.menu));
      localStorage.setItem('menuV2', JSON.stringify(v.menuV2));
      localStorage.setItem('pActividades', JSON.stringify(v.pActividades));
      localStorage.setItem('pCosecha', JSON.stringify(v.pCosecha));
      localStorage.setItem('actCosecha', JSON.stringify(v.actCosecha));
      localStorage.setItem('pHoraDia', JSON.stringify(v.pHoraDia));
      localStorage.setItem('actividades', JSON.stringify(v.actividades));
      localStorage.setItem('horaFumigador', JSON.stringify(v.horaFumigador));
      localStorage.setItem('empleados', JSON.stringify(v.empleados));
      localStorage.setItem('idTipoUsuario', v.idTipoUsuario);
      localStorage.setItem('diasFichas', v.diasFichas);
      localStorage.setItem('paga_reclutador', v.paga_reclutador);
      localStorage.setItem('unidades', JSON.stringify(v.unidad));
      localStorage.setItem('horariosLs', JSON.stringify(v.horariosLs));
      localStorage.setItem('reclutadores', JSON.stringify(v.reclutadores));
      localStorage.setItem('climas', JSON.stringify(v.climas));
      localStorage.setItem(
        'pHoraDiaEspecial',
        JSON.stringify(v.pHoraDiaEspecial)
      );
      localStorage.setItem(
        'evaluacionesRubros',
        JSON.stringify(v.evaluacionesRubros)
      );
      if (v.update_precios)
        localStorage.setItem(
          'update_precios',
          JSON.stringify(v.update_precios)
        );
      localStorage.setItem('programaActividadesSN', JSON.stringify(v.programaActividades));
      localStorage.setItem('programaVoleo', JSON.stringify(v.programaVoleo));


      environment.backendDowloader = true;
      // RECALCULAR PAGO POR AVANCE
      this.recalcularPrecioPagoPorAvance();
      // Mensaje indicando que ya se actualizó los datos locales
      this._recursos.toastM('top', 'Actualización de datos Locales !!', 3000);

      this.v = v.appVersion.version;
      if (v.appVersion.version !== this.versionActual) {
        this.deshabilitar = true;
        this._recursos.alertaNoti(
          this.versionActual,
          'Hay una nueva actualización',
          `Esta versión es obsoleta, por esta razón la aplicación no le mostrará ninguna opción de registro`
        );
        const openUrl = async (url: string) => {
          await Browser.open({ url });
        };
        openUrl(v.appVersion.url);
        this.ur = v.appVersion.url;
      }
    });
  }

  async recalcularPrecioPagoPorAvance() {
    let yaActualizados: any[] = this._recursos.getDatosLocales(
      'updatesPlantillaAplicados'
    );
    let updateActividades: any[] =
      this._recursos.getDatosLocales('update_precios');
    updateActividades = updateActividades ? updateActividades : [];
    yaActualizados = yaActualizados ? yaActualizados : [];
    let cambios = false;
    this.loading = await this.loadingController.create({
      message: 'Actualizando precios actividades...',
      spinner: 'crescent',
    });
    await this.loading.present();
    if (yaActualizados.length > 0) {
      for (const actividad of updateActividades) {
        if (!yaActualizados.find((d) => d.id + '' === actividad.id + '')) {
          // Identificar actividad y apartir de que fecha se van a realizarce las actualizaciones
          this.procesoActualizarPlantilla(actividad);
          cambios = true;
        }
      }
      await this.loading.dismiss();
    } else {
      cambios = true;

      for (const actividad of updateActividades) {
        // Identificar actividad y apartir de que fecha se van a realizarce las actualizaciones
        this.procesoActualizarPlantilla(actividad);
      }
      await this.loading.dismiss();
    }
    this._router.events.subscribe((event: any) => {
      if (event.url && this._router.url === '/domingos/plantilla') {
        if (cambios) this.navCtrl.navigateForward('/menu');
      }
    });
  }

  procesoActualizarPlantilla(actividad) {
    // Tomaremos la fecha y filtraremos la plantilla
    let plantilla: any[] = this._recursos.getDatosLocales('plantillas');
    plantilla = plantilla ? plantilla : [];
    plantilla = plantilla.filter((d) => d.fecha + '' >= actividad.fecha + '');
    let auxRendimeintos: any;
    let tunelDat,
      precioSurco: number = 0,
      subtotal: number = 0,
      granTotal: number = 0;

    // Acceder al atributo "actividades" y recorrer el atributo 'rendimientos'
    for (const empleado of plantilla) {
      auxRendimeintos = empleado.actividades.rendimientos.find(
        (d) => d.idApp + '' === actividad.idApp + ''
      );
      if (auxRendimeintos) {
        subtotal = 0;
        for (const captura of auxRendimeintos.capturas) {
          if (captura.numSurcos > 0) {
            // Procesar solo las cpaturas con cajas
            // Obtener longitud de tuneles
            tunelDat = this.ranchos.find(
              (d) => d.idRancho + '' === actividad.idRancho + ''
            );
            if (tunelDat)
              tunelDat = tunelDat.sectores.find(
                (d) => d.plantacionID + '' === actividad.idPlantacion + ''
              );
            if (tunelDat)
              tunelDat = tunelDat.tuneles.find(
                (d) => d.id + '' === captura.idTunel + ''
              );
            // Calcular precio por surco
            precioSurco = Math.round(
              (actividad.precio * tunelDat.mtsl) / tunelDat.numsurcos
            );
            // Asignar nuevo precio por surco
            captura.precio = precioSurco;
            // Calcular nuevo pago
            captura.pago = precioSurco * captura.numSurcos;
            subtotal += captura.pago;
          }
        }
        // Asignar subtotal a rendimiento
        auxRendimeintos.pago = subtotal;
        // Calcular Gran Total de las Actividades
        granTotal = 0;
        let allRendiemintos = empleado.actividades.rendimientos.filter(
          (d) => d.idActividad + '' !== actividad.idActividad + ''
        );

        for (const rendimeinto of allRendiemintos) {
          granTotal += rendimeinto.pago;
        }
        if (granTotal > 0) {
          empleado.actividades.granTotal = granTotal;
          empleado.actividades.pago = granTotal;
        }
      }
    }
    // Guardar cambios
    let allPlantilla: any[] = this._recursos.getDatosLocales('plantillas');
    allPlantilla = allPlantilla ? allPlantilla : [];
    allPlantilla = allPlantilla.filter(
      (d) => d.fecha + '' < actividad.fecha + ''
    );
    for (const empleado of plantilla) {
      allPlantilla.push(empleado);
    }
    let dato = { id: actividad.id };
    let allDatos = this._recursos.getDatosLocales('updatesPlantillaAplicados');
    allDatos.push(dato);
    localStorage.setItem('plantillas', JSON.stringify(allPlantilla));
    localStorage.setItem('updatesPlantillaAplicados', JSON.stringify(allDatos));
  }

  descargarApp() {
    const a = document.createElement('a');
    a.href = this.ur;
    a.download = 'image.png';
    a.click();
  }

  addHorariosCuadrilla(){
    
    if (JSON.parse(localStorage.getItem('bitacoraHorariosCuadrillas'))) {
      this._async.addBitacoraHorariosCuadrillas().subscribe(
        (v: any) => {
          localStorage.setItem(
            'actualizacion',
            JSON.stringify(
              this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')
            )
          );
          this._recursos.toastM(
            'bottom',
            v.msj,
            1500
          );
        },
        (err) => {
          this._rError
            .registrarError(err.error.error, 'Horarios')
            .then((a) => a);
            console.log(err);
          this._recursos.toastM(
            'top',
            'ERROR AL SINCRONIZAR LOS HORARIOS POR CUADRILLA DE COSECHA, INTENTELO DE NUEVO!!!!',
            4500,
              'error'
          );
        }
      );
    }
  }

  async saveData() {
    this._auth.session();

    this.banderaSincronizarTerminado = true;
    this.sync();
    this.addHorariosCuadrilla();
    if (JSON.parse(localStorage.getItem('horariosCosecha'))) {
      let horariosCosecha = JSON.parse(localStorage.getItem('horariosCosecha'));
      console.log({datos: horariosCosecha});
      this._async.sincronizarHorairosAPPMovil({datos: horariosCosecha}).subscribe(
        (v: any) => {
          localStorage.setItem(
            'actualizacion',
            JSON.stringify(
              this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')
            )
          );
          this._recursos.toastM(
            'bottom',
            v.msj,
            1500
          );
        },
        (err) => {
          this._rError
            .registrarError(err.error.error, 'Horarios')
            .then((a) => a);
            console.log(err);
          this._recursos.toastM(
            'top',
            'ERROR AL SINCRONIZAR LOS HORARIOS DE COSECHA, INTENTELO DE NUEVO!!!!',
            4500,
              'error'
          );
        }
      );
    }

    
    const p1 = await this._async.savePapeletas();
    const p2 = await this._async.addBitacoraCosecha();

    const diasARestar = JSON.parse(localStorage.getItem('diasFichas')); // Cantidad de días a restar

    let nuevaFecha: any = this._recursos.restarDias(
      this._async.getFechaMexHoy(),
      diasARestar - 1
    );
    nuevaFecha = nuevaFecha.toISOString().split('T')[0];
    let gg: any = JSON.parse(localStorage.getItem('bitacora_fichas_delete'));
    gg = gg ? gg : [];
    const p5 = await this._async.generarQueryBAE();
    this._async.addActividades().subscribe(
      (r) => {
        let plantillas: IEmpleados[] = this._async.getAllDatos('plantillas');
        let faltantes = 0;
        for (const plantilla of plantillas) {
          if (plantilla.descuento + '' !== '-1') {
            plantilla.status = 1;
          } else {
            faltantes++;
          }
        }
        localStorage.setItem('plantillas', JSON.stringify(plantillas));
        this._recursos.toastM(
          'bottom',
          faltantes == 0
            ? 'Carga de Pago por avance exitosa !!!'
            : 'Parece que no has definido los horarios de  actividades que se te indicó, por favor definelos y vuelve a sincronizar',
          faltantes == 0 ? 1500 : 4500
        );
      },
      (r) => {
        console.log(r);
        this._recursos.toastM(
          'top',
          'Ops... Algo salió mal al cargar actividades. Compruebe su conexión a la red e intentelo de nuevo !!!',
          4500,
              'error'
        );
      }
    );
    this._async.addHorariosActividades().subscribe((r) => {});

    this._async.addHorariosCosecha().subscribe((r) => {});

    // Add Programa Actividades
    this._async.addPorgramaActividades().subscribe(
      (r) => {
        let datos = this._recursos.getDatosLocales('bitacoraActividades');
        for (const programaActivdad of datos) {
          programaActivdad.status = 1;
        }
        localStorage.setItem('bitacoraActividades', JSON.stringify(datos));

        this._recursos.toastM(
          'bottom',
          'Programa de actividades cargadas !!!',
          1500
        );
      },
      (r) => {
        console.log(r);
        this._recursos.toastM(
          'top',
          'Ops... Algo salió mal al cargar actividades. Compruebe su conexión a la red e intentelo de nuevo !!!',
          4500,
              'error'
        );
      }
    );
    this._async
      .addBitacoraFichasv2({
        min: nuevaFecha,
        max: this._recursos.getFechaHoy().fecha,
        uid: localStorage.getItem('uid'),
        datos: JSON.parse(localStorage.getItem('bitacora_fichas')),
        eliminar: gg,
      })
      .subscribe(
        (r: any) => {
          localStorage.setItem('bitacora_fichas_delete', JSON.stringify([]));
        },
        (error: any) => {
          this._recursos.toastM(
            'top',
            'Ops... Algo salió mal al cargar fichas. Compruebe su conexión a la red e intentelo de nuevo !!!',
            4500,
              'error'
          );
        }
      );

    // Evaluaciones
    this._async.addEvaluacionCosecha().subscribe(
      (r: any) => {
        this._recursos.toastM(
          'bottom',
          'Registro de evaluación exitoso !!!',
          1500
        );
      },
      (error: any) => {
        console.log(error);
        this._recursos.toastM(
          'top',
          'Ops... Algo salió mal al cargar fichas. Compruebe su conexión a la red e intentelo de nuevo !!!',
          4500,
              'error'
        );
      }
    );
    if (JSON.parse(localStorage.getItem('actualizacion'))) {
      this.fechaupdate = JSON.parse(localStorage.getItem('actualizacion'));
    }
    this._async.addRendimeintosGalera().subscribe(
      (r: any) => {
        localStorage.setItem(
          'actualizacion',
          JSON.stringify(
            this.datepipe.transform(
              this._async.getFechaMexHoy(),
              'yyyy-MM-dd HH:mm:ss'
            )
          )
        );
        this._recursos.toastM('bottom', r.msj, 1500);
        if (JSON.parse(localStorage.getItem('actualizacion'))) {
          this.fechaupdate = JSON.parse(localStorage.getItem('actualizacion'));
        }
      },
      (error: any) => {
        this._recursos.toastM(
          'top',
          'Ops... Algo salió mal al cargar rendiminetos de galeras. Compruebe su conexión a la red e intentelo de nuevo !!!',
          4500,
              'error'
        );
      }
    );

    this.banderaSincronizar = true;

    if (JSON.parse(localStorage.getItem('capturaFumigacion'))) {
      const date = this._async.getFechaMexHoy();
      const capturaFumigacion: any[] = JSON.parse(
        localStorage.getItem('capturaFumigacion')
      );
      const fumigacionHoy = capturaFumigacion.find(
        (b) => b.fecha + '' === this._recursos.getFechaHoy().fecha + ''
      );
      // const fumigacionHoy = capturaFumigacion.find(
      //   (b) => b.fecha + '' === '2024-12-17'
      // );
      const fumigacionAll = capturaFumigacion.filter(
        (b) => b.fecha + '' !== this._recursos.getFechaHoy().fecha + ''
      );
      // console.log(fumigacionHoy);
      //   return;
      if (fumigacionHoy) {
        const datos = {
          datos: fumigacionHoy.captura,
          fecha: fumigacionHoy.fecha,
          uid: environment.uid,
        };
        // console.log(datos);
        // return;
        this._async.verificarHoraFumigacion().subscribe((r: any) => {
          if (true) {
            this._async.sincronizarFumigacion(datos).subscribe(
              (r: any) => {
                this._recursos.toastM('bottom', 'Registro exitoso', 1500);
                localStorage.setItem(
                  'actualizacion',
                  JSON.stringify(
                    this.datepipe.transform(
                      this._async.getFechaMexHoy(),
                      'yyyy-MM-dd HH:mm:ss'
                    )
                  )
                );
                if (JSON.parse(localStorage.getItem('actualizacion'))) {
                  this.fechaupdate = JSON.parse(
                    localStorage.getItem('actualizacion')
                  );
                }
                for (const captura of fumigacionHoy.captura) {
                  captura.sincronizado = 0;
                }
                fumigacionAll.push(fumigacionHoy);
                localStorage.setItem(
                  'capturaFumigacion',
                  JSON.stringify(fumigacionAll)
                );
                setTimeout(() => {
                  this.banderaSincronizarTerminado = false;
                }, 30000);
              },
              (err) => {
                this._recursos.toastM(
                  'bottom',
                  'Revise su conexión a internet',
                  1500
                );
                this._rError
                  .registrarError(err.error.error, 'Fumigacion')
                  .then((a) => a);
              }
            );
            if (fumigacionHoy.eliminados) {
              const d = {
                ids: fumigacionHoy.eliminados,
              };
              this._async
                .sincronizarFumigacionEliminar(d)
                .subscribe((r: any) => {});
            }
          }
        });
      } else {
      }
    }
    this.banderaSincronizar = false;
    // Cargar Actividades Regulares
    this._async.addActividadesRegulares().subscribe(
      (r: any)=>{
        localStorage.setItem(
          'actualizacion',
          JSON.stringify(
            this.datepipe.transform(
              this._async.getFechaMexHoy(),
              'yyyy-MM-dd HH:mm:ss'
            )
          )
        );
        this._recursos.toastM('bottom', r.msj, 1500);
        if (JSON.parse(localStorage.getItem('actualizacion'))) {
          this.fechaupdate = JSON.parse(localStorage.getItem('actualizacion'));
        }
        
      }
    );

    setTimeout(() => {
      this.banderaSincronizarTerminado = false;
    }, 5000);

    // CARGAR CAJAS
    this._async.addCajasCosecha().subscribe(
      (r: any) => {
        this._recursos.toastM('bottom', r.msj, 1500);
      },
      (err) => {
        this._recursos.toastM('bottom', 'Revise su conexión a internet', 1500);
        this._rError
          .registrarError(err.error.error, 'Cajas Cosechadas')
          .then((a) => a);
      }
    );
  }

  descargar(path) {
    const storage = getStorage();
    getDownloadURL(ref(storage, path))
      .then((url) => {
        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => {
        // Handle any errors
      });
  }
}
