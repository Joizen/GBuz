import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverdetailpageRoutingModule } from './driverdetailpage-routing.module';
import { DriverdetailpageComponent } from './driverdetailpage.component';
import { MaterialModule } from '../../../material/material.module';


@NgModule({
  declarations: [
    DriverdetailpageComponent
  ],
  imports: [
    CommonModule,
    DriverdetailpageRoutingModule,
    MaterialModule
  ],
  exports:[
    DriverdetailpageComponent
  ]
})
export class DriverdetailpageModule { }
