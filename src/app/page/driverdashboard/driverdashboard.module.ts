import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverdashboardRoutingModule } from './driverdashboard-routing.module';
import { DriverdashboardComponent } from './driverdashboard.component';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [
    DriverdashboardComponent
  ],
  imports: [
    CommonModule,
    DriverdashboardRoutingModule,
    MaterialModule
  ]
})
export class DriverdashboardModule { }
