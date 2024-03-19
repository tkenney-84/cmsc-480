import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAzimuthPage } from './view-azimuth.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAzimuthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAzimuthPageRoutingModule {}
