import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapurarHorariosPage } from './capurar-horarios.page';

const routes: Routes = [
  {
    path: '',
    component: CapurarHorariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapurarHorariosPageRoutingModule {}
