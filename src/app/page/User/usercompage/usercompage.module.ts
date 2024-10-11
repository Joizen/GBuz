import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsercompageRoutingModule } from './usercompage-routing.module';
import { UsercompageComponent } from './usercompage.component';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    UsercompageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UsercompageRoutingModule
  ],
  exports:[
    UsercompageComponent
  ]
})
export class UsercompageModule { }
