import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverpageComponent } from './driverpage.component';

const routes: Routes = [{ path: '', component: DriverpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverpageRoutingModule { }
