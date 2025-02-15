import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionesPage } from './evaluaciones.page';
const routes: Routes = [
  {
    path: '',
    component: EvaluacionesPage
  },
  {
    path: 'cosecha',
    loadChildren: () => import('./cosecha/cosecha.module').then( m => m.CosechaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluacionesPageRoutingModule {}
