export interface IHorariosCosechaCuadrilla{
    idSupervisor: number;
    fecha:string;
    cuadrillas: ICuadrilla[];
}

export interface ICuadrilla{
    nombre: string;
    empleado: IEmpleadoCuadrilla[];
    sectores:ISectsCuadrilla[];
    showInfo?: boolean;
    palabra?: string;
}

export interface IEmpleadoCuadrilla{
    numEmpleado: number;
    nombre: string;
    incidencias: IIncidenciasCuadrillaEmpleado[];
    bloqueado?: boolean;
}

export interface IIncidenciasCuadrillaEmpleado{
    hora: string;
    comentario:string;
}

export interface ISectsCuadrilla{
    idPlantacion: number;
    idRancho: number;
    nombre?: string;
    rancho?: string;
    horaInicio: string;
    horaFin: string;
    horas?: number;
}
