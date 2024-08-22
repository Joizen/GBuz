import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WakeupdashboardRoutingModule } from './wakeupdashboard-routing.module';
import { WakeupdashboardComponent } from './wakeupdashboard.component';

import { MaterialModule } from '../../material/material.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    WakeupdashboardComponent
  ],
  imports: [
    CommonModule,
    WakeupdashboardRoutingModule,
    MaterialModule,MatButtonModule, MatMenuModule

  ]
})
export class WakeupdashboardModule { }
