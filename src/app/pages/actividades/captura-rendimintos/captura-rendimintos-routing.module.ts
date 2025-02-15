import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapturaRendimintosPage } from './captura-rendimintos.page';

const routes: Routes = [
  {
    path: '',
    component: CapturaRendimintosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapturaRendimintosPageRoutingModule {}
