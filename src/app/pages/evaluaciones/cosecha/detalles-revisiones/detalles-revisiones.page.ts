import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ICapturaE, IEvaluaciones } from 'src/app/interfaces/evaluaciones';
import { RecursosService } from 'src/app/services/recursos.service';

@Component({
  selector: 'app-detalles-revisiones',
  templateUrl: './detalles-revisiones.page.html',
  styleUrls: ['./detalles-revisiones.page.scss'],
})
export class DetallesRevisionesPage implements OnInit {
  listaTuneles = [1, 1, 1];
  editar;
  menu = 1;
  detalles: IEvaluaciones[] = [];
  numEmpleado: string;
  nombre: string;
  sinRegistro: boolean = false;
  fecha: string;
  listaRanchos: any[] = [];
  rubros: any[] = [];
  constructor(
    private alertController: AlertController,
    private navCont: NavController,
    private _recursos: RecursosService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.listaRanchos = this._recursos.getDatosLocales('ranchos');

    this.numEmpleado = this.activatedRoute.snapshot.paramMap.get('numEmpleado');
    this.nombre = this.activatedRoute.snapshot.paramMap.get('nombre');
    this.fecha = this.activatedRoute.snapshot.paramMap.get('fecha');
    this.rubros = this._recursos.getDatosLocales('evaluacionesRubros');
    this.getDetalles();
  }

  async delete(fecha, array) {
    const alert = await this.alertController.create({
      header: '¿Está seguro que desea borrar el registro?',
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
            let aux: IEvaluaciones[] = this._recursos.getDatosLocales(
              'bitacoraEvaluacionCosecha'
            );
            aux = this.eliminarCaptura(
              aux,
              this.numEmpleado,
              fecha,
              array.idRancho,
              array.idSector,
              array.idTunel
            );

            localStorage.setItem(
              'bitacoraEvaluacionCosecha',
              JSON.stringify(aux)
            );
            this._recursos.toastM('bottom', 'Eliminación exitoso', 2000);
            this.getDetalles();
          },
        },
      ],
    });

    await alert.present();
  }

  eliminarCaptura(
    evaluaciones: IEvaluaciones[],
    numEmpleado: number | string,
    fecha: string,
    idRancho: number | string,
    idSector: number | string,
    idTunel: number
  ): IEvaluaciones[] {
    return evaluaciones.map((evaluacion) => {
      // Filtrar los empleados que coinciden con numEmpleado
      if (evaluacion.empleados) {
        evaluacion.empleados = evaluacion.empleados.map((empleado) => {
          // Verificar si el empleado coincide
          if (empleado.numEmpelado === numEmpleado) {
            empleado.historial = empleado.historial.map((hist) => {
              // Filtrar los registros del historial que coinciden con la fecha
              if (hist.fecha === fecha) {
                // Filtrar las ranchos para eliminar la captura correspondiente
                hist.ranchos = hist.ranchos.map((rancho) => {
                  if (rancho.rancho === idRancho) {
                    // Filtrar los sectores para eliminar la captura
                    rancho.sectores = rancho.sectores.map((sector) => {
                      if (sector.sector === idSector) {
                        // Filtrar las capturas
                        sector.capturas = sector.capturas.filter(
                          (captura) => !(captura.idTunel === idTunel)
                        );
                      }
                      return sector; // Retornar el sector
                    });
                  }
                  return rancho; // Retornar el rancho
                });
              }
              return hist; // Retornar el historial
            });
          }
          return empleado; // Retornar el empleado
        });
      }
      return evaluacion; // Retornar la evaluacion
    });
  }

  back() {
    this.navCont.navigateBack(`evaluaciones/cosecha`);
  }

  capturar(idRancho: string | number = 0, idSector: string | number = 0) {
    this.navCont.navigateBack(
      `evaluaciones/cosecha/captura/${this.numEmpleado}/${this.fecha}/${idRancho}/${idSector}/${this.nombre}`
    );
  }

  getDetalles() {
    this.detalles = [];
    let aux: IEvaluaciones[] = this._recursos.getDatosLocales(
      'bitacoraEvaluacionCosecha'
    );
    this._recursos.ordernarDESC(aux, 'fecha');
    if (aux.length > 0) {
      for (const fecha of aux) {
        for (const empleado of fecha.empleados) {
          if (empleado.numEmpelado + '' === this.numEmpleado + '') {
            if (
              this.detalles.length == 0 &&
              fecha.fecha + '' !== this._recursos.getFechaHoy().fecha
            ) {
              this.detalles.push({
                fecha: this._recursos.getFechaHoy().fecha,
                empleados: [
                  {
                    numEmpelado: this.numEmpleado,
                    nombre: '',
                    historial: [
                      {
                        fecha: '',
                        ranchos: [
                         
                        ],
                      },
                    ],
                  },
                ],
              });
              if (this.detalles.length < 3) {
                this.detalles.push({
                  fecha: fecha.fecha,
                  empleados: [empleado],
                });
              }
            } else {
              if (this.detalles.length < 3) {
                this.detalles.push({
                  fecha: fecha.fecha,
                  empleados: [empleado],
                });

              }
            }
          } else {
            console.log(empleado);
          }
        }
        aux = aux.filter((d) => d.fecha <= this._recursos.getFechaHoy().fecha);
      }
    } else {
      this.sinRegistro = true;
      this.detalles.push({
        fecha: this._recursos.getFechaHoy().fecha,
        empleados: [
          {
            numEmpelado: this.numEmpleado,
            nombre: '',
            historial: [
              {
                fecha: this._recursos.getFechaHoy().fecha,
                ranchos: [
                  {
                    rancho: '',
                    nombre: '',
                    sectores: [
                      {
                        sector: '',
                        nombre: '',
                        capturas: [
                          {
                            hora: '',
                            idTunel: null,
                            idRancho: null,
                            idSector: null,
                            estacas: 0,
                            rubros: this.rubros,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
    }
  }
  crearAutoInicializacion<T extends object>(estructura: Partial<T> = {}): T {
    const resultado: T = {} as T;

    // Función interna para inicializar propiedades
    const inicializarPropiedades = (obj: T) => {
      for (const clave in obj) {
        if (obj.hasOwnProperty(clave)) {
          const valor = obj[clave];

          // Si la propiedad está definida como undefined, inicializa como un arreglo vacío
          if (valor === undefined) {
            obj[clave as keyof T] = [] as any;
          } else if (typeof valor === 'object' && valor !== null) {
            // Si es un objeto, inicializa recursivamente
            obj[clave as keyof T] = this.crearAutoInicializacion(
              valor as Partial<any>
            );
          }
        }
      }
    };

    // Itera sobre las claves del tipo T
    for (const clave in resultado) {
      // Si la propiedad no existe en estructura, inicializa
      if (!(clave in estructura)) {
        resultado[clave as keyof T] = [] as any; // O puedes establecer otros valores por defecto aquí
      } else {
        resultado[clave as keyof T] = estructura[clave] as any;
      }
    }

    inicializarPropiedades(resultado);
    return resultado;
  }

  addEvaluacion(datos) {
    datos.editar = false;
    let aux: any = this._recursos.getDatosLocales('bitacoraEvaluacionCosecha');
    this.removeOrCreateCaptura(
      aux,
      this.fecha,
      this.numEmpleado,
      datos.idRancho,
      datos.idSector,
      datos.idTunel,
      datos
    );
    localStorage.setItem('bitacoraEvaluacionCosecha', JSON.stringify(aux));
    this._recursos.toastM('bottom', 'Registro exitoso', 2000);
  }
  removeOrCreateCaptura(
    evaluaciones: IEvaluaciones[],
    fecha: string,
    numEmpleado: number | string,
    idRancho: number,
    idSector: number,
    idTunel: number,
    capturaData: ICapturaE
  ): void {
    const date = new Date(capturaData.hora);
    // Encuentra o crea la evaluación por fecha
    let evaluacion = evaluaciones.find((e) => e.fecha === fecha);
    if (!evaluacion) {
      evaluacion = { fecha, empleados: [] };
      evaluaciones.push(evaluacion);
    }

    // Encuentra o crea el empleado
    let empleado = evaluacion.empleados!.find(
      (e) => e.numEmpelado === numEmpleado
    );
    if (!empleado) {
      empleado = { numEmpelado: numEmpleado, nombre: '', historial: [] };
      evaluacion.empleados!.push(empleado);
    }

    // Encuentra o crea el historial por fecha
    let historial = empleado.historial.find((h) => h.fecha === fecha);
    if (!historial) {
      historial = { fecha, ranchos: [] };
      empleado.historial.push(historial);
    }

    // Encuentra o crea el rancho
    let rancho = historial.ranchos.find(
      (r) => r.rancho === idRancho.toString()
    );
    let ranchoD = this.listaRanchos.find((d) => d.idRancho === idRancho);
    if (!rancho) {
      rancho = {
        rancho: idRancho.toString(),
        nombre: ranchoD.rancho,
        sectores: [],
      };
      historial.ranchos.push(rancho);
    }

    // Encuentra o crea el sector
    let sector = rancho.sectores.find((s) => s.sector === idSector.toString());
    if (!sector) {
      sector = { sector: idSector.toString(), nombre: null, capturas: [] };
      rancho.sectores.push(sector);
    }

    // Filtra las capturas que coincidan con el idTunel, idRancho y idSector para eliminarla si existe
    sector.capturas = sector.capturas.filter(
      (captura) =>
        !(
          captura.idTunel === idTunel &&
          captura.idRancho === idRancho &&
          captura.idSector === idSector
        )
    );

    // Agrega la nueva captura
    sector.capturas.push(capturaData);
  }
}
