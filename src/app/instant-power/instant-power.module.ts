import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstantPowerPageRoutingModule } from './instant-power-routing.module';

import { InstantPowerPage } from './instant-power.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstantPowerPageRoutingModule
  ],
  declarations: [InstantPowerPage]
})
export class InstantPowerPageModule {}
