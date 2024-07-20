import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclepageRoutingModule } from './vehiclepage-routing.module';
import { VehiclepageComponent } from './vehiclepage.component';


@NgModule({
  declarations: [
    VehiclepageComponent
  ],
  imports: [
    CommonModule,
    VehiclepageRoutingModule
  ]
})
export class VehiclepageModule { }
