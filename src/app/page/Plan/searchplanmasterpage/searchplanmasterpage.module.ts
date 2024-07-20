import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchplanmasterpageRoutingModule } from './searchplanmasterpage-routing.module';
import { SearchplanmasterpageComponent } from './searchplanmasterpage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    SearchplanmasterpageComponent
  ],
  imports: [
    CommonModule,
    SearchplanmasterpageRoutingModule,
    MaterialModule
  ]
})
export class SearchplanmasterpageModule { }
export interface  PlanmasterModel { 
  company: string;
  shipname: string;
  roundname: string;
  routename: string;
  item: number;
  vname: string;
  vlicense: string;
  provincename: string;
  driverfullname: string;
  phone: string;
  mobile: string;
  linename: string;
  lineimage: string;
  nickname: string;
  drivername: string;
  surname: string;
  dlicensname: string;
  dlicense: string;
  dlicensetype: number;
  province: number;
  provincecode: string;
  round: number;
  planid: number;
  compid: number;
  routeid: number;
  shipid: number;
  vehicleid: number;
  vtypename: string;
  transtatus: number;
}