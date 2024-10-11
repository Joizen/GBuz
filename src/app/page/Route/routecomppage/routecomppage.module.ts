import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutecomppageRoutingModule } from './routecomppage-routing.module';
import { RoutecomppageComponent } from './routecomppage.component';
import { MaterialModule } from '../../../material/material.module';
import { RoutepageModule } from "../routepage/routepage.module";
import { RoutevehiclepageModule } from '../routevehiclepage/routevehiclepage.module';
import { FormsModule } from '@angular/forms';
import { SelectvehicleplanpageModule } from "../../Plan/selectvehicleplanpage/selectvehicleplanpage.module";
import { PlandatapageModule } from '../../Plan/plandatapage/plandatapage.module';


@NgModule({
  declarations: [
    RoutecomppageComponent
  ],
  imports: [
    CommonModule,
    RoutecomppageRoutingModule,
    MaterialModule,
    RoutepageModule,
    RoutevehiclepageModule,
    FormsModule,
    SelectvehicleplanpageModule,
    PlandatapageModule
],
  exports:[
    RoutecomppageComponent
  ]
})
export class RoutecomppageModule { }
