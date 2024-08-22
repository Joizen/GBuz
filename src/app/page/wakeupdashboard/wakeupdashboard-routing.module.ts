import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WakeupdashboardComponent } from './wakeupdashboard.component';

const routes: Routes = [{ path: '', component: WakeupdashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WakeupdashboardRoutingModule { }
