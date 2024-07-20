import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverregisterpageComponent } from './driverregisterpage.component';

const routes: Routes = [{ path: '', component: DriverregisterpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverregisterpageRoutingModule { }
