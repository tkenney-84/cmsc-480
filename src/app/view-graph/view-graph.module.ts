import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewGraphPageRoutingModule } from './view-graph-routing.module';

import { ViewGraphPage } from './view-graph.page';
import { Chart } from 'chart.js';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewGraphPageRoutingModule
  ],
  declarations: [ViewGraphPage]
})
export class ViewGraphPageModule {}
