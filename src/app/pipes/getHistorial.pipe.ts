import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'historial'
})
export class getHistorialPipe implements PipeTransform {

  transform(items: Array<any>, atributos: string[] = [], clave, atributo2): Array<any> {
    if (!clave || clave === 0) {
        return items;
    }
    let datos: any = items.find(d => this.valdador(atributos, clave.toString().toLowerCase(), d));
    datos = datos ? datos[atributo2] : [];
    return datos;
}
  valdador(atributos, clave, data){
    for (const atributo of atributos) {
      if((data[atributo]+'').toString().toLowerCase().includes(clave)){return true; }
    }
  }
}
