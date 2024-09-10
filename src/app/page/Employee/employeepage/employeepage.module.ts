import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeepageRoutingModule } from './employeepage-routing.module';
import { EmployeepageComponent } from './employeepage.component';


@NgModule({
  declarations: [
    EmployeepageComponent
  ],
  imports: [
    CommonModule,
    EmployeepageRoutingModule
  ],
  exports:[
    EmployeepageComponent
  ]
})
export class EmployeepageModule { }
