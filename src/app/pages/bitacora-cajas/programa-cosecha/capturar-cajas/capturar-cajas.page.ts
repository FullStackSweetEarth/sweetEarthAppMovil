import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { RecursosService } from 'src/app/services/recursos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-capturar-cajas',
  templateUrl: './capturar-cajas.page.html',
  styleUrls: ['./capturar-cajas.page.scss'],
})
export class CapturarCajasPage implements OnInit {
  mostrar = false;
  programaCosecha: any;
  plantilla: any;
  fecha: any;
  banderaPlantilla: boolean = false;
  totalRealPrograma: number = 0;
  bandera: boolean;
  palabra: string = '';
  horaInicio: any;
  horaFin: any;
  constructor(
    private navCtrl: NavController,
    private _recursos: RecursosService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    window.addEventListener('beforeunload', function () {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString()); // Convertir a string
    });

    window.addEventListener('load', function () {
      const scrollPosition = sessionStorage.getItem('scrollPosition');
      if (scrollPosition) {
        window.scrollTo(0, Number(scrollPosition)); // Convertir de string a number
      }
    });
    this.banderaPlantilla = false;
    this.fecha = localStorage.getItem('fechaCosecha');
    this.programaCosecha = this._recursos.getDatosLocales(
      'programaCosechaCaptura'
    );
    this.plantilla = this._recursos
      .getDatosLocales('plantillaCosechadores')
      .find((d) => d.fecha === this.fecha);
    this.plantilla = this.plantilla ? this.plantilla.empleados : [];
    this.banderaPlantilla = true;

    // GET HORARIOS
    let horarios = this._recursos.getDatosLocales('actCosechaHorarios');
    horarios = horarios.find(
      (d) => (d.idProgramaAct = this.programaCosecha.idProgramaAct)
    );
    this.horaInicio = horarios ? horarios.hora_inicio : null;
    this.horaFin = horarios ? horarios.hora_fin : null;
    this.calcularTotalPrograma();
  }

  back() {
    this.navCtrl.navigateBack(`bitacora-cajas/programa-cosecha`);
  }

  addRendimeintos(empleado, cultivo) {
    if (!(empleado.cajas > 0)) {
      this._recursos.toastM(
        'bottom',
        'No puedes registrar menos de 1 caja !!!!',
        5000
      );
      return;
    }
    let plantillaAll: any[] = this._recursos
      .getDatosLocales('plantillaCosechadores')
      .filter((d) => d.fecha !== this.fecha);
    plantillaAll = plantillaAll ? plantillaAll : [];
    if (
      empleado.rendimientos.find(
        (d) =>
          d.idProgramaCosecha + '' === this.programaCosecha.idProgramaAct + ''
      )
    ) {
      empleado.rendimientos
        .find(
          (d) =>
            d.idProgramaCosecha + '' === this.programaCosecha.idProgramaAct + ''
        )
        .cajas.push({
          idCultivo: this.programaCosecha.idCultivo,
          cajas: empleado.cajas,
          fecha: this.fecha,
          hora: this._recursos.getFechaHoy().hora,
          fecha_hora:
            this._recursos.getFechaHoy().fecha +
            ' ' +
            this._recursos.getFechaHoy().hora,
          cultivo: cultivo,
        });
    } else {
      empleado.rendimientos.push({
        idProgramaCosecha: this.programaCosecha.idProgramaAct,
        sector: this.programaCosecha.sector,
        rancho: this.programaCosecha.rancho,
        cajas: [
          {
            idCultivo: this.programaCosecha.idCultivo,
            cajas: empleado.cajas,
            fecha: this.fecha,
            hora: this._recursos.getFechaHoy().hora,
            fecha_hora:
              this._recursos.getFechaHoy().fecha +
              ' ' +
              this._recursos.getFechaHoy().hora,
            cultivo: cultivo,
          },
        ],
      });
    }
    let total = 0,
      aux = empleado.rendimientos.find(
        (d) =>
          d.idProgramaCosecha + '' === this.programaCosecha.idProgramaAct + ''
      );
    for (const rendimeinto of aux.cajas) {
      total += rendimeinto.cajas;
    }
    // calcularTotales
    for (const cultivo of empleado.totales) {
      cultivo.cajas = 0;
      for (const rendimeinto of empleado.rendimientos) {
        for (const caja of rendimeinto.cajas) {
          if (cultivo.idCultivo + '' === caja.idCultivo + '') {
            cultivo.cajas += caja.cajas;
          }
        }
      }
    }
    // Registro de acciones
    let historial = {
      numEmpleado: empleado.numEmpleado,
      cajas: empleado.cajas,
      hora: this._recursos.getFechaHoy().hora,
      fecha: this._recursos.getFechaHoy().fecha,
      idProgramaCosecha: this.programaCosecha.idProgramaAct,
      sector: this.programaCosecha.sector,
      rancho: this.programaCosecha.rancho,
      uid: localStorage.getItem('uid'),
      estatus: 'Registró',
      fecha_hora:
        this._recursos.getFechaHoy().fecha +
        ' ' +
        this._recursos.getFechaHoy().hora,
    };
    let aux3 = this._recursos.getDatosLocales('cajas_historial_modificaciones');
    aux3.push(historial);
    localStorage.setItem(
      'cajas_historial_modificaciones',
      JSON.stringify(aux3)
    );
    aux.total = total;
    empleado.cajas = 0;
    empleado.mostrar = false;
    plantillaAll.push({
      fecha: this.fecha,
      empleados: this.plantilla,
    });
    this.calcularTotalPrograma();
    // localStorage.setItem('plantillaCosechadores', JSON.stringify(plantillaAll));
    this.modificar(empleado);
  }
  getTotal(empleado: any) {
    let total = 0;
    let datos = empleado.redimientos.find(
      (d) =>
        d.idProgramaCosecha + '' === this.programaCosecha.idProgramaAct + ''
    );
    datos = datos ? datos.cajas : [];
    for (const rendimeinto of datos) {
      total += rendimeinto.cajas;
    }
    empleado.redimientos.totalCajas = total;
    return total;
  }
  calcularTotalPrograma() {
    this.totalRealPrograma = 0;
    let aux;
    for (const empleado of this.plantilla) {
      aux = empleado.rendimientos.find(
        (d) =>
          d.idProgramaCosecha + '' === this.programaCosecha.idProgramaAct + ''
      );
      if (aux) this.totalRealPrograma += aux.total;
    }
  }
  modificar(empleado = null) {
    let plantillaAll: any[] = this._recursos
      .getDatosLocales('plantillaCosechadores')
      .filter((d) => d.fecha !== this.fecha);
    let total = 0,
      aux = null;
    for (const empleado of this.plantilla) {
      empleado.mostrar = false;
      (total = 0),
        (aux = empleado.rendimientos.find(
          (d) =>
            d.idProgramaCosecha + '' === this.programaCosecha.idProgramaAct + ''
        ));
      if (aux) {
        for (const rendimeinto of aux.cajas) {
          total += rendimeinto.cajas;
        }
        aux.total = total;
      }
      empleado.granTotal = 0;
      for (const rendimiento of empleado.rendimientos) {
        // console.log(rendimiento.total);
        empleado.granTotal += rendimiento.total;
      }
      // calcularTotales
      for (const cultivo of empleado.totales) {
        cultivo.cajas = 0;
        for (const rendimeinto of empleado.rendimientos) {
          for (const caja of rendimeinto.cajas) {
            if (cultivo.idCultivo + '' === caja.idCultivo + '') {
              cultivo.cajas += caja.cajas;
            }
          }
        }
      }
    }
    plantillaAll.push({
      fecha: this.fecha,
      empleados: this.plantilla,
    });
    this.calcularTotalPrograma();
    localStorage.setItem('plantillaCosechadores', JSON.stringify(plantillaAll));

    this.plantilla = this._recursos
      .getDatosLocales('plantillaCosechadores')
      .find((d) => d.fecha === this.fecha);
    const div = document.getElementById('scroll-Card');
    sessionStorage.setItem('scrollPosition', div.scrollTop.toString()); // Convertir a string

    this.plantilla = this.plantilla ? this.plantilla.empleados : [];

    this.plantilla.find(d => d.numEmpleado === empleado.numEmpleado).mostrar = true;
    setTimeout(() => {
      const scrollPosition = sessionStorage.getItem('scrollPosition');
      if (scrollPosition && div) {
        div.scrollTop = Number(scrollPosition); // Convertir de string a number
      }
    }, 200);
  }
  async delete(hora, numempleado) {
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
            let aux;
            this.bandera = true;
            for (const empleado of this.plantilla) {
              aux = empleado.rendimientos.find(
                (d) =>
                  d.idProgramaCosecha + '' ===
                  this.programaCosecha.idProgramaAct + ''
              );
              if (aux) {
                if (empleado.numEmpleado + '' === numempleado + '') {
                  // Registro de acciones
                  let historial = {
                    numEmpleado: empleado.numEmpleado,
                    cajas: empleado.cajas,
                    hora: this._recursos.getFechaHoy().hora,
                    fecha: this._recursos.getFechaHoy().fecha,
                    idProgramaCosecha: this.programaCosecha.idProgramaAct,
                    uid: localStorage.getItem('uid'),
                    estatus: 'Eliminó',
                    fecha_hora:
                      this._recursos.getFechaHoy().fecha +
                      ' ' +
                      this._recursos.getFechaHoy().hora,
                  };
                  let aux3 = this._recursos.getDatosLocales(
                    'cajas_historial_modificaciones'
                  );
                  aux3.push(historial);
                  localStorage.setItem(
                    'cajas_historial_modificaciones',
                    JSON.stringify(aux3)
                  );
                  aux.cajas = aux.cajas.filter(
                    (d) => d.hora + '' !== hora + ''
                  );
                  this.bandera = false;

                  break;
                }
              }
            }
            this.modificar();
          },
        },
      ],
    });

    await alert.present();
  }

  addHistorialM(empleado) {
    // Registro de acciones
    let historial = {
      numEmpleado: empleado.numEmpleado,
      cajas: empleado.cajas,
      hora: this._recursos.getFechaHoy().hora,
      fecha: this._recursos.getFechaHoy().fecha,
      idProgramaCosecha: this.programaCosecha.idProgramaAct,
      uid: localStorage.getItem('uid'),
      estatus: 'Modificó',
      fecha_hora:
        this._recursos.getFechaHoy().fecha +
        ' ' +
        this._recursos.getFechaHoy().hora,
    };

    let aux3 = this._recursos.getDatosLocales('cajas_historial_modificaciones');
    aux3.push(historial);
    localStorage.setItem(
      'cajas_historial_modificaciones',
      JSON.stringify(aux3)
    );
  }
  registrarHorarioRealCosecha() {
    if (this.horaInicio && this.horaFin) {
      let allProgramas: any[] =
        this._recursos.getDatosLocales('actCosechaHorarios');
      allProgramas = allProgramas.filter(
        (d) => d.idProgramaAct + '' !== this.programaCosecha.idProgramaAct
      );
      allProgramas.push({
        idProgramaAct: this.programaCosecha.idProgramaAct,
        hora_inicio: this.horaInicio,
        hora_fin: this.horaFin,
      });
      localStorage.setItem('actCosechaHorarios', JSON.stringify(allProgramas));
    }
  }
}
