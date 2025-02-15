export interface IEmpleados {
  numEmpleado: string;
  firma: string;
  pago: number;
  fecha: string;
  actividades: IActividades;
  cosecha: ICosechadas;
  porHora: IHoras;
  porDia: IDia;
  voleos: IVoleos;
  nombre: string;
  show: boolean;
  horaInicio?: string;
  horaFin?: string;
  status?: number;
  uid?: string;
  paterno?: string;
  materno?: string;
  idReclutador?: number;
  reclutador?: boolean;
  reclutados: IRecudatos[];
  reclutador_precio?: number;
  recibos: IRecibo[];
  ruta?: string;
  check?: boolean;
  descuento?: number;
  porTarea?: number;
}
export interface IRecibo {
  firma: string;
  actividades: IActividades;
  cosecha: ICosechadas;
  porHora: IHoras;
  porDia: IDia;
}

export interface IRecudatos {
  nombre: string;
  numEmpleado: string;
}

export interface IActividades {
  pago: number;
  numSurcos: number;
  granTotal: number;
  rendimientos: IActividadesRendimiento[];
}

export interface IActividadesRendimiento {
  idActividad: number;
  idApp: string;
  idRancho: number;
  rancho: string;
  actividad: string;
  sector: string;
  pago: number;
  numSurcos: number;
  horaInicio: string;
  horaFin: string;
  capturas: IActividadesRendimientoCaptura[];
  descuento?: number;
}
export interface IActividadesRendimientoCaptura {
  idTunel: number;
  numSurcosAnt: number;
  tunel: string;
  numSurcos: number;
  precio: number;
  pago: number;
  idTunelAux?: number;
}

interface ICosechadas {
  pago: number;
  cajas: number;
  rendimientos: ICosechadasRendimiento[];
}

interface ICosechadasRendimiento {
  idCultivo: number;
  idRancho: number | string;
  idSupervisor: number | string;
  cultivo: string;
  supervisor: string;
  pago: number;
  capturas: ICosechadasRendimientoCaptura;
  nombre: string;
}

interface ICosechadasRendimientoCaptura {
  precio: number;
  rangoInicial: number;
  rangoFinal: number;
  cajas: number;
  pago: number;
}

interface IHoras {
  precio: number;
  horas: number;
  horaI: string;
  horaF: string;
  idRancho: number;
  idSupervisor: number;
  paga: number;
  rendiminetos: {
    actividades: IActividadesHistorial[];
    cosecha: ICosechaHistorial[];
  };
}

interface IVoleos {
  rendimientos: IVoleosRendmientos[];
  total: number;
}
interface IVoleosRendmientos {
  idProgramaVoleo: number;
  producto: string;
  sacos: number;
  horaInicio: string;
  horaFin: string;
  pago: number;
  descuento: number;
}

interface IActividadesHistorial {
  idActividad: number;
  idTunel: number;
  numSurcos: number;
}

interface ICosechaHistorial {
  cajas: number;
}

interface IDia {
  precio: number;
  paga: number;
  idRancho: number;
  idSupervisor: number;
  activo: boolean;
  rendiminetos: {
    actividades: IActividadesHistorial[];
    cosecha: ICosechaHistorial[];
  };
}
