import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BitacoraCajasPage } from './bitacora-cajas.page';

const routes: Routes = [
  {
    path: '',
    component: BitacoraCajasPage
  },
  {
    path: 'programa-cosecha',
    loadChildren: () => import('./programa-cosecha/programa-cosecha.module').then( m => m.ProgramaCosechaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BitacoraCajasPageRoutingModule {}
