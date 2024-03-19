import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstantPowerPage } from './instant-power.page';

const routes: Routes = [
  {
    path: '',
    component: InstantPowerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstantPowerPageRoutingModule {}
