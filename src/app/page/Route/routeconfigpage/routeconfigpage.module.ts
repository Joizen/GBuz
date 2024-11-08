import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouteconfigpageRoutingModule } from './routeconfigpage-routing.module';
import { RouteconfigpageComponent } from './routeconfigpage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RouteconfigpageComponent
  ],
  imports: [
    CommonModule,
    RouteconfigpageRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports:[
    RouteconfigpageComponent
  ]
})
export class RouteconfigpageModule { }
