import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sinData'
})
export class SinDataPipe implements PipeTransform {

  transform(value: number | string): string | number {
    let msj: string | number = 'Sin datos';
    if(String(value).length >0 && value != null){
      msj = value;
    }
    return msj;
  }

}
