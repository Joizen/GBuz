import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrivercheckinpageRoutingModule } from './drivercheckinpage-routing.module';
import { DrivercheckinpageComponent } from './drivercheckinpage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    DrivercheckinpageComponent
  ],
  imports: [
    CommonModule,
    DrivercheckinpageRoutingModule,
    MaterialModule
  ]
})
export class DrivercheckinpageModule { }
