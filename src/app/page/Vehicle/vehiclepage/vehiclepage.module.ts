import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclepageRoutingModule } from './vehiclepage-routing.module';
import { VehiclepageComponent } from './vehiclepage.component';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  declarations: [
    VehiclepageComponent
  ],
  imports: [
    CommonModule,
    VehiclepageRoutingModule,QRCodeModule
  ]
})
export class VehiclepageModule { }
