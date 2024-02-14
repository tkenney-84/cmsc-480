import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewGraphPage } from './view-graph.page';

const routes: Routes = [
  {
    path: '',
    component: ViewGraphPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewGraphPageRoutingModule {}
