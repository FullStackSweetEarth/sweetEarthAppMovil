import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorasCosechadasPage } from './horas-cosechadas.page';

const routes: Routes = [
  {
    path: '',
    component: HorasCosechadasPage
  },
  {
    path: 'agregar-horario/:sec/:rch/:sup',
    loadChildren: () => import('./agregar-horario/agregar-horario.module').then( m => m.AgregarHorarioPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorasCosechadasPageRoutingModule {}
