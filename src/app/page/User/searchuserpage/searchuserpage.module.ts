import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchuserpageRoutingModule } from './searchuserpage-routing.module';
import { SearchuserpageComponent } from './searchuserpage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { UserdatapageModule } from "../userdatapage/userdatapage.module";


@NgModule({
  declarations: [
    SearchuserpageComponent
  ],
  imports: [
    CommonModule,
    SearchuserpageRoutingModule,
    MaterialModule,
    FormsModule,
    UserdatapageModule
]
})
export class SearchuserpageModule { }
