import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeecomppageRoutingModule } from './employeecomppage-routing.module';
import { EmployeecomppageComponent } from './employeecomppage.component';
import { EmployeepageModule } from "../employeepage/employeepage.module";
import { MaterialModule } from '../../../material/material.module';


@NgModule({
  declarations: [
    EmployeecomppageComponent
  ],
  imports: [
    CommonModule,
    EmployeecomppageRoutingModule,
    EmployeepageModule,
    MaterialModule
],
  exports:[
    EmployeecomppageComponent
  ]
})
export class EmployeecomppageModule { }
