export interface IEvaluaciones {
  fecha: string;
  empleados?: IEmpleados[];
}

interface IEmpleados{
  numEmpelado: number |string;
  nombre: string;
  historial:IHistorial[];
}

interface IHistorial{
  fecha: string;
  ranchos: IRanchos[];
}

interface IRanchos{
  rancho: string;
  nombre: string;

  sectores: ISectores[];
}

interface ISectores{
  sector: string;
  nombre: string;
  capturas:ICapturaE[];
}

export interface ICapturaE{
  hora: string;
  idTunel: number;
  idRancho: number | string;
  idSector: number | string;
  tunel?: string;
  estacas: number;
  rubros:IRubros[];
  editar?: boolean;
  comentario?: string
}

interface IRubros{
  icon: string;
  nombre: string;
  id: number,
  frutos: number
}