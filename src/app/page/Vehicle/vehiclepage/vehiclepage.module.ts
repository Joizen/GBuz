import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclepageRoutingModule } from './vehiclepage-routing.module';
import { VehiclepageComponent } from './vehiclepage.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VehiclepageComponent
  ],
  imports: [
    CommonModule,
    VehiclepageRoutingModule,
    QRCodeModule,
    MaterialModule,
    FormsModule
  ],
  exports:[
    VehiclepageComponent
  ]
})
export class VehiclepageModule { }
