import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramaCosechaPage } from './programa-cosecha.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramaCosechaPage
  },
  {
    path: 'capturar-cajas',
    loadChildren: () => import('./capturar-cajas/capturar-cajas.module').then( m => m.CapturarCajasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramaCosechaPageRoutingModule {}
