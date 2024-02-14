import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoveSolarPanelPage } from './move-solar-panel.page';

const routes: Routes = [
  {
    path: '',
    component: MoveSolarPanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoveSolarPanelPageRoutingModule {}
