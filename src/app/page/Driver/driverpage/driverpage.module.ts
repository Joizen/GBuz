import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverpageRoutingModule } from './driverpage-routing.module';
import { QRCodeModule } from 'angularx-qrcode';
import { DriverpageComponent } from './driverpage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DriverpageComponent
  ],
  imports: [
    CommonModule,
    DriverpageRoutingModule,
    QRCodeModule,
    MaterialModule,
    FormsModule
  ],
  exports:[
    DriverpageComponent
  ]
})
export class DriverpageModule { }
