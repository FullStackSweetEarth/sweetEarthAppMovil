import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noMostrar'
})
export class NoMostrarPipe implements PipeTransform {

  transform(items: Array<any>, atributos: string[] = []): Array<any> {
      return items.filter(d => this.valdador(atributos,d));
  }
  valdador(atributos, data){
    for (const atributo of atributos) {
      if(Number(data.capturas[atributo])>0){return true; }
    }
  }

}
