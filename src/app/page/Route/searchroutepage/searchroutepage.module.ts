import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchroutepageRoutingModule } from './searchroutepage-routing.module';
import { SearchroutepageComponent } from './searchroutepage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    SearchroutepageComponent
  ],
  imports: [
    CommonModule,
    SearchroutepageRoutingModule,
    MaterialModule
  ]
})
export class SearchroutepageModule { }
export interface  RouteModel { 
  id: number;
  routename: string;
  compid: number;
  company: string;
  totaltrip: number;
  totalship0: number;
  totalship1: number;
}