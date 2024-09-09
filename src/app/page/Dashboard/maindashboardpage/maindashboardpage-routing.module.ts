import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaindashboardpageComponent } from './maindashboardpage.component';

const routes: Routes = [{ path: '', component: MaindashboardpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaindashboardpageRoutingModule { }
