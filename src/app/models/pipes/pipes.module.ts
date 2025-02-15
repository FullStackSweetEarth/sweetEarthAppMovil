import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SinDataPipe } from 'src/app/pipes/sin-data.pipe';



@NgModule({
  declarations: [SinDataPipe],
  imports: [
    CommonModule
  ], exports:[SinDataPipe]
})
export class PipesModule { }
