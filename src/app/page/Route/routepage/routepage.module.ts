import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutepageRoutingModule } from './routepage-routing.module';
import { RoutepageComponent } from './routepage.component';


@NgModule({
  declarations: [
    RoutepageComponent
  ],
  imports: [
    CommonModule,
    RoutepageRoutingModule
  ],
  exports:[
    RoutepageComponent
  ]
})
export class RoutepageModule { }
