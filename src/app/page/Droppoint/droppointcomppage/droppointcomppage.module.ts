import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DroppointcomppageRoutingModule } from './droppointcomppage-routing.module';
import { DroppointcomppageComponent } from './droppointcomppage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { DroppointpageModule } from "../droppointpage/droppointpage.module";


@NgModule({
  declarations: [
    DroppointcomppageComponent
  ],
  imports: [
    CommonModule,
    DroppointcomppageRoutingModule,
    MaterialModule,
    DroppointpageModule
],
  exports:[
    DroppointcomppageComponent
  ]
})
export class DroppointcomppageModule { }
