import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage2 } from './home2.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage2,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
