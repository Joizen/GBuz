import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchplanactivepageRoutingModule } from './searchplanactivepage-routing.module';
import { SearchplanactivepageComponent } from './searchplanactivepage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    SearchplanactivepageComponent
  ],
  imports: [
    CommonModule,
    SearchplanactivepageRoutingModule,
    MaterialModule
  ]
})
export class SearchplanactivepageModule { }
export interface  PlanactiveModel { 
  roundname: string;  
  routename: string;  
  company: string;  
  item: number;
  routedate: string;  
  routetime: string;  
  vname: string;   
  driverfullname: string;  
  phone: string;  
  mobile: string;  
  drivername: string;  
  surname: string;  
  nickname:  string;  
  driverlicense:  string;  
  dlicens: number;
  dlicensname: string;  
  linename:  string;  
  lineimage:  string;  
  vehicleid: string;  
  license: string;  
  provincename: string;  
  vtype: number;
  vtypename: string;  
  planid: string;  
  plandate: string;  
  masterid: string;  
  round: number;
  compid: number;
  routeid: number;
  shipid: number;
  vstatus: number;
  vstatusname: string;  
  vspeed: number;
  vlocation:  string;  
  vicon: string;  
  vupdate: string;  
  driverid: number;
  dstatus: number;
  datatusname: string;  
  dicon: string;  
  wakeupstart: string;  
  wakeuptaget: string;  
  wakeuptime: string;  
  wakeupstatus: number;
  starttaget: string;  
  starttime: string;  
  startstatus: number;
  algohaltime: string;  
  algohallevel: number;
  algohalstatus: number;
  temptime: string;  
  templevel: number;
  tempstatus: number;
  tagetfistpoint: string;  
  tagetendpoint: string;  
  fistpoint: string;  
  endpoint: string;  
  endlat: number;
  endlng: number;
  transtatus: number;
  modified: string;  
}