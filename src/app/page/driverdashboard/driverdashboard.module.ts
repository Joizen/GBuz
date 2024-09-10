import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverdashboardRoutingModule } from './driverdashboard-routing.module';
import { DriverdashboardComponent } from './driverdashboard.component';
import { MaterialModule } from '../../material/material.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  declarations: [
    DriverdashboardComponent
  ],
  imports: [
    CommonModule,
    DriverdashboardRoutingModule,
    MaterialModule,MatButtonModule, MatMenuModule
  ]
})
export class DriverdashboardModule { }
