import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LmapRoutingModule } from './lmap-routing.module';
import { LmapComponent } from './lmap.component';


@NgModule({
  declarations: [
    LmapComponent
  ],
  imports: [
    CommonModule,
    LmapRoutingModule
  ]
})
export class LmapModule { }
