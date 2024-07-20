import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrivercheckinpageComponent } from './drivercheckinpage.component';

const routes: Routes = [{ path: '', component: DrivercheckinpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrivercheckinpageRoutingModule { }
