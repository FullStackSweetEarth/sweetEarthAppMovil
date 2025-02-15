import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DomingosPage } from './domingos.page';

const routes: Routes = [
  {
    path: '',
    component: DomingosPage
  },
  {
    path: 'actividad/:id',
    loadChildren: () => import('./actividad/actividad.module').then( m => m.ActividadPageModule)
  },
  {
    path: 'actividad',
    loadChildren: () => import('./actividad/actividad.module').then( m => m.ActividadPageModule)
  },
  {
    path: 'plantilla',
    loadChildren: () => import('./plantilla/plantilla.module').then( m => m.PlantillaPageModule)
  },
  {
    path: 'plantilla/:id',
    loadChildren: () => import('./plantilla/plantilla.module').then( m => m.PlantillaPageModule)
  },
  {
    path: 'cosecha/:idRancho/:idSupervisor',
    loadChildren: () => import('./cosecha/cosecha.module').then( m => m.CosechaPageModule)
  },
  {
    path: 'horas/:idRancho/:idSupervisor/:especial',
    loadChildren: () => import('./horas/horas.module').then( m => m.HorasPageModule)
  },
  {
    path: 'dia/:idRancho/:idSupervisor/:especial',
    loadChildren: () => import('./dia/dia.module').then( m => m.DiaPageModule)
  },
  {
    path: 'voleo/:fecha',
    loadChildren: () => import('./voleo/voleo.module').then( m => m.VoleoPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DomingosPageRoutingModule {}
