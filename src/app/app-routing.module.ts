import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'cosecha/:id',
    loadChildren: () => import('./pages/bitacoras/cosecha/cosecha.module').then( m => m.CosechaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'escoger-rancho/:id',
    loadChildren: () => import('./pages/escoger-rancho/escoger-rancho.module').then( m => m.EscogerRanchoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'horas-cosechadas/:idRancho/:idSupervisor',
    loadChildren: () => import('./pages/horas-cosechadas/horas-cosechadas.module').then( m => m.HorasCosechadasPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'fumigacion/:id',
    loadChildren: () => import('./pages/fumigacion/fumigacion.module').then( m => m.FumigacionPageModule)
  },
  {
    path: 'rendimiento/:idRancho/:fecha',
    loadChildren: () => import('./pages/galeristas/rendimiento/rendimiento.module').then( m => m.RendimientoPageModule)
  },
  {
    path: 'domingos',
    loadChildren: () => import('./pages/domingos/domingos.module').then( m => m.DomingosPageModule)
  },
  {
    path: 'fichasv2/:idRancho/:idSupervisor',
    loadChildren: () => import('./pages/fichasv2/fichasv2.module').then( m => m.Fichasv2PageModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./pages/usuario/usuario.module').then( m => m.UsuarioPageModule)
  },
  {
    path: 'programa-actividades/:idRancho',
    loadChildren: () => import('./pages/programa-actividades/programa-actividades.module').then( m => m.ProgramaActividadesPageModule)
  },
  {
    path: 'bitacora-cajas',
    loadChildren: () => import('./pages/bitacora-cajas/bitacora-cajas.module').then( m => m.BitacoraCajasPageModule)
  },
  {
    path: 'evaluaciones',
    loadChildren: () => import('./pages/evaluaciones/evaluaciones.module').then( m => m.EvaluacionesPageModule)
  },
  {
    path: 'soporte',
    loadChildren: () => import('./pages/soporte/soporte.module').then( m => m.SoportePageModule)
  },
  {
    path: 'actividades',
    loadChildren: () => import('./pages/actividades/actividades.module').then( m => m.ActividadesPageModule)
  },
  {
    path: 'verificar-sincronizacion',
    loadChildren: () => import('./pages/verificar-sincronizacion/verificar-sincronizacion.module').then( m => m.VerificarSincronizacionPageModule)
  },
  {
    path: 'monitoreo/captura',
    loadChildren: () => import('./pages/monitotreo/captura/captura.module').then( m => m.CapturaPageModule)
  },  {
    path: 'horarios-cosecha-cuadrilla',
    loadChildren: () => import('./pages/horarios-cosecha-cuadrilla/horarios-cosecha-cuadrilla.module').then( m => m.HorariosCosechaCuadrillaPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
