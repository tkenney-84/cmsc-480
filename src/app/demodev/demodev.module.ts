import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemodevPageRoutingModule } from './demodev-routing.module';

import { DemodevPage } from './demodev.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemodevPageRoutingModule
  ],
  declarations: [DemodevPage]
})
export class DemodevPageModule {}
