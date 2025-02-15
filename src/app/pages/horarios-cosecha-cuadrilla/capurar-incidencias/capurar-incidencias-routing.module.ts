import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapurarIncidenciasPage } from './capurar-incidencias.page';

const routes: Routes = [
  {
    path: '',
    component: CapurarIncidenciasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapurarIncidenciasPageRoutingModule {}
