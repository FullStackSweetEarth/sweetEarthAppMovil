import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscar4'
})
export class Buscar4Pipe implements PipeTransform {

  transform(items: Array<any>, atributos: string[] = [], clave): Array<any> {
    if (!clave || clave === 0) {
        return items;
    }
      return items.filter(d => this.valdador(atributos,clave.toString().toLowerCase(),d));
  }
  valdador(atributos, clave, data){
    for (const atributo of atributos) {
      if((data[atributo]+'').toString().toLowerCase().includes(clave)){return true; }
    }
  }
}
