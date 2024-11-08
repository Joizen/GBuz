import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectvehicleplanpageRoutingModule } from './selectvehicleplanpage-routing.module';
import { SelectvehicleplanpageComponent } from './selectvehicleplanpage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SelectvehicleplanpageComponent
  ],
  imports: [
    CommonModule,
    SelectvehicleplanpageRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    SelectvehicleplanpageComponent
  ]
})
export class SelectvehicleplanpageModule { }
