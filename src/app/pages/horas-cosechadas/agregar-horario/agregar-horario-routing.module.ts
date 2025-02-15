import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarHorarioPage } from './agregar-horario.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarHorarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarHorarioPageRoutingModule {}
