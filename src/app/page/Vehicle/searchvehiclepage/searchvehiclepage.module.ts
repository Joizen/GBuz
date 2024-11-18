import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchvehiclepageRoutingModule } from './searchvehiclepage-routing.module';
import { SearchvehiclepageComponent } from './searchvehiclepage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { VehiclepageModule } from "../vehiclepage/vehiclepage.module";

@NgModule({
  declarations: [
    SearchvehiclepageComponent
  ],
  imports: [
    CommonModule,
    SearchvehiclepageRoutingModule,
    MaterialModule,
    FormsModule,
    VehiclepageModule
]
})
export class SearchvehiclepageModule { }
