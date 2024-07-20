import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclepageComponent } from './vehiclepage.component';

const routes: Routes = [{ path: '', component: VehiclepageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclepageRoutingModule { }
