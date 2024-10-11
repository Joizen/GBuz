import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlandatapageRoutingModule } from './plandatapage-routing.module';
import { PlandatapageComponent } from './plandatapage.component';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PlandatapageComponent
  ],
  imports: [
    CommonModule,
    PlandatapageRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports:[
    PlandatapageComponent
  ]
})
export class PlandatapageModule { }
