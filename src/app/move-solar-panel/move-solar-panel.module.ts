import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoveSolarPanelPageRoutingModule } from './move-solar-panel-routing.module';

import { MoveSolarPanelPage } from './move-solar-panel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoveSolarPanelPageRoutingModule
  ],
  declarations: [MoveSolarPanelPage]
})
export class MoveSolarPanelPageModule {}
