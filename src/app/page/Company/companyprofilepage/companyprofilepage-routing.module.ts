import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyprofilepageComponent } from './companyprofilepage.component';

const routes: Routes = [{ path: '', component: CompanyprofilepageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyprofilepageRoutingModule { }
