import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapturaRevisionPage } from './captura-revision.page';

const routes: Routes = [
  {
    path: '',
    component: CapturaRevisionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapturaRevisionPageRoutingModule {}
