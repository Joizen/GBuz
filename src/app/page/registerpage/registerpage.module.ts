import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterpageRoutingModule } from './registerpage-routing.module';
import { RegisterpageComponent } from './registerpage.component';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [
    RegisterpageComponent
  ],
  imports: [
    CommonModule,
    RegisterpageRoutingModule,
    MaterialModule
  ]
})
export class RegisterpageModule { }
