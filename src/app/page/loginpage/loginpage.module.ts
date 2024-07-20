import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginpageRoutingModule } from './loginpage-routing.module';
import { LoginpageComponent } from './loginpage.component';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [
    LoginpageComponent
  ],
  imports: [
    CommonModule,
    LoginpageRoutingModule,
    MaterialModule
  ]
})
export class LoginpageModule { }
