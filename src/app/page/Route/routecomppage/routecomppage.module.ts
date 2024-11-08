import { NgModule, LOCALE_ID  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutecomppageRoutingModule } from './routecomppage-routing.module';
import { RoutecomppageComponent } from './routecomppage.component';
import { MaterialModule } from '../../../material/material.module';
import { RoutepageModule } from "../routepage/routepage.module";
import { RoutevehiclepageModule } from '../routevehiclepage/routevehiclepage.module';
import { FormsModule } from '@angular/forms';
import { SelectvehicleplanpageModule } from "../../Plan/selectvehicleplanpage/selectvehicleplanpage.module";
import { PlandatapageModule } from '../../Plan/plandatapage/plandatapage.module';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { RouteconfigpageModule } from "../routeconfigpage/routeconfigpage.module";

registerLocaleData(localeTh);

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
    PlandatapageModule,
    RouteconfigpageModule
],
  exports:[
    RoutecomppageComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'th' }  // Set Thai locale for this module
  ],
})
export class RoutecomppageModule { }
