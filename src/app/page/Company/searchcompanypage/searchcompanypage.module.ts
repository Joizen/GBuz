import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchcompanypageRoutingModule } from './searchcompanypage-routing.module';
import { SearchcompanypageComponent } from './searchcompanypage.component';
import { MaterialModule } from '../../../material/material.module';
import { CompanypageModule } from "../companypage/companypage.module";
import { CompanyprofilepageModule } from "../companyprofilepage/companyprofilepage.module";
import { CompanymappageModule } from "../companymappage/companymappage.module";

@NgModule({
  declarations: [
    SearchcompanypageComponent
  ],
  imports: [
    CommonModule,
    SearchcompanypageRoutingModule,
    MaterialModule,
    CompanypageModule,
    CompanyprofilepageModule,
    CompanymappageModule
]
})
export class SearchcompanypageModule { }


