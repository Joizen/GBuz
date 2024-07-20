import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmjobpageRoutingModule } from './confirmjobpage-routing.module';
import { ConfirmjobpageComponent } from './confirmjobpage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    ConfirmjobpageComponent
  ],
  imports: [
    CommonModule,
    ConfirmjobpageRoutingModule,
    MaterialModule
  ]
})
export class ConfirmjobpageModule { }
