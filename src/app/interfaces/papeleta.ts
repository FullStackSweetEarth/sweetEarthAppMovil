/* eslint-disable @typescript-eslint/naming-convention */


export interface ICalendario {
  wk: string;
  fechas: IFechas[];
}
export interface IRancho {
  idRancho: number;
  rancho: string;
  sectores: ISectores[];
}

export interface IFechas {
  fecha: string;
  wkTXT: string;
}

export interface ISectores {
  plantacionID: number;
  numeroRancho: string;
  sector: string;
  wkPlantacion: string;
  wkPrimerCorte: string;
  wkVida: string;
  wkCorte: string;
  rancho: string;
  vida: IVida[];
}

export interface IVida {
  wk: string;
  status: string;
}



/* Guardar Datos*/
export interface ISupervisorCosecha {
  id: number;
  idCatalogo: number;
  idSitio: number;
  nombre: string;
}


export interface ISKU {
  cultivo: string;
  cultivoID: number;
  factor: number;
  idsku: number;
  numClamchells: number;
  oz: number;
  sku: number;
}

export interface ICosechaGuardar {
  fecha: string;
  idRancho: number;
  numRancho: number;
  nombreRancho: string;
  fechaHora: string;
  captura: ICaptura[];
}


export interface ICaptura {
  fecha: string | Date ;
  papeleta: number;
  numLicencia?: number;
  idRancho: number;
  numRancho: number;
  rancho: string;
  sector: ISector[];
  horaEnvio: string;
  totalCajas: number;
  status: number;
  kilogramosCampo?: number ;
  kilogramosProceso?: number;
}

export interface ISector {
  sku: number;
  skuTitulo: string;
  sector: string;
  idPlantacion: number;
  cajas: number;
  kilogramosProceso: number;
  fechaHora: string;
  horaInicio?: string;
  horaFin?: string;
  horaEnvio?: string;
  idSupervisor: number;
  kilogramosCampo: number;
  supervisor?: string;
  numLicencia: number;
 status: number;
}

export interface IHorarioCosecha {
  fecha: string;
  idRancho: number | string;
  idSupervisor: number | string;
  sector: number;
  CosHoraInicio: string;
  CosHoraFin: string;
  GalHoraInicio: string;
  GalHoraFin: string;
  NumCosechadores: number;
  NumGaleristas: number;
  plantacionID?: number;
  estatus?: number;
  kilogramosGalera: number;
  kilogramosCampo: number;
  horaEnvio?: string;
}

