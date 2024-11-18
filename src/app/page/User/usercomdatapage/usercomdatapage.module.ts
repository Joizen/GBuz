import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsercomdatapageRoutingModule } from './usercomdatapage-routing.module';
import { UsercomdatapageComponent } from './usercomdatapage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsercomdatapageComponent
  ],
  imports: [
    CommonModule,
    UsercomdatapageRoutingModule,    
    MaterialModule,
    FormsModule
  ],exports:[
    UsercomdatapageComponent
  ]
})
export class UsercomdatapageModule { }
