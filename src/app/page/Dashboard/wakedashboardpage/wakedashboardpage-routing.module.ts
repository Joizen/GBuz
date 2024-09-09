import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WakedashboardpageComponent } from './wakedashboardpage.component';

const routes: Routes = [{ path: '', component: WakedashboardpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WakedashboardpageRoutingModule { }
