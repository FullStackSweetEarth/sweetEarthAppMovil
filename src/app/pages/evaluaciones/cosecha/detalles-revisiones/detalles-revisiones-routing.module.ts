import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesRevisionesPage } from './detalles-revisiones.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesRevisionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesRevisionesPageRoutingModule {}
