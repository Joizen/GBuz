import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchdriverpageRoutingModule } from './searchdriverpage-routing.module';
import { SearchdriverpageComponent } from './searchdriverpage.component';


import { MaterialModule } from '../../../material/material.module';
import { DriverpageModule  } from '../../Driver/driverpage/driverpage.module';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    SearchdriverpageComponent,
  ],
  imports: [
    CommonModule,
    SearchdriverpageRoutingModule,
    MaterialModule,
    DriverpageModule,
    FormsModule
  ]
})
export class SearchdriverpageModule { }
