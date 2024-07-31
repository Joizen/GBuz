import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchdriverpageRoutingModule } from './searchdriverpage-routing.module';
import { SearchdriverPageComponent } from './searchdriverpage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    SearchdriverPageComponent
  ],
  imports: [
    CommonModule,
    SearchdriverpageRoutingModule,
    MaterialModule
  ]
})
export class SearchdriverpageModule { }
export interface  DriverModel { 
  id: number;
  driverfullname: string; 
  drivername: string;  
  surname: string;  
  nickname: string; 
  license: string; 
  licensetype: string;  
  phone: string; 
  mobile: string;  
  linename: string; 
  lineimage: string;  
}