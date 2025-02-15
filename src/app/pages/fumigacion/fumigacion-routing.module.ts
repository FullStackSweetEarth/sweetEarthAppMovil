import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FumigacionPage } from './fumigacion.page';

const routes: Routes = [
  {
    path: '',
    component: FumigacionPage
  },
  {
    path: 'capturas',
    loadChildren: () => import('./capturas/capturas.module').then( m => m.CapturasPageModule)
  },
  {
    path: 'capturas/:idCaptura',
    loadChildren: () => import('./capturas/capturas.module').then( m => m.CapturasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FumigacionPageRoutingModule {}
