import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificarSincronizacionPage } from './verificar-sincronizacion.page';

const routes: Routes = [
  {
    path: '',
    component: VerificarSincronizacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificarSincronizacionPageRoutingModule {}
