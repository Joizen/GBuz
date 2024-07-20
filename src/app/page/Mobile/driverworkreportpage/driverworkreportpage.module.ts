import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverworkreportpageRoutingModule } from './driverworkreportpage-routing.module';
import { DriverworkreportpageComponent } from './driverworkreportpage.component';
import { MaterialModule } from '../../../material/material.module';
// import { GmapComponent} from 'src/app/gmap/gmap.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    DriverworkreportpageComponent
  ],
  imports: [
    CommonModule,
    DriverworkreportpageRoutingModule,
    MaterialModule,
    GoogleMapsModule
    // GmapComponent
],


})
export class DriverworkreportpageModule { }
