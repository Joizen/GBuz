import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanmasterpageComponent } from './planmasterpage.component';

const routes: Routes = [{ path: '', component: PlanmasterpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanmasterpageRoutingModule { }
