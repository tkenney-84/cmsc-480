import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Page404Page } from './page404/page404.page';

const routes: Routes = [
  {
    path: 'home2',
    loadChildren: () => import('./homeTest/home2.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'view-graph',
    loadChildren: () => import('./view-graph/view-graph.module').then( m => m.ViewGraphPageModule)
  },
  {
    path: 'view-azimuth',
    loadChildren: () => import('./view-azimuth/view-azimuth.module').then( m => m.ViewAzimuthPageModule)
  },
  {
    path: 'move-solar-panel',
    loadChildren: () => import('./move-solar-panel/move-solar-panel.module').then( m => m.MoveSolarPanelPageModule)
  },
  {
    path: 'page404',
    loadChildren: () => import('./page404/page404.module').then( m => m.Page404PageModule)
  },

  // The wildcard route MUST be at the end 
  { path: '**', component: Page404Page }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
