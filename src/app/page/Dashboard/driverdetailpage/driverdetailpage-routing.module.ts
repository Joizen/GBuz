import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverdetailpageComponent } from './driverdetailpage.component';

const routes: Routes = [{ path: '', component: DriverdetailpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverdetailpageRoutingModule { }
