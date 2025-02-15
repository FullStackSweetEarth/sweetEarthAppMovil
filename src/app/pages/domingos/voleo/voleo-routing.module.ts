import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoleoPage } from './voleo.page';

const routes: Routes = [
  {
    path: '',
    component: VoleoPage
  },
  {
    path: 'voleo-captura/:idPrograma',
    loadChildren: () => import('./voleo-captura/voleo-captura.module').then( m => m.VoleoCapturaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoleoPageRoutingModule {}
