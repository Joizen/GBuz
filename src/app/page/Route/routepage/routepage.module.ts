import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutepageRoutingModule } from './routepage-routing.module';
import { RoutepageComponent } from './routepage.component';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    RoutepageComponent
  ],
  imports: [
    CommonModule,
    RoutepageRoutingModule,
    MaterialModule,
  ],
  exports:[
    RoutepageComponent
  ]
})
export class RoutepageModule { }
