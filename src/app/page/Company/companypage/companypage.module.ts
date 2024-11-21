import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanypageRoutingModule } from './companypage-routing.module';
import { CompanypageComponent } from './companypage.component';
import { MaterialModule } from '../../../material/material.module';
import { EmployeecomppageModule } from "../../Employee/employeecomppage/employeecomppage.module";
import { RoutecomppageModule } from "../../Route/routecomppage/routecomppage.module";
import { VehiclecomppageModule } from "../../Vehicle/vehiclecomppage/vehiclecomppage.module";
import { DroppointcomppageModule } from "../../Droppoint/droppointcomppage/droppointcomppage.module";
import { UsercompageModule } from '../../User/usercompage/usercompage.module';
import { ShiftpageModule } from "../shiftpage/shiftpage.module";



@NgModule({
  declarations: [
    CompanypageComponent
  ],
  imports: [
    CommonModule,
    CompanypageRoutingModule,
    MaterialModule,
    EmployeecomppageModule,
    RoutecomppageModule,
    VehiclecomppageModule,
    DroppointcomppageModule,
    UsercompageModule,
    ShiftpageModule
],
  exports:[
    CompanypageComponent
  ]
})
export class CompanypageModule { }
