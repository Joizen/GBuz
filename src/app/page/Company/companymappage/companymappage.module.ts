import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanymappageRoutingModule } from './companymappage-routing.module';
import { CompanymappageComponent } from './companymappage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CompanymappageComponent
  ],
  imports: [
    CommonModule,
    CompanymappageRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    CompanymappageComponent
  ]
})
export class CompanymappageModule { }
