import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Page404Page } from './page404/page404.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'view-graph',
    loadChildren: () => import('./view-graph/view-graph.module').then( m => m.ViewGraphPageModule)
  },
  {
    path: 'move-solar-panel',
    loadChildren: () => import('./move-solar-panel/move-solar-panel.module').then( m => m.MoveSolarPanelPageModule)
  },
  {
    path: 'page404',
    loadChildren: () => import('./page404/page404.module').then( m => m.Page404PageModule)
  },
  {
    path: 'instant-power',
    loadChildren: () => import('./instant-power/instant-power.module').then( m => m.InstantPowerPageModule)
  },
  {
    path: 'demodev',
    loadChildren: () => import('./demodev/demodev.module').then( m => m.DemodevPageModule)
  },

  // RESOLVING UNKNOWN ROUTES
  // The wildcard route MUST be at the end. It sends all unknown routes to the
  // 404 page.
  { path: '**', redirectTo: '/page404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
