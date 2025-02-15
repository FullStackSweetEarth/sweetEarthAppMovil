export interface IFCapturasAll {
    fecha: string;
    fechaHora: string;
    idRancho: number;
    nombreRancho: string;
    numRancho: string;
    captura: IFcaptura[];
    eliminados?:string[];
}

export interface IFcaptura {
    id: string;
    idRancho: number;
    horaInicio: string;
    horaFin: string;
    temperatura: string;
    velocidadViento: string;
    clima: string;
    idClima?: number;
    idTipoAplicacion: number;
    agua: string;
    productos: IFproductos[];
    equipos: IFEquipos[];
    sectores: IFSectores[];
    sincronizado:number;
}

export interface IFproductos {
    idProducto: number;
    nombreProdo: string;
    cantidad: number;
    unidadMedida: string
}

export interface IFEquipos {
    id: number;
    idAnterior: string;
}
export interface IFSectores {
    idPlantacion: number;
    sector: string;
}

export interface IFTipoAplicacion {
    id: number;
    tipo: string;
}