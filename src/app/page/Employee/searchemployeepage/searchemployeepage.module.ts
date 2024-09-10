import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchemployeepageRoutingModule } from './searchemployeepage-routing.module';
import { SearchemployeepageComponent } from './searchemployeepage.component';


@NgModule({
  declarations: [
    SearchemployeepageComponent
  ],
  imports: [
    CommonModule,
    SearchemployeepageRoutingModule
  ]
})
export class SearchemployeepageModule { }
