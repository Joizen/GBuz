import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchcompanypageRoutingModule } from './searchcompanypage-routing.module';
import { SearchcompanypageComponent } from './searchcompanypage.component';
import { MaterialModule } from '../../../material/material.module';
import { CompanypageModule } from "../companypage/companypage.module";

@NgModule({
  declarations: [
    SearchcompanypageComponent
  ],
  imports: [
    CommonModule,
    SearchcompanypageRoutingModule,
    MaterialModule,
    CompanypageModule
]
})
export class SearchcompanypageModule { }


