import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosechaPage } from './cosecha.page';

const routes: Routes = [
  {
    path: '',
    component: CosechaPage
  },
  {
    path: 'add-papeleta/:papeleta',
    loadChildren: () => import('./add-papeleta/add-papeleta.module').then( m => m.AddPapeletaPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosechaPageRoutingModule {}
