import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsercompageRoutingModule } from './usercompage-routing.module';
import { UsercompageComponent } from './usercompage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { UserdatapageModule } from "../userdatapage/userdatapage.module";
import { AddusercomppageModule } from "../addusercomppage/addusercomppage.module";
import { UserdatapageComponent } from '../userdatapage/userdatapage.component';
import { UsercomdatapageModule } from "../usercomdatapage/usercomdatapage.module";


@NgModule({
  declarations: [
    UsercompageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UsercompageRoutingModule,
    UserdatapageModule,
    AddusercomppageModule,
    UsercomdatapageModule
],
  exports:[
    UsercompageComponent
  ]
})
export class UsercompageModule { }
