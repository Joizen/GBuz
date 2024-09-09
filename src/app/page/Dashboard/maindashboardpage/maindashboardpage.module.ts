import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaindashboardpageRoutingModule } from './maindashboardpage-routing.module';
import { MaindashboardpageComponent } from './maindashboardpage.component';
import { MaterialModule } from '../../../material/material.module';
import { DriverdetailpageRoutingModule } from '../driverdetailpage/driverdetailpage-routing.module';
import { DriverdetailpageModule } from "../driverdetailpage/driverdetailpage.module";



@NgModule({
  declarations: [
    MaindashboardpageComponent
  ],
  imports: [
    CommonModule,
    MaindashboardpageRoutingModule,
    MaterialModule,
    DriverdetailpageRoutingModule,
    DriverdetailpageModule
]
})
export class MaindashboardpageModule { }
