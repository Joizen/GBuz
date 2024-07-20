import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanypageRoutingModule } from './companypage-routing.module';
import { CompanypageComponent } from './companypage.component';


@NgModule({
  declarations: [
    CompanypageComponent
  ],
  imports: [
    CommonModule,
    CompanypageRoutingModule
  ]
})
export class CompanypageModule { }
