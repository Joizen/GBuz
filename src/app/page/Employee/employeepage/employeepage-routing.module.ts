import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeepageComponent } from './employeepage.component';

const routes: Routes = [{ path: '', component: EmployeepageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeepageRoutingModule { }
