import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterpageRoutingModule } from './registerpage-routing.module';
import { RegisterpageComponent } from './registerpage.component';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RegisterpageComponent
  ],
  imports: [
    CommonModule,
    RegisterpageRoutingModule,
    MaterialModule,
    FormsModule
  ],exports:[
    RegisterpageComponent
  ]
})
export class RegisterpageModule { }
