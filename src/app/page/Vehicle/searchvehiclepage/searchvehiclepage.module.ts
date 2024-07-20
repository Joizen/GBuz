import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchvehiclepageRoutingModule } from './searchvehiclepage-routing.module';
import { SearchvehiclepageComponent } from './searchvehiclepage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    SearchvehiclepageComponent
  ],
  imports: [
    CommonModule,
    SearchvehiclepageRoutingModule,
    MaterialModule
  ]
})
export class SearchvehiclepageModule { }
export interface  VehicleModel { 
  id: number;
  vname: string; 
  license: string;
  province: number;
  provincename: string; 
  vtype: number;
  driverfullname: string; 
  drivername: string; 
  surname: string; 
  nickname: string; 
  phone: string; 
  mobile: string; 
  linename: string; 
  lineimage: string; 
  provincecode: string; 
  driverid: number;
  driverlicense: string; 
  driverlicensetype: number;
  totaltrip: number;
  totalship0: number;
  totalship1: number;
}