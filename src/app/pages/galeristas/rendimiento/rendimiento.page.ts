/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { toLower } from 'ionicons/dist/types/components/icon/utils';
import { AsyncService } from 'src/app/services/async.service';
import { RecursosService } from 'src/app/services/recursos.service';
interface IRendimientoGalera {
  idRancho: number;
  fecha: string;
  empleados: IEmpleadoRendimeinto[];
}
interface IEmpleadoRendimeinto {
  numEmpleado: number;
  redimientos: IRendimientos[];
  nombre: string;
}
interface IRendimientos {
  idCultivo: number;
  cajas: number;
}
@Component({
  selector: 'app-rendimiento',
  templateUrl: './rendimiento.page.html',
  styleUrls: ['./rendimiento.page.scss'],
})
export class RendimientoPage implements OnInit {
  id: string;
  rancho: any[];
  fecha: string = '0000-00-00';
  empleados: any[] = [];
  empleadosAux: any[] = [];
  palabra: any = '';
  bandera1: boolean = false;
  cultivos: any[] = [];
  bitacoraRG: IRendimientoGalera;
  nuevaFecha: any;
  hoy: any;
  nombreDB = 'bitacoraRGalera';
  constructor(
    private navCtrl: NavController,
    private _async: AsyncService,
    private activatedRoute: ActivatedRoute,
    private _recursos: RecursosService
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('idRancho');
    this.fecha = this.activatedRoute.snapshot.paramMap.get('fecha');
    this.hoy = this.activatedRoute.snapshot.paramMap.get('fecha');
    const diasARestar =
      Number(JSON.parse(localStorage.getItem('diasFichas'))) - 1; // Cantidad de días a restar
    this.nuevaFecha = this._recursos.restarDias(this.convertirFecha(new Date().toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
    })), diasARestar );
    this.nuevaFecha = this.nuevaFecha.toISOString().split('T')[0];
    this.getMeta();
    this.getRendimientos();
  }
   convertirFecha(cadena: string) {
    const [fecha, hora] = cadena.split(", ");
    const [dia, mes, año] = fecha.split("/").map(Number);
    let [horas, minutos, segundos] = hora.slice(0, -5).split(":").map(Number);
    const esPM = hora.includes("p.m.");
  
    horas = esPM && horas < 12 ? horas + 12 : !esPM && horas === 12 ? 0 : horas;
  
    return new Date(año, mes - 1, dia, horas, minutos, segundos);
  };

  getRendimientos() {
    const d = this._recursos.getDatosLocales(this.nombreDB);
    if (
      d.find(
        (f) =>
          Number(f.idRancho) == Number(this.id) &&
          f.fecha + '' == this.fecha + ''
      )
    ) {
      this.bitacoraRG = d.find(
        (f) =>
          Number(f.idRancho) == Number(this.id) &&
          f.fecha + '' == this.fecha + ''
      );
    } else {
      const anterior = d.filter((f) => Number(f.idRancho) == Number(this.id));
      if (anterior.length > 0) {
        
        let aux;
        if (anterior.length > 1) {
          this._recursos.ordenar('fecha', 2, anterior);
          aux = anterior[0];
          aux.fecha = this.fecha.slice(0, 10)
        } else {
          aux = anterior[0];
          aux.fecha = this.fecha.slice(0, 10);
        }
        for (const empleado of aux.empleados) {
          for (const cultivo of empleado.redimientos) {
            cultivo.cajas = 0;
          }
        }
        this.bitacoraRG = aux;
      } else {

        this.bitacoraRG = {
          idRancho: Number(this.id),
          fecha: this.fecha.slice(0, 10),
          empleados: [],
        };
      }
    }
  }

  getMeta() {
    this.rancho = this._async.getData('ranchos', this.id, 'idRancho', 'rancho');
    this.empleados = this._recursos.getDatosLocales('empleados');
    this.empleadosAux = this._recursos.getDatosLocales('empleados');
    this.cultivos = this._recursos
      .getDatosLocales('variedades')
      .filter((d) => d.id < 3);
  }
  back() {
    this.navCtrl.navigateBack(`/escoger-rancho/6`);
  }

  buscar() {
    setTimeout(() => {
      if (this.palabra.length > 0 && this.palabra !== null) {
        this.bandera1 = true;
        let pre = this.empleados.filter((d) =>
          d.nombre
            .toLocaleLowerCase()
            .includes(this.palabra.toLocaleLowerCase())
        );
        for (const empleado of this.bitacoraRG.empleados) {
          pre = pre.filter((d) => d.numEmpleado !== empleado.numEmpleado);
        }
        this.empleadosAux = pre;
      } else {
        this.empleadosAux = [];
        this.bandera1 = false;
      }
    }, 200);
  }

  addEmpleado(empleado: IEmpleadoRendimeinto) {
   
    empleado.redimientos = [];
    for (const cultivo of this.cultivos) {
      // cultivo.idCultivo = Number(cultivo.id);
      empleado.redimientos.push(
        {
          idCultivo: Number(cultivo.id),
          cajas: null
        }
      );
    }
    this.bitacoraRG.empleados.push(empleado);
    this.bandera1 = false;
    this._recursos.ordenar('nombre', 1, this.bitacoraRG.empleados);
    this.palabra = '';
    this.empleadosAux = this.empleadosAux.filter(
      (d) => d.numEmpleado + '' === empleado.numEmpleado + ''
    );
  }
  limpear() {
    setTimeout(() => {
      this.bandera1 = false;
      this.palabra = '';
    }, 100);
  }

  deletEmpleado(id) {
    this.bitacoraRG.empleados = this.bitacoraRG.empleados.filter(
      (d) => d.numEmpleado !== id
    );
    this.addDatos(this.bitacoraRG);
  }
  addDatos(datos) {
    let todos: IRendimientoGalera[] = JSON.parse(
      localStorage.getItem(this.nombreDB)
    );
    if (todos) {
      todos = todos.filter(
        (d) =>
          !(d.idRancho + '' === this.id + '' && d.fecha === this.fecha + '')
      );
      todos.push(datos);
      localStorage.setItem(this.nombreDB, JSON.stringify(todos));
    } else {
      localStorage.setItem(this.nombreDB, JSON.stringify([datos]));
    }
  }
}
