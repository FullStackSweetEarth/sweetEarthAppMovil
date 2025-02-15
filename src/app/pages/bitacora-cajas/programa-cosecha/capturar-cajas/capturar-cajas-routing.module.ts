import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapturarCajasPage } from './capturar-cajas.page';

const routes: Routes = [
  {
    path: '',
    component: CapturarCajasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapturarCajasPageRoutingModule {}
