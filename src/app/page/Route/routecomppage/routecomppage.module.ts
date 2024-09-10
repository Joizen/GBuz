import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutecomppageRoutingModule } from './routecomppage-routing.module';
import { RoutecomppageComponent } from './routecomppage.component';
import { MaterialModule } from '../../../material/material.module';
import { RoutepageModule } from "../routepage/routepage.module";


@NgModule({
  declarations: [
    RoutecomppageComponent
  ],
  imports: [
    CommonModule,
    RoutecomppageRoutingModule,
    MaterialModule,
    RoutepageModule
],
  exports:[
    RoutecomppageComponent
  ]
})
export class RoutecomppageModule { }
