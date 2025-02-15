import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarInactivos'
})
export class FiltrarInactivosPipe implements PipeTransform {

  transform(items: Array<any>, atributos: string[] = []): Array<any> {
      return items.filter(d => d[atributos[0]] >0);
  }
}
