import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CosechaService {

  constructor(private _http: HttpClient) { }

  getBitacoraFecha(fecha) {
    const respuestaAPI = `${environment.urlAPI}/bitacora/resumenWK/0/0/0/${fecha}`;
    return this._http.get(respuestaAPI);
  }

  getFichasPublicas(fecha) {
    const respuestaAPI = `${environment.urlAPI}/bitacora/fichas/getFichasPublicas/0/0/${fecha}/0`;
    return this._http.get(respuestaAPI);
  }

  getRendimientosGaleras(fecha){
    const respuestaAPI = `${environment.urlAPI}/cosecha/galeras/get/${fecha}`;
    return this._http.get(respuestaAPI);
  }
}
