import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAzimuthPageRoutingModule } from './view-azimuth-routing.module';

import { ViewAzimuthPage } from './view-azimuth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAzimuthPageRoutingModule
  ],
  declarations: [ViewAzimuthPage]
})
export class ViewAzimuthPageModule {}
