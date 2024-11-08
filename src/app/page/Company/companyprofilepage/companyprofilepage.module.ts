import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyprofilepageRoutingModule } from './companyprofilepage-routing.module';
import { CompanyprofilepageComponent } from './companyprofilepage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CompanyprofilepageComponent
  ],
  imports: [
    CommonModule,
    CompanyprofilepageRoutingModule,
    MaterialModule,
    FormsModule
  ],
  exports:[
    CompanyprofilepageComponent
  ],
})
export class CompanyprofilepageModule { }
