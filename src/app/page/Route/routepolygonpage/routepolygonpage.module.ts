import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutepolygonpageRoutingModule } from './routepolygonpage-routing.module';
import { RoutepolygonpageComponent } from './routepolygonpage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RoutepolygonpageComponent
  ],
  imports: [
    CommonModule,
    RoutepolygonpageRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports:[
    RoutepolygonpageComponent
  ]
})
export class RoutepolygonpageModule { }
