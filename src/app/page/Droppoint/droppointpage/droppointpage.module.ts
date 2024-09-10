import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DroppointpageRoutingModule } from './droppointpage-routing.module';
import { DroppointpageComponent } from './droppointpage.component';


@NgModule({
  declarations: [
    DroppointpageComponent
  ],
  imports: [
    CommonModule,
    DroppointpageRoutingModule
  ],
  exports:[
    DroppointpageComponent
  ]
})
export class DroppointpageModule { }
