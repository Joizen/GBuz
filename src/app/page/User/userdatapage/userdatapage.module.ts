import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserdatapageRoutingModule } from './userdatapage-routing.module';
import { UserdatapageComponent } from './userdatapage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserdatapageComponent
  ],
  imports: [
    CommonModule,
    UserdatapageRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports:[
    UserdatapageComponent
  ]
})
export class UserdatapageModule { }
