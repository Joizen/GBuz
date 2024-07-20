import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverpageRoutingModule } from './driverpage-routing.module';
import { DriverpageComponent } from './driverpage.component';


@NgModule({
  declarations: [
    DriverpageComponent
  ],
  imports: [
    CommonModule,
    DriverpageRoutingModule
  ]
})
export class DriverpageModule { }
