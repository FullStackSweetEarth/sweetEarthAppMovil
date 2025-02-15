import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorariosCosechaCuadrillaPage } from './horarios-cosecha-cuadrilla.page';

const routes: Routes = [
  {
    path: '',
    component: HorariosCosechaCuadrillaPage
  },
  {
    path: 'capurar-horarios/:fecha/:idSupervisor/:cuadrilla',
    loadChildren: () => import('./capurar-horarios/capurar-horarios.module').then( m => m.CapurarHorariosPageModule)
  },
  {
    path: 'capurar-incidencias/:fecha/:idSupervisor/:cuadrilla/:numEmpleado',
    loadChildren: () => import('./capurar-incidencias/capurar-incidencias.module').then( m => m.CapurarIncidenciasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorariosCosechaCuadrillaPageRoutingModule {}
