import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Fichasv2Page } from './fichasv2.page';

const routes: Routes = [
  {
    path: '',
    component: Fichasv2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Fichasv2PageRoutingModule {}
