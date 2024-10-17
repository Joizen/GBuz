import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddusercomppageRoutingModule } from './addusercomppage-routing.module';
import { AddusercomppageComponent } from './addusercomppage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddusercomppageComponent
  ],
  imports: [
    CommonModule,
    AddusercomppageRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports:[
    AddusercomppageComponent
  ]
})
export class AddusercomppageModule { }
