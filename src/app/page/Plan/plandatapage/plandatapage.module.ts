import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlandatapageRoutingModule } from './plandatapage-routing.module';
import { PlandatapageComponent } from './plandatapage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    PlandatapageComponent
  ],
  imports: [
    CommonModule,
    PlandatapageRoutingModule,
    MaterialModule
  ]
})
export class PlandatapageModule { }
