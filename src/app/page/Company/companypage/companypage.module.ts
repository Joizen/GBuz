import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanypageRoutingModule } from './companypage-routing.module';
import { CompanypageComponent } from './companypage.component';
import { MaterialModule } from '../../../material/material.module';


@NgModule({
  declarations: [
    CompanypageComponent
  ],
  imports: [
    CommonModule,
    CompanypageRoutingModule,
    MaterialModule
  ],
  exports:[
    CompanypageComponent
  ]
})
export class CompanypageModule { }
