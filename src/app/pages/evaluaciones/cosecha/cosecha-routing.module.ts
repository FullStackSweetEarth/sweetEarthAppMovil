import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CosechaPage } from './cosecha.page';
const routes: Routes = [
  {
    path: '',
    component: CosechaPage
  },
  {
    path: 'revisiones/:numEmpleado/:fecha/:nombre',
    loadChildren: () => import('./detalles-revisiones/detalles-revisiones.module').then( m => m.DetallesRevisionesPageModule)
  },
  {
    path: 'captura/:numEmpleado/:fecha/:idRancho/:idSector/:nombre',
    loadChildren: () => import('./captura-revision/captura-revision.module').then( m => m.CapturaRevisionPageModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosechaPageRoutingModule {}
