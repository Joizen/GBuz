import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmjobpageComponent } from './confirmjobpage.component';

const routes: Routes = [{ path: '', component: ConfirmjobpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmjobpageRoutingModule { }
