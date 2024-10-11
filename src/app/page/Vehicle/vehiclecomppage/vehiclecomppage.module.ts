import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclecomppageRoutingModule } from './vehiclecomppage-routing.module';
import { VehiclecomppageComponent } from './vehiclecomppage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { VehiclepageModule } from "../vehiclepage/vehiclepage.module";
import { PlandatapageModule } from '../../Plan/plandatapage/plandatapage.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VehiclecomppageComponent
  ],
  imports: [
    CommonModule,
    VehiclecomppageRoutingModule,
    MaterialModule,
    VehiclepageModule,
    PlandatapageModule,
    FormsModule
],
  exports:[
    VehiclecomppageComponent
  ]
})
export class VehiclecomppageModule { }
