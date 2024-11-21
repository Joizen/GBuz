import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftpageRoutingModule } from './shiftpage-routing.module';
import { ShiftpageComponent } from './shiftpage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ShiftpageComponent
  ],
  imports: [
    CommonModule,
    ShiftpageRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports:[
    ShiftpageComponent
  ]
})
export class ShiftpageModule { }
