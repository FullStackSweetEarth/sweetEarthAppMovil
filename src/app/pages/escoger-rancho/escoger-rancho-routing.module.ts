import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscogerRanchoPage } from './escoger-rancho.page';

const routes: Routes = [
  {
    path: '',
    component: EscogerRanchoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscogerRanchoPageRoutingModule {}
