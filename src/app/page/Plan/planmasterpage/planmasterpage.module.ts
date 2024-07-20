import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanmasterpageRoutingModule } from './planmasterpage-routing.module';
import { PlanmasterpageComponent } from './planmasterpage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    PlanmasterpageComponent
  ],
  imports: [
    CommonModule,
    PlanmasterpageRoutingModule,
    MaterialModule
  ]
})
export class PlanmasterpageModule { }
