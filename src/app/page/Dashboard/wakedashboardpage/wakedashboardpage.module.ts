import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WakedashboardpageRoutingModule } from './wakedashboardpage-routing.module';
import { WakedashboardpageComponent } from './wakedashboardpage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    WakedashboardpageComponent
  ],
  imports: [
    CommonModule,
    WakedashboardpageRoutingModule,
    MaterialModule,
  ]
})
export class WakedashboardpageModule { }
