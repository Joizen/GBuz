import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverworkpageComponent } from './driverworkpage.component';

const routes: Routes = [{ path: '', component: DriverworkpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverworkpageRoutingModule { }
