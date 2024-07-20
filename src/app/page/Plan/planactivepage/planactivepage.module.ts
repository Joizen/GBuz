import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanactivepageRoutingModule } from './planactivepage-routing.module';
import { PlanactivepageComponent } from './planactivepage.component';
import { MaterialModule } from '../../../material/material.module';


@NgModule({
  declarations: [
    PlanactivepageComponent
  ],
  imports: [
    CommonModule,
    PlanactivepageRoutingModule,
    MaterialModule
  ]
})
export class PlanactivepageModule { }
