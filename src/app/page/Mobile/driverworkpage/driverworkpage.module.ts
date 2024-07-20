import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverworkpageRoutingModule } from './driverworkpage-routing.module';
import { DriverworkpageComponent } from './driverworkpage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    DriverworkpageComponent
  ],
  imports: [
    CommonModule,
    DriverworkpageRoutingModule,
    MaterialModule
  ]
})
export class DriverworkpageModule { }
