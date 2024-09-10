import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclecomppageComponent } from './vehiclecomppage.component';

const routes: Routes = [{ path: '', component: VehiclecomppageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclecomppageRoutingModule { }
