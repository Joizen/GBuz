import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverdashboardComponent } from './driverdashboard.component';

const routes: Routes = [{ path: '', component: DriverdashboardComponent }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class DriverdashboardRoutingModule { }
