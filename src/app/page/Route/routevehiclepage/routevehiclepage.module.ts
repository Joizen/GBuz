import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutevehiclepageRoutingModule } from './routevehiclepage-routing.module';
import { RoutevehiclepageComponent } from './routevehiclepage.component';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    RoutevehiclepageComponent
  ],
  imports: [
    CommonModule,
    RoutevehiclepageRoutingModule,
    MaterialModule,
  ],
  exports:[
    RoutevehiclepageComponent
  ]
})
export class RoutevehiclepageModule { }
