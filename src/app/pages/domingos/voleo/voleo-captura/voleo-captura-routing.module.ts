import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoleoCapturaPage } from './voleo-captura.page';

const routes: Routes = [
  {
    path: '',
    component: VoleoCapturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoleoCapturaPageRoutingModule {}
