import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverregisterpageRoutingModule } from './driverregisterpage-routing.module';
import { DriverregisterpageComponent } from './driverregisterpage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    DriverregisterpageComponent
  ],
  imports: [
    CommonModule,
    DriverregisterpageRoutingModule,
    MaterialModule
  ]
})
export class DriverregisterpageModule { }
