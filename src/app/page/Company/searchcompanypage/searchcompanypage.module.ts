import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchcompanypageRoutingModule } from './searchcompanypage-routing.module';
import { SearchcompanypageComponent } from './searchcompanypage.component';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [
    SearchcompanypageComponent
  ],
  imports: [
    CommonModule,
    SearchcompanypageRoutingModule,
    MaterialModule,
  ]
})
export class SearchcompanypageModule { }
export interface  CompanyModel { 
  id: number;
  company: string;
  totalroute: number;
  totalemployee: number;
}

