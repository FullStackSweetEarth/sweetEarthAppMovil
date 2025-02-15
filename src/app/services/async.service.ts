/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable quote-props */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICaptura, IFechas, IVida } from '../interfaces/papeleta';
import { RecursosService } from './recursos.service';
import { DatePipe } from '@angular/common';
import { ReporteErroresService } from './reporte-errores.service';

@Injectable({
  providedIn: 'root',
})
export class AsyncService {
  date: string;
  ayer: string;
  constructor(
    public datepipe: DatePipe,
    private http: HttpClient,
    private _recursos: RecursosService,
    private _rError: ReporteErroresService
  ) {
    let date = new Date();
    this.date = this.datepipe.transform(this.getFechaMexHoy(), 'yyyy-MM-dd');
    this.ayer = this.datepipe.transform(
      this._recursos.restarDias(this.getFechaMexHoy(), 1),
      'yyyy-MM-dd'
    );
  }

  sync() {
    let respuestaAPI;

      respuestaAPI = `${environment.urlAPI}/sincronizarConfiguraciones/${environment.uid}`;
console.log(respuestaAPI);
    return this.http.get(respuestaAPI);
  }

  getData(name, id = null, nameId = null, atributo = null) {
    let data = [];
    if (JSON.parse(localStorage.getItem(name))) {
      data = JSON.parse(localStorage.getItem(name));
      if (id != null) {
        data = data.filter((dat) => dat[nameId] === id)[0][atributo];
      }
    }
    return data;
  }
  getDatas(name, id = null, nameId = null) {
    let data: any = [];
    if (JSON.parse(localStorage.getItem(name))) {
      data = JSON.parse(localStorage.getItem(name));
      if (id != null) {
        data = data.find((dat) => dat[nameId] === id);
      }
    }
    return data;
  }

  getColeccionDatos(name, id = null, nameId = null) {
    let data = [];
    if (JSON.parse(localStorage.getItem(name))) {
      data = JSON.parse(localStorage.getItem(name));
      if (id != null) {
        data = data.filter((dat) => dat[nameId] === id);
      }
    }
    return data;
  }
  getAllDatos(name) {
    let data = [];
    if (JSON.parse(localStorage.getItem(name))) {
      data = JSON.parse(localStorage.getItem(name));
    }
    return data;
  }

  // Esta funión únicamente registrará las paepetas con es status 1.
  savePapeletas() {
    let existe = false;

    let capturas: ICaptura[] = this.getData('capturaCosecha')
      ? this.getData('capturaCosecha')
      : [];
    if (capturas.length > 0) {
      let dat: any[] = [];
      for (const papeleta of capturas) {
        if (papeleta.status === 1) {
          for (const sector of papeleta.sector) {
            if (sector.status === 1) {
              existe = true;
              dat.push({
                idPlantacion: sector.idPlantacion,
                fecha: papeleta.fecha,
                cajas: sector.cajas,
                sku: sector.skuTitulo,
                idSupervisor: sector.idSupervisor,
                supervisor: sector.supervisor,
                papeleta: papeleta.papeleta,
                licencia: sector.numLicencia,
                horaEnvio: papeleta.horaEnvio,
                idRancho: papeleta.idRancho,
              });
              sector.status = 0;
            }
          }
          papeleta.status = 0;
        }
      }

      let data = {
        data: dat,
      };
      if (dat.length > 0) {
        this.crudBitacora(data).subscribe(
          (v: any) => {
            if (v.estado == 'OK') {
              if (existe) {
                this._recursos.toastM(
                  'bottom',
                  'Carga de bitacora exitosa!!!!',
                  1500
                );
              }
              localStorage.setItem('capturaCosecha', JSON.stringify(capturas));
            } else {
              this._recursos.alertaNoti(
                'Error',
                'Registro fallido',
                'Verifica la conexion a internet y  vuelve a sincronizar!'
              );
            }
            this.sincronizarHorariosProceso();
          },
          (err) => {
            console.log(err);
            this._rError
              .registrarError(err.error.error, 'Bitacora Cosecha')
              .then((a) => a);
            this._recursos.toastM(
              'top',
              'Ops... Algo salió mal al cargar papeletas. Compruebe su conexión a la red e intentelo de nuevo !!!',
              4500,
              'error'
            );
          }
        );
      } else {
        this.sincronizarHorariosProceso();
      }
    } else {
      this.sincronizarHorariosProceso();
    }
  }
  sincronizarHorariosProceso() {
    let dat = null;
    let ayer = this.ayer;
    if (JSON.parse(localStorage.getItem('horariosCosecha'))) {
      let hc: any[] = JSON.parse(localStorage.getItem('horariosCosecha'));
      let horariosCosecha = JSON.parse(localStorage.getItem('horariosCosecha'));
      // .filter(
      //   (b) => b.fecha + '' === this.date || b.fecha + '' === ayer + ''
      // );
      console.log('horrios',horariosCosecha);
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      // for (let f = 0; f < horariosCosecha.length; f++) {
        // dat = {
        //   fecha: horariosCosecha[f].fecha,
        //   plantacionID: horariosCosecha[f].plantacionID,
        //   CosHoraFin: horariosCosecha[f].CosHoraFin,
        //   CosHoraInicio: horariosCosecha[f].CosHoraInicio,
        //   GalHoraInicio: horariosCosecha[f].GalHoraInicio,
        //   GalHoraFin: horariosCosecha[f].GalHoraFin,
        //   NumCosechadores: horariosCosecha[f].NumCosechadores,
        //   NumGaleristas: horariosCosecha[f].NumGaleristas,
        //   idSupervisor: horariosCosecha[f].idSupervisor,
        //   kilogramosCampo: horariosCosecha[f].kilogramosCampo,
        //   kilogramosGalera: horariosCosecha[f].kilogramosGalera,
        //   horaEnvio: horariosCosecha[f].horaEnvio
        //     ? horariosCosecha[f].horaEnvio
        //     : '00:00',
        // };
        this.sincronizarHorairosAPPMovil({datos: horariosCosecha}).subscribe(
          (v: any) => {
            localStorage.setItem(
              'actualizacion',
              JSON.stringify(
                this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')
              )
            );
            this._recursos.toastM('bottom', v.msj, 1500);
            for (const hora of hc) {
              if(hora.fecha >= ayer){
                hora.estatus = 0;
              }
            }
            
            this._recursos.toastM(
              'bottom',
              v.msj,
              4500
            );
            localStorage.setItem('horariosCosecha', JSON.stringify(hc));
          },
          (err) => {
            this._rError
              .registrarError(err.error.error, 'Horarios')
              .then((a) => a);
            this._recursos.toastM(
              'bottom',
              'ERROR AL SINCRONIZAR LOS HORARIOS DE COSECHA, INTENTELO DE NUEVO!!!!',
              4500
            );
          }
        );
      // }

      
    }
  }

  sincronizarHorairosAPPMovilSolo(datos: any) {
    const respuestaAPI = `${environment.urlAPI}/bitacora/sincronizarHorairosAPPMovilv2`;
    return this.http.post(respuestaAPI, datos);
  }
  
  sincronizarHorairosAPPMovil(datos: any) {
    const respuestaAPI = `${environment.urlAPI}/bitacora/sincronizarHorairosAPPMovilv2`;
    return this.http.post(respuestaAPI, datos);
  }
  sincronizarHorarios(datos: any) {
    const respuestaAPI = `${environment.urlAPI}/bitacora/agregarHorariosSectorAPP`;
    return this.http.post(respuestaAPI, datos);
  }

  crudBitacora(datos: any) {
    const respuestaAPI = `${environment.urlAPI}/bitacora/agregarPapeletaAPP`;
    return this.http.post(respuestaAPI, datos);
  }
  p1(dato: string) {
    return dato.substring(0, dato.length - 1);
  }

  addRangos(inicioR: number, finR: number, rancho, supervisor, f) {
    let fichas: any[] = [];
    let fichasAux: any[] = [];
    let tipoRegistro = false;
    if (JSON.parse(localStorage.getItem('fichas'))) {
      fichas = JSON.parse(localStorage.getItem('fichas'));
      fichasAux = fichas.filter(
        (d) =>
          d.idRancho == rancho && d.idSupervisor == supervisor && d.fecha === f
      );
      if (fichasAux.length > 0) {
        tipoRegistro = true;
      }
    }

    if (tipoRegistro) {
      // obtener
      let inicio = Number(fichasAux[0].numFicha);
      let fin = Number(fichasAux[fichasAux.length - 1].numFicha);

      // Identificar si el rango aumenta o disminulle al inicio
      if (inicioR < inicio) {
        // Craer fichas faltantes
        for (let index = inicioR - 1; index < inicio; index++) {
          fichasAux.unshift({
            numFicha: index + 1,
            idRancho: rancho,
            idSupervisor: supervisor,
            status: 1,
            horaSalida: '2022-10-14T16:00:00-05:00',
            numEmpleado: null,
            fecha: f,
          });
        }
      } else {
        // Reduccir inicio
        if (!(inicio - inicioR == 0)) {
          fichasAux = fichasAux.splice(0, inicio - inicioR);
        }
      }

      // Identificar si el rango aumenta o disminulle al final
      if (finR > fin) {
        // Craer fichas faltantes
        for (let index = fin - 1; index < finR - 1; index++) {
          fichasAux.push({
            numFicha: index + 2,
            idRancho: rancho,
            idSupervisor: supervisor,
            status: 1,
            horaSalida: '2022-10-14T16:00:00-05:00',
            numEmpleado: null,
            fecha: f,
          });
        }
      } else {
        // Reduccir fin
        if (!(fin - finR == 0)) {
          fichasAux = fichasAux.splice(inicio - 1, finR);
        }
      }
    } else {
      // Generar array de fichas
      for (let index = inicioR; index <= finR; index++) {
        fichas.push({
          numFicha: index,
          idRancho: rancho,
          idSupervisor: supervisor,
          status: 1,
          horaSalida: '2022-10-14T16:00:00-05:00',
          numEmpleado: null,
          fecha: f,
        });
      }
    }
    this._recursos.toastM('bottom', 'Ajuste exitoso', 2000);

    // Guardar cambios
    if (tipoRegistro) {
      fichas = fichas.filter(
        (d) =>
          !(
            d.idRancho == rancho &&
            d.idSupervisor == supervisor &&
            d.fecha === f
          )
      );
      for (const ficha of fichasAux) {
        fichas.push(ficha);
      }
    }
    localStorage.setItem('fichas', JSON.stringify(fichas));

    return fichas;
  }

  updateFicha(fichas: any[], data: any) {
    fichas.find(
      (dat) =>
        dat.numFicha === data.numFicha &&
        dat.idRancho === data.idRancho &&
        dat.idSupervisor === data.idSupervisor &&
        dat.fecha === data.fecha
    ).numEmpleado = data.numEmpleado;
    fichas.find(
      (dat) =>
        dat.numFicha === data.numFicha &&
        dat.idRancho === data.idRancho &&
        dat.idSupervisor === data.idSupervisor &&
        dat.fecha === data.fecha
    ).nombre = data.nombre;
    fichas.find(
      (dat) =>
        dat.numFicha === data.numFicha &&
        dat.idRancho === data.idRancho &&
        dat.idSupervisor === data.idSupervisor &&
        dat.fecha === data.fecha
    ).rancho = data.rancho;
    fichas.find(
      (dat) =>
        dat.numFicha === data.numFicha &&
        dat.idRancho === data.idRancho &&
        dat.idSupervisor === data.idSupervisor &&
        dat.fecha === data.fecha
    ).fecha = data.fecha;
    localStorage.setItem('fichas', JSON.stringify(fichas));

    return fichas;
  }

  updateBitacoraFichas(data: any, variedades) {
    let bitacora = [];
    bitacora = this.getData('fichas-bitacora');
    bitacora = bitacora ? bitacora : [];
    for (const variedad of variedades) {
      bitacora.find(
        (dat) =>
          dat.numFicha === data.numFicha &&
          dat.idRancho === data.idRancho &&
          dat.idSupervisor === data.idSupervisor &&
          dat.fecha === data.fecha &&
          dat.idVariedad === variedad.id
      ).numEmpleado = data.numEmpleado;
      bitacora.find(
        (dat) =>
          dat.numFicha === data.numFicha &&
          dat.idRancho === data.idRancho &&
          dat.idSupervisor === data.idSupervisor &&
          dat.fecha === data.fecha &&
          dat.idVariedad === variedad.id
      ).nombre = data.nombre;
    }
    setTimeout(() => {
      localStorage.setItem('fichas-bitacora', JSON.stringify(bitacora));
    }, 300);
  }

  // Cargar bitacora cosecha
  addBitacoraCosecha() {
    // RIVISAR SI SE TIENEN QUE ELIMINAR
    let fichas_bitacora: any[] = [];
    let fichasAux: any[] = [];
    let init = 'VALUES';
    let queryBit = init;
    let querySal = init;
    if (JSON.parse(localStorage.getItem('fichas-bitacora'))) {
      fichasAux = JSON.parse(localStorage.getItem('fichas-bitacora'));
      fichas_bitacora = fichasAux ? fichasAux : [];
      for (const ficha of fichas_bitacora) {
        if (ficha.status === 1) {
          let hS = this.datepipe.transform(ficha.horaSalida, 'HH:mm');
          queryBit += `(NULL,'${ficha.idVariedad}','${ficha.idRancho}','${ficha.idSupervisor}','${ficha.numEmpleado}','${ficha.cajas}','${ficha.fecha}'),`;
          querySal += `(NULL,'${ficha.numEmpleado}','${ficha.fecha}','${hS}','${ficha.idRancho}','${ficha.idSupervisor}'),`;
          ficha.status = 0;
        }
      }
      let data = {
        sql_cos_bit: this.p1(queryBit),
        sql_rh_sal: this.p1(querySal),
      };
    }
  }

  crudBitacoraCosecha(datos: any) {
    // REVISAR SI SE TIENE QUE ELIMINAR
    const respuestaAPI = `${environment.urlAPI}/bitacora/addBitacoraCosecha`;
    return this.http.post(respuestaAPI, datos);
  }

  clean() {
    // Eliminar registros de hace 6 días
    // Paso 1.
    let fechaU = localStorage.getItem('fechaU');
    let fecha = this.restarDias(new Date(), 7).toISOString().split('T')[0];
    let bitacoraCosecha = this.verificarTD('capturaCosecha').filter(
      (d) => d.fecha !== fecha
    );
    let bitacoraFichas = this.verificarTD('fichas-bitacora').filter(
      (d) => d.fecha !== fecha
    );
    let bitacoraHorarios = this.verificarTD('horariosCosecha').filter(
      (d) => d.fecha !== fecha
    );
    let bitacoraFumigacion = this.verificarTD('capturaFumigacion').filter(
      (d) => d.fecha !== fecha
    );
    let bitacoraPlantilla = this.verificarTD('plantillas').filter(
      (d) => d.fecha !== fecha
    );
    let bitacoraRGalera = this.verificarTD('bitacoraRGalera').filter(
      (d) => d.fecha !== fecha
    );
    let bitacoraActivid = this.verificarTD('bitacoraActividades').filter(
      (d) => d.fecha > fecha
    );
    let bitacoraEvaluacionCosecha = this.verificarTD('bitacoraEvaluacionCosecha').filter(
      (d) => d.fecha > fecha
    );
    const diasARestar = JSON.parse(localStorage.getItem('diasFichas')); // Cantidad de días a restar

    let nuevaFecha: any = this._recursos.restarDias(
      this.getFechaMexHoy(),
      diasARestar - 1
    );
    nuevaFecha = nuevaFecha.toISOString().split('T')[0];

    let bitacoraF = this.verificarTD('bitacora_fichas').filter(
      (d) =>
        d.fecha !== fecha
    );
    // Limpiar Cajas Cosechadores
    let bitacoraModificacionesCajasCosechadores = this.verificarTD(
      'cajas_historial_modificaciones'
    ).filter(
      (d) =>
        d.fecha !== fecha
    );
    localStorage.setItem(
      'cajas_historial_modificaciones',
      JSON.stringify(bitacoraModificacionesCajasCosechadores)
    );

    let papeletasCajasCosechadores = this.verificarTD(
      'plantillaCosechadores'
    ).filter(
      (d) =>
        d.fecha !== fecha
    );
    localStorage.setItem(
      'plantillaCosechadores',
      JSON.stringify(papeletasCajasCosechadores)
    );

    let horariosCosechadores = this.verificarTD('horariosCosechadores').filter(
      (d) =>
        d.fecha !== fecha
    );
    localStorage.setItem(
      'horariosCosechadores',
      JSON.stringify(horariosCosechadores)
    );
    // fin Limpiar Cajas Cosechadores
    
    localStorage.setItem('capturaCosecha', JSON.stringify(bitacoraCosecha));
    localStorage.setItem('fichas-bitacora', JSON.stringify(bitacoraFichas));
    localStorage.setItem('horariosCosecha', JSON.stringify(bitacoraHorarios));
    localStorage.setItem(
      'capturaFumigacion',
      JSON.stringify(bitacoraFumigacion)
    );
    localStorage.setItem('fechaU', fecha);
    localStorage.setItem('bitacora_fichas', JSON.stringify(bitacoraF));
    localStorage.setItem('plantillas', JSON.stringify(bitacoraPlantilla));
    localStorage.setItem('bitacoraRGalera', JSON.stringify(bitacoraRGalera));
    localStorage.setItem(
      'bitacoraActividades',
      JSON.stringify(bitacoraActivid)
    );
    localStorage.setItem('bitacoraEvaluacionCosecha', JSON.stringify(bitacoraEvaluacionCosecha));

    if (fechaU !== fecha) {
      this._recursos.toastM(
        'bottom',
        'Se limiarón los registros de la fecha' + ' ' + fecha,
        2500
      );
    }
  }

  // Verifica que tenga datos
  verificarTD(nombre): any[] {
    let datos = JSON.parse(localStorage.getItem(nombre));
    return datos ? datos : [];
  }

  restarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
  }

  getSemanaFecha(valor: number = 0, fecha): string {
    let d = new Date(fecha); //Creamos un nuevo Date con la fecha de "this".
    d.setHours(0, 0, 0, 0); //Nos aseguramos de limpiar la hora.
    d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"

    const NUM_WK = Math.ceil(
      ((Number(d) - Number(new Date(d.getFullYear(), 0, 1))) / 8.64e7 + 1) / 7
    );
    return (
      d.getFullYear() +
      '-' +
      (Number(NUM_WK) + Number(valor) + (new Date(fecha).getDay() == 0 ? 1 : 0))
    );
  }

  sincronizarFumigacion(datos: any) {
    const respuestaAPI = `${environment.urlAPI}/fumigacion/sincronizar/agregar`;
    return this.http.post(respuestaAPI, datos);
  }
  sincronizarFumigacionEliminar(datos: any) {
    const respuestaAPI = `${environment.urlAPI}/fumigacion/sincronizar/eliminar`;
    return this.http.post(respuestaAPI, datos);
  }
  addBitacoraFichasv2(datos) {
    // console.log(datos);
    const respuestaAPI = `${environment.urlAPI}/bitacora/fichas/addFichasv2`;
    // console.log(respuestaAPI);
    return this.http.post(respuestaAPI, datos);
  }

  addBitacoraFichas() {
    let Query = 'VALUES';
    let bit: any[] = this.getData('fichas-bitacora');
    let bitacoras: any[] = [];
    // bitacoras = bit.length>0? bit.filter(d=> d.status === 1):[];
    bitacoras = bit.length > 0 ? bit : [];

    let datosPlus: {
      fecha: string;
      idRancho: number | string;
      idSupervisor: number | string;
      idVariedad: number | string;
    };
    let registrar = false;
    let existe = false;
    for (const bitacora of bitacoras) {
      if (bitacora.fecha === this.date) {
        existe = true;
      }
      if (bitacora.cajas > 0) {
        datosPlus = {
          fecha: bitacora.fecha,
          idRancho: bitacora.idRancho,
          idSupervisor: bitacora.idSupervisor,
          idVariedad: bitacora.idVariedad,
        };
        
        Query += `(NULL,'${bitacora.idVariedad}','${bitacora.idRancho}','${
          bitacora.idSupervisor
        }','${bitacora.numEmpleado}','${bitacora.numFicha}','${
          bitacora.rancho
        }','${bitacora.nombre}','${bitacora.horaSalida}','${bitacora.fecha}','${
          bitacora.cajas
        }','${bitacora.status}','${
          bitacora.local === false
            ? 0
            : bitacora.local === true
            ? 1
            : bitacora.local
        }'),`;
        registrar = true;
      }
    }
    if (bitacoras.length > 0 && registrar) {
      let data = {
        query: this.p1(Query),
        fecha: datosPlus ? datosPlus.fecha : bitacoras[0].fecha,
        idRancho: datosPlus ? datosPlus.idRancho : bitacoras[0].idRancho,
        idSupervisor: datosPlus
          ? datosPlus.idSupervisor
          : bitacoras[0].idSupervisor,
        idVariedad: datosPlus ? datosPlus.idVariedad : bitacoras[0].idVariedad,
      };

      setTimeout(() => {
        this.addFichas(data).subscribe(
          (r: any) => {
            for (const bitacora of bit) {
              bitacora.status = 0;
            }
            if (existe) {
              this._recursos.toastM(
                'bottom',
                'Carga de bitacora de fichas exitosa!!!!',
                2500
              );
            }
            localStorage.setItem('fichas-bitacora', JSON.stringify(bit));
          },
          (err) => {
            this._rError
              .registrarError(err.error.error, 'Fichas')
              .then((a) => a);
          }
        );
      }, 2000);
    }
  }

  addFichas(datos: any) {
    const respuestaAPI = `${environment.urlAPI}/bitacora/fichas/addFichas`;
    return this.http.post(respuestaAPI, datos);
  }

  generarQueryBAE() {
    let Query = 'VALUES';
    let bit: any[] = this.getData('bitacoraActividades');
    let bitacoras: any[] = [];
    bitacoras = bit.length > 0 ? bit.filter((d) => d.status === 1) : [];
    for (const bitacora of bitacoras) {
      Query += `(NULL,'${bitacora.idActPro}','${bitacora.idTunel}','${bitacora.numEmpleado}','${bitacora.rendimiento}'),`;
    }
    if (bitacoras.length > 0) {
      let data = {
        query: this.p1(Query),
      };

      // coNSUMO DE FUNCIÓN
      this.addBitacoraActEmp(data).subscribe((r: any) => {
        for (const bitacora of bit) {
          bitacora.status = 0;
        }

        this._recursos.toastM(
          'bottom',
          'Carga de bitacora de actividades exitosa!!!!',
          2500
        );
        localStorage.setItem('bitacoraActividades', JSON.stringify(bit));
      });
    }
  }

  addBitacoraActEmp(data) {
    const respuestaAPI = `${environment.urlAPI}/actividades/bitacora/addBitacoraAct`;
    return this.http.post(respuestaAPI, data);
  }

  verificarHoraFumigacion() {
    const respuestaAPI = `${environment.urlAPI}/fumigacion/config/verificarCarga`;
    return this.http.get(respuestaAPI);
  }

  getFechaHoy() {
    let f: any = new Date()
      .toLocaleString('es-MX', { timeZone: 'America/Mazatlan' })
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

  getFechaMexHoy(){
    return this.convertirFecha(new Date().toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
    }));
  }

  addRendimeintosGalera() {
    let nuevaFecha: any;

    const diasARestar =
      Number(JSON.parse(localStorage.getItem('diasFichas'))) - 1; // Cantidad de días a restar

    nuevaFecha = this._recursos.restarDias(this.getFechaMexHoy(),  Number(JSON.parse(localStorage.getItem('diasFichas'))));
    nuevaFecha = nuevaFecha.toISOString().split('T')[0];
    const todos = this._recursos
      .getDatosLocales('bitacoraRGalera')
      .filter(
        (d) =>
          d.fecha + '' >= nuevaFecha
      );
      console.log(todos, nuevaFecha);
    const resp = `${environment.urlAPI}/actividades/rendimientos/galera`;
    const capturas = { capturas: todos };
    return this.http.post(resp, capturas);
  }

  addActividades() {
    let plantillas = this.getAllDatos('plantillas');
    
    const diasARestar =
      Number(JSON.parse(localStorage.getItem('diasFichas'))) - 1; // Cantidad de días a restar
      let nuevaFecha: any;

    nuevaFecha = this._recursos.restarDias(this.getFechaMexHoy(), diasARestar );
    nuevaFecha = nuevaFecha.toISOString().split('T')[0];
    let ayer = this._recursos
      .restarDias(this.getFechaMexHoy(),  Number(JSON.parse(localStorage.getItem('diasFichas'))) - 1)
      .toISOString()
      .split('T')[0];
    if (
      plantillas.filter(
        (d) => d.fecha >= nuevaFecha && d.fecha <= this._recursos.getFechaHoy().fecha
      )
    ) {
      plantillas = plantillas.filter(
        (d) =>
          d.fecha >= nuevaFecha &&
          d.fecha <= this._recursos.getFechaHoy().fecha &&
          d.descuento + '' !== '-1'
      );
    }
    
    let horariosAactividades = this.getAllDatos('bitacoraAct');
    for (const hora of horariosAactividades) {
      hora.horaInicio = hora.horaInicio.split('T')[1].slice(0, 5);
      hora.horaFin = hora.horaFin.split('T')[1].slice(0, 5);
    }
    const resp = `${environment.urlAPI}/actividades/rendimientos`;
    console.log('actividades', { empleados: plantillas, horarios: horariosAactividades });
    return this.http.post(resp, { empleados: plantillas, horarios: horariosAactividades });
  }

  convertirFecha(cadena: string) {
    const [fecha, hora] = cadena.split(", ");
    const [dia, mes, año] = fecha.split("/").map(Number);
    let [horas, minutos, segundos] = hora.slice(0, -5).split(":").map(Number);
    const esPM = hora.includes("p.m.");
  
    horas = esPM && horas < 12 ? horas + 12 : !esPM && horas === 12 ? 0 : horas;
  
    return new Date(año, mes - 1, dia, horas, minutos, segundos);
  };
  addHorariosActividades() {
    let horariosAactividades = this.getAllDatos('bitacoraAct');
    for (const hora of horariosAactividades) {
      hora.horaInicio = hora.horaInicio.split('T')[1].slice(0, 5);
      hora.horaFin = hora.horaFin.split('T')[1].slice(0, 5);
    }
    const resp = `${environment.urlAPI}/actividades/rendimientos/addHorariosActividades`;
    return this.http.post(resp, { actividades: horariosAactividades });
  }
  addHorariosCosecha() {
    let horariosCosecha = this.getAllDatos('bitacoraCosHoras');
    for (const hora of horariosCosecha) {
      hora.horaInicio = hora.horaInicio.split('T')[1].slice(0, 5);
      hora.horaFin = hora.horaFin.split('T')[1].slice(0, 5);
    }
    const resp = `${environment.urlAPI}/actividades/rendimientos/addHorariosCosecha`;
    return this.http.post(resp, { cosecha: horariosCosecha });
  }

  addPorgramaActividades() {
    let datos = this._recursos.getDatosLocales('bitacoraActividades');

    let ayer = this._recursos
      .restarDias(this.getFechaMexHoy(), 2)
      .toISOString()
      .split('T')[0];
    if (
      datos.filter(
        (d) => d.fecha >= ayer && d.fecha <= this._recursos.getFechaHoy().fecha
      )
    ) {
      datos = datos.filter(
        (d) => d.fecha >= ayer && d.fecha <= this._recursos.getFechaHoy().fecha
      );
    }
    const resp = `${environment.urlAPI}/actividades/movil/programa`;
    return this.http.post(resp, { actividades: datos });
  }

  // Cargar Cajas Cosecha
  addCajasCosecha() {
    // Obtener datos del localStorague
    let fechaI, fechaF;
    const diasARestar =
      Number(JSON.parse(localStorage.getItem('diasFichas'))) - 1; // Cantidad de días a restar
    fechaI = this._recursos
      .restarDias(this.getFechaMexHoy(),
        diasARestar
      )
      .toISOString()
      .split('T')[0];
    fechaF = this._recursos.getFechaHoy().fecha;

    let cajas_historial_modificaciones = this._recursos.getDatosLocales(
      'cajas_historial_modificaciones'
    );
    cajas_historial_modificaciones = cajas_historial_modificaciones
      ? cajas_historial_modificaciones.filter(
          (d) => d.fecha >= fechaI && d.fecha <= fechaF
        )
      : [];

    let plantilla = this._recursos.getDatosLocales('plantillaCosechadores');
    plantilla = plantilla
      ? plantilla.filter((d) => d.fecha >= fechaI && d.fecha <= fechaF)
      : [];

    let actCosechaHorarios =
      this._recursos.getDatosLocales('actCosechaHorarios');
    actCosechaHorarios = actCosechaHorarios ? actCosechaHorarios : [];

    const resp = `${environment.urlAPI}/recursos_humanos/cajas/cosecha/movil`;
    return this.http.post(resp, {
      cajas_historial_modificaciones: cajas_historial_modificaciones,
      plantillas: plantilla,
      actCosechaHorarios: actCosechaHorarios,
      uid: localStorage.getItem('uid'),
    });
  }
  
  addEvaluacionCosecha() {
    let evaluacionesCosecha = this.getAllDatos('bitacoraEvaluacionCosecha');
    let ayer: any = this._recursos.restarDias(this.getFechaMexHoy(), 1 );

    ayer = ayer.toISOString().split('T')[0];
    evaluacionesCosecha = evaluacionesCosecha.filter(d => d.fecha >= ayer);
    let data = {
      bitacoraEvaluacionCosecha: evaluacionesCosecha
    };
    const resp = `${environment.urlAPI}/cosecha/evaluaciones/addEvaluaciones`;
    return this.http.post(resp, data);
  }

  addActividadesRegulares(){
    let data = this.getAllDatos('rendimientosActividades');
    const resp = `${environment.urlAPI}/actividades/movil/programa/addActividadesRegulares`;
    console.log({dataActividades:data,uid: localStorage.getItem('uid')});
    return this.http.post(resp, {dataActividades:data,uid: localStorage.getItem('uid')});
  }
  addBitacoraHorariosCuadrillas(){
    let data = this.getAllDatos('bitacoraHorariosCuadrillas');
    const resp = `${environment.urlAPI}/cosecha/movil/addBitacoraHorariosCuadrillas`;
    return this.http.post(resp, {bitacoraHorariosCuadrillas:data, uid: localStorage.getItem('uid')});
  }
}
